// Read-only metadata audit. Never fetches documents, objects, users or secret payloads.
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const require = createRequire(import.meta.url);
const project = "energie-kraft-next";
const { getGlobalDefaultAccount } = require("firebase-tools/lib/auth");
const { requireAuth } = require("firebase-tools/lib/requireAuth");
const apphosting = require("firebase-tools/lib/gcp/apphosting");
const functionsV2 = require("firebase-tools/lib/gcp/cloudfunctionsv2");
const storage = require("firebase-tools/lib/gcp/storage");
const auth = require("firebase-tools/lib/gcp/auth");
const secrets = require("firebase-tools/lib/gcp/secretManager");
const run = require("firebase-tools/lib/gcp/run");
const { FirestoreApi } = require("firebase-tools/lib/firestore/api");
const { Client } = require("firebase-tools/lib/apiv2");

const account = getGlobalDefaultAccount();
await requireAuth({
  project,
  nonInteractive: true,
  ...(account ? { user: account.user, tokens: account.tokens } : {}),
});
const result = {
  project,
  checkedAt: new Date().toISOString(),
  cliVersion: require("firebase-tools/package.json").version,
  checks: {},
};
async function check(name, task) {
  try {
    result.checks[name] = { ok: true, data: await task() };
  } catch (error) {
    result.checks[name] = {
      ok: false,
      status: error.status ?? error.original?.status ?? null,
      message: "Metadata check failed; no payload or credentials printed.",
    };
  }
}
function bindings(policy) {
  return (policy.bindings ?? []).map(({ role, members = [], condition }) => ({
    role,
    members: members.map((member) =>
      member.startsWith("serviceAccount:") || ["allUsers", "allAuthenticatedUsers"].includes(member)
        ? member
        : "<other principal>",
    ),
    conditional: Boolean(condition),
  }));
}
let backends = [],
  deployedFunctions = [];
await Promise.allSettled([
  check("appHosting", async () => {
    backends = (await apphosting.listBackends(project, "-")).backends;
    return backends.map((backend) => ({
      name: backend.name,
      uri: backend.uri,
      codebase: backend.codebase,
      serviceAccount: backend.serviceAccount,
      managedResources: backend.managedResources,
    }));
  }),
  check("functionsV2", async () => {
    const response = await functionsV2.listAllFunctions(project);
    deployedFunctions = response.functions;
    return {
      unreachable: response.unreachable,
      functions: deployedFunctions.map((fn) => ({
        name: fn.name,
        state: fn.state,
        updateTime: fn.updateTime,
        runtime: fn.buildConfig?.runtime,
        entryPoint: fn.buildConfig?.entryPoint,
        build: fn.buildConfig?.build,
        source:
          fn.buildConfig?.sourceProvenance?.resolvedStorageSource ??
          fn.buildConfig?.source?.storageSource,
        service: fn.serviceConfig?.service,
        revision: fn.serviceConfig?.revision,
        serviceAccountEmail: fn.serviceConfig?.serviceAccountEmail,
        ingressSettings: fn.serviceConfig?.ingressSettings,
        secrets: fn.serviceConfig?.secretEnvironmentVariables?.map(({ key, secret, version }) => ({
          key,
          secret,
          version,
        })),
      })),
    };
  }),
  check("firestoreDatabases", async () =>
    (await new FirestoreApi().listDatabases(project)).map((db) => ({
      name: db.name,
      locationId: db.locationId,
      type: db.type,
      databaseEdition: db.databaseEdition ?? "STANDARD",
      pointInTimeRecoveryEnablement: db.pointInTimeRecoveryEnablement,
      deleteProtectionState: db.deleteProtectionState,
    })),
  ),
  check("storageBuckets", async () =>
    (await storage.listBuckets(project)).map((bucket) => ({
      name: bucket.name,
      location: bucket.location,
      storageClass: bucket.storageClass,
      uniformAccess: bucket.iamConfiguration?.uniformBucketLevelAccess?.enabled,
      publicAccessPrevention: bucket.iamConfiguration?.publicAccessPrevention,
      softDeletePolicy: bucket.softDeletePolicy,
    })),
  ),
  check("authDomains", () => auth.getAuthDomains(project)),
  check("mailgunSecret", async () => {
    const secret = await secrets.getSecret(project, "MAILGUN_SENDING_KEY");
    return {
      name: secret.name,
      versions: await secrets.listSecretVersions(project, "MAILGUN_SENDING_KEY"),
      iam: bindings(await secrets.getIamPolicy(secret)),
    };
  }),
]);
for (const backend of backends) {
  const [, , , location, , backendId] = backend.name.split("/");
  await check(`rollouts:${backendId}`, async () => {
    const history = (await apphosting.listRollouts(project, location, backendId)).rollouts;
    return history
      .sort((a, b) => (b.createTime ?? "").localeCompare(a.createTime ?? ""))
      .slice(0, 8)
      .map(({ name, build, state, createTime }) => ({ name, build, state, createTime }));
  });
  await check(`domains:${backendId}`, async () =>
    (await apphosting.listDomains(project, location, backendId)).map(
      ({ name, domainName, serve, customDomainStatus }) => ({
        name,
        domainName,
        serve,
        customDomainStatus,
      }),
    ),
  );
  await check(`traffic:${backendId}`, () => apphosting.getTraffic(project, location, backendId));
  await check(`rollbackBuild:${backendId}`, async () => {
    const build = await apphosting.getBuild(project, location, backendId, "build-2026-10-19-004");
    return {
      name: build.name,
      state: build.state,
      source: { branch: build.source?.codebase?.branch, hash: build.source?.codebase?.hash },
      artifactStatus: build.artifactStatus,
      createTime: build.createTime,
    };
  });
}
await Promise.allSettled(
  deployedFunctions.map((fn) =>
    check(`invoker:${fn.buildConfig?.entryPoint}`, async () =>
      bindings(await run.getIamPolicy(fn.serviceConfig.service)),
    ),
  ),
);
// Source inspection is opt-in; the release-readiness audit defaults to metadata only.
// Inspect only three code files from selected deployed source archives, entirely in memory.
// No endpoint is invoked, and no archive, source text, credentials or personal recipient is printed.
for (const entryPoint of process.argv.includes("--include-deployed-source")
  ? ["submitContactLead", "submitApplication", "sendMailgunTest"]
  : []) {
  await check(`sourceFacts:${entryPoint}`, async () => {
    const fn = deployedFunctions.find((fn) => fn.buildConfig?.entryPoint === entryPoint);
    if (!fn) throw Error("Function unavailable");
    const source =
      fn.buildConfig.sourceProvenance?.resolvedStorageSource ?? fn.buildConfig.source.storageSource;
    const client = new Client({ urlPrefix: "https://storage.googleapis.com" });
    const response = await client.get(
      `/storage/v1/b/${source.bucket}/o/${encodeURIComponent(source.object)}`,
      {
        queryParams: { alt: "media", generation: source.generation },
        responseType: "stream",
        skipLog: { resBody: true },
      },
    );
    const chunks = [];
    for await (const chunk of response.body) chunks.push(chunk);
    const python = spawnSync(
      "python",
      [
        "-c",
        `import sys,io,zipfile,json,re
z=zipfile.ZipFile(io.BytesIO(sys.stdin.buffer.read()))
facts={}
for name in ['lib/index.js','lib/mailgun.js','lib/application-mail.js']:
 if name not in z.namelist(): continue
 entry=z.getinfo(name)
 if entry.file_size>1000000: raise ValueError('Code file unexpectedly large')
 s=z.read(name).decode('utf-8')
 facts[name]={'hasExpectedInquiryRecipient':'anfragen@energie-kraft.de' in s,'hasExpectedApplicationRecipient':'bewerbung@energie-kraft.de' in s,'hasOldInquiryRecipient':'anfrage@energie-kraft.de' in s,'applicationUsesDedicatedConstant':'APPLICATION_SUBMISSION_RECIPIENT' in s}
 if name=='lib/index.js':
  facts[name].update({'declaresSendMailgunTest':'sendMailgunTest' in s,'usesHttpRequestHandler':'onRequest' in s,'callsMailgunMessagesCreate':'messages.create' in s,'authGuardIndicators':any(x in s for x in ['verifyIdToken','verifySessionCookie','request.auth','req.auth','headers.authorization','requireAdmin','requireStaff','authenticate','x-api-key'])})
print(json.dumps(facts))`,
      ],
      { input: Buffer.concat(chunks), maxBuffer: 1_000_000 },
    );
    if (python.status !== 0) throw Error("Safe source inspection failed");
    return JSON.parse(python.stdout.toString());
  });
}
await mkdir(resolve("artifacts/sprint12-5-release"), { recursive: true });
await writeFile(
  resolve("artifacts/sprint12-5-release/firebase-readiness.json"),
  JSON.stringify(result, null, 2),
);
console.log(JSON.stringify(result, null, 2));

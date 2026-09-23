import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  deleteObject,
  getMetadata,
  ref,
  uploadBytes,
} from "firebase/storage";
import {
  afterAll,
  beforeAll,
  describe,
  it,
} from "vitest";

const PROJECT_ID = "demo-energie-kraft-next";
const HOST = "127.0.0.1";

let testEnvironment: RulesTestEnvironment;

beforeAll(async () => {
  const [firestoreRules, storageRules] =
    await Promise.all([
      readFile(
        resolve(process.cwd(), "firestore.rules"),
        "utf8",
      ),
      readFile(
        resolve(process.cwd(), "storage.rules"),
        "utf8",
      ),
    ]);

  testEnvironment = await initializeTestEnvironment({
    projectId: PROJECT_ID,

    firestore: {
      host: HOST,
      port: 8080,
      rules: firestoreRules,
    },

    storage: {
      host: HOST,
      port: 9199,
      rules: storageRules,
    },
  });
});

afterAll(async () => {
  await testEnvironment.cleanup();
});

describe("Firestore Security Rules – deny by default", () => {
  it("permits canonical staff/admin realtime reads but no user or lock writes", async () => {
    for (const role of ["admin", "staff"]) {
      const db = testEnvironment.authenticatedContext(`role-${role}`, { role }).firestore();
      await assertSucceeds(getDoc(doc(db, "adminRealtime", "leads")));
      await assertFails(setDoc(doc(db, "adminUsers", `role-${role}`), { role: "admin", active: true }));
      await assertFails(updateDoc(doc(db, "adminUsers", "other"), { role: "admin" }));
      await assertFails(getDoc(doc(db, "adminUsers", "other")));
      await assertFails(setDoc(doc(db, "adminLocks", "userManagement"), { owner: "fake" }));
      await assertFails(deleteDoc(doc(db, "adminUsers", "other")));
    }
  });
  it("rejects inactive profiles and does not let legacy flags override explicit staff roles", async () => {
    await testEnvironment.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), "adminUsers", "inactive-staff"), { role: "staff", active: false });
    });
    const disabled = testEnvironment.authenticatedContext("inactive-staff", { role: "staff" }).firestore();
    await assertFails(getDoc(doc(disabled, "adminRealtime", "leads")));
    const staff = testEnvironment.authenticatedContext("explicit-staff", { role: "staff", admin: true }).firestore();
    await assertFails(getDoc(doc(staff, "applications", "example")));
    const unknown = testEnvironment.authenticatedContext("unknown-role", { role: "unknown", admin: true }).firestore();
    await assertFails(getDoc(doc(unknown, "adminRealtime", "leads")));
  });
  it("denies all direct profile image writes, including for admins", async () => {
    for (const role of ["admin", "staff"]) {
      const storage = testEnvironment.authenticatedContext(`photo-${role}`, { role }).storage();
      await assertFails(uploadBytes(ref(storage, `adminUsers/photo-${role}/avatar.webp`), new Uint8Array([1,2,3]), { contentType: "image/webp" }));
      await assertFails(getMetadata(ref(storage, "adminUsers/other/avatar.webp")));
    }
  });
  it("verweigert nicht authentifizierten Dokumentzugriff", async () => {
    const firestore =
      testEnvironment
        .unauthenticatedContext()
        .firestore();

    await assertFails(
      getDoc(
        doc(firestore, "faqs", "test-faq"),
      ),
    );
  });

  it("verweigert nicht authentifizierte Schreibzugriffe", async () => {
    const firestore =
      testEnvironment
        .unauthenticatedContext()
        .firestore();

    await assertFails(
      setDoc(
        doc(firestore, "faqs", "test-faq"),
        {
          question: "Testfrage",
          answer: "Testantwort",
        },
      ),
    );
  });

  it("verweigert authentifizierten Benutzern Lesezugriffe", async () => {
    const firestore =
      testEnvironment
        .authenticatedContext("authenticated-user")
        .firestore();

    await assertFails(
      getDoc(
        doc(
          firestore,
          "faqCategories",
          "photovoltaik",
        ),
      ),
    );
  });
  it("verweigert nicht authentifizierten Zugriff auf das Admin-Realtime-Signal", async () => {
    const firestore =
      testEnvironment
        .unauthenticatedContext()
        .firestore();

    await assertFails(
      getDoc(
        doc(
          firestore,
          "adminRealtime",
          "leads",
        ),
      ),
    );
  });

  it("verweigert normalen Benutzern Zugriff auf das Admin-Realtime-Signal", async () => {
    const firestore =
      testEnvironment
        .authenticatedContext(
          "authenticated-user",
        )
        .firestore();

    await assertFails(
      getDoc(
        doc(
          firestore,
          "adminRealtime",
          "leads",
        ),
      ),
    );
  });

  it("erlaubt Admins das Lesen des Admin-Realtime-Signals", async () => {
    const firestore =
      testEnvironment
        .authenticatedContext(
          "admin-user",
          {
            admin: true,
            email: "admin@example.test",
          },
        )
        .firestore();

    await assertSucceeds(
      getDoc(
        doc(
          firestore,
          "adminRealtime",
          "leads",
        ),
      ),
    );
  });

  it("verweigert Admins Schreibzugriff auf das Admin-Realtime-Signal", async () => {
    const firestore =
      testEnvironment
        .authenticatedContext(
          "admin-user",
          {
            admin: true,
            email: "admin@example.test",
          },
        )
        .firestore();

    await assertFails(
      setDoc(
        doc(
          firestore,
          "adminRealtime",
          "leads",
        ),
        {
          revision: 999,
        },
      ),
    );
  });

  it("verweigert auch Benutzern mit Admin-Claim Schreibzugriffe", async () => {
    const firestore =
      testEnvironment
        .authenticatedContext(
          "admin-user",
          {
            admin: true,
            email: "admin@example.test",
          },
        )
        .firestore();

    await assertFails(
      setDoc(
        doc(
          firestore,
          "faqCategories",
          "photovoltaik",
        ),
        {
          name: "Photovoltaik",
          isActive: true,
        },
      ),
    );
  });

  it("verweigert Collection-Abfragen", async () => {
    const firestore =
      testEnvironment
        .unauthenticatedContext()
        .firestore();

    await assertFails(
      getDocs(
        collection(firestore, "leads"),
      ),
    );
  });

  it("verweigert Zugriffe auf unbekannte Collections", async () => {
    const firestore =
      testEnvironment
        .authenticatedContext("authenticated-user")
        .firestore();

    await assertFails(
      getDoc(
        doc(
          firestore,
          "unknownCollection",
          "unknownDocument",
        ),
      ),
    );
  });
});




describe("Storage Security Rules – deny by default", () => {
  const bucketUrl =
    `gs://${PROJECT_ID}.appspot.com`;

  it("verweigert nicht authentifizierte Uploads", async () => {
    const storage =
      testEnvironment
        .unauthenticatedContext()
        .storage(bucketUrl);

    const fileReference = ref(
      storage,
      "test/unauthenticated-upload.txt",
    );

    await assertFails(
      uploadBytes(
        fileReference,
        new Uint8Array([1, 2, 3]),
        {
          contentType: "text/plain",
        },
      ),
    );
  });

  it("verweigert authentifizierte Uploads", async () => {
    const storage =
      testEnvironment
        .authenticatedContext("authenticated-user")
        .storage(bucketUrl);

    const fileReference = ref(
      storage,
      "test/authenticated-upload.txt",
    );

    await assertFails(
      uploadBytes(
        fileReference,
        new Uint8Array([1, 2, 3]),
        {
          contentType: "text/plain",
        },
      ),
    );
  });

  it("verweigert auch Benutzern mit Admin-Claim Uploads", async () => {
    const storage =
      testEnvironment
        .authenticatedContext(
          "admin-user",
          {
            admin: true,
            email: "admin@example.test",
          },
        )
        .storage(bucketUrl);

    const fileReference = ref(
      storage,
      "test/admin-upload.txt",
    );

    await assertFails(
      uploadBytes(
        fileReference,
        new Uint8Array([1, 2, 3]),
        {
          contentType: "text/plain",
        },
      ),
    );
  });

  it("verweigert das Lesen von Objektmetadaten", async () => {
    const storage =
      testEnvironment
        .authenticatedContext("authenticated-user")
        .storage(bucketUrl);

    const fileReference = ref(
      storage,
      "test/existing-file.txt",
    );

    await assertFails(
      getMetadata(fileReference),
    );
  });

  it("verweigert das Löschen von Objekten", async () => {
    const storage =
      testEnvironment
        .authenticatedContext("authenticated-user")
        .storage(bucketUrl);

    const fileReference = ref(
      storage,
      "test/existing-file.txt",
    );

    await assertFails(
      deleteObject(fileReference),
    );
  });
});

describe.each([
  ["applications", "application-test"],
  ["referrals", "referral-test"],
] as const)("Firestore Security Rules – private %s", (collectionName, documentId) => {
  async function seedDocument() {
    await testEnvironment.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), collectionName, documentId), {
        status: "new",
        createdAt: new Date(),
      });
    });
  }

  it("verweigert nicht authentifizierte Lesezugriffe", async () => {
    await seedDocument();
    const firestore = testEnvironment.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(firestore, collectionName, documentId)));
  });

  it("verweigert nicht authentifizierte direkte Creates", async () => {
    const firestore = testEnvironment.unauthenticatedContext().firestore();
    await assertFails(setDoc(doc(firestore, collectionName, "public-create"), { status: "new" }));
  });

  it("verweigert nicht autorisierte Updates", async () => {
    await seedDocument();
    const firestore = testEnvironment.authenticatedContext("ordinary-user").firestore();
    await assertFails(updateDoc(doc(firestore, collectionName, documentId), { status: "completed" }));
  });

  it("verweigert nicht autorisierte Deletes", async () => {
    await seedDocument();
    const firestore = testEnvironment.authenticatedContext("ordinary-user").firestore();
    await assertFails(deleteDoc(doc(firestore, collectionName, documentId)));
  });

  it("erlaubt Admins das Lesen", async () => {
    await seedDocument();
    const firestore = testEnvironment.authenticatedContext("admin-user", { admin: true }).firestore();
    await assertSucceeds(getDoc(doc(firestore, collectionName, documentId)));
  });

  it("verweigert auch Admin-Clients direkte Mutationen", async () => {
    await seedDocument();
    const firestore = testEnvironment.authenticatedContext("admin-user", { admin: true }).firestore();
    await assertFails(updateDoc(doc(firestore, collectionName, documentId), { status: "completed" }));
    await assertFails(deleteDoc(doc(firestore, collectionName, documentId)));
  });
});

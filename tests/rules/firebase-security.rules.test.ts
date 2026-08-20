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
  doc,
  getDoc,
  getDocs,
  setDoc,
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
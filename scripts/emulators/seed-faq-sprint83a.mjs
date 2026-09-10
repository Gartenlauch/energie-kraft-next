import { initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { faqGroups } from "./faq-sprint83a-data.mjs";

// Intentionally local-only. Never falls back to credentials or a live project.
const host = process.env.FIRESTORE_EMULATOR_HOST;
if (!host || !/^(127\.0\.0\.1|localhost):\d+$/.test(host))
  throw Error("Set FIRESTORE_EMULATOR_HOST to a loopback emulator address.");
const db = getFirestore(initializeApp({ projectId: "demo-energie-kraft-next" }));
const audit = {
  createdAt: FieldValue.serverTimestamp(),
  updatedAt: FieldValue.serverTimestamp(),
  createdBy: "local-sprint83a",
  updatedBy: "local-sprint83a",
};
for (const [index, group] of faqGroups.entries()) {
  const existing = await db.collection("faqCategories").where("slug", "==", group.slug).get();
  if (existing.size > 1) throw Error(`Duplicate category slug: ${group.slug}`);
  const category = existing.docs[0]?.ref ?? db.collection("faqCategories").doc(group.slug);
  if (existing.empty)
    await category.create({
      name: group.name,
      slug: group.slug,
      sortOrder: index * 10,
      isActive: true,
      ...audit,
    });
  let created = 0;
  for (const [order, [slug, question, shortAnswer, answer]] of group.questions.entries()) {
    const id = `s83a-${group.slug}-${slug}`;
    const ref = db.collection("faqs").doc(id);
    await db.runTransaction(async (transaction) => {
      if ((await transaction.get(ref)).exists) return;
      transaction.create(ref, {
        slug,
        question,
        shortAnswer,
        answer,
        categoryId: category.id,
        relatedFaqIds: group.questions
          .filter((q) => q[0] !== slug)
          .slice(0, 4)
          .map((q) => `s83a-${group.slug}-${q[0]}`),
        featured: order === 0,
        sortOrder: order * 10,
        isPublished: true,
        placements: [
          { routeKey: group.route, sortOrder: order * 10, showInSchema: true },
          ...(order === 0 ? [{ routeKey: "home", sortOrder: index * 10, showInSchema: true }] : []),
        ],
        ...audit,
      });
      created++;
    });
  }
  console.log(
    `${group.name}: ${created} created; ${group.questions.length} representative entries (existing documents preserved).`,
  );
}
await db.terminate();

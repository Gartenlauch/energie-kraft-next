import { z } from "zod";

import { FAQ_ROUTE_KEYS } from "@/config/routes";
import type {
    FaqCategoryCreateInput,
    FaqCategoryUpdateInput,
    FaqEntryCreateInput,
    FaqEntryUpdateInput,
    FaqPlacement,
} from "@/types/faq";

const MAX_SORT_ORDER = 100_000;

const slugSchema = z
    .string()
    .trim()
    .min(2, "Der Slug muss mindestens 2 Zeichen enthalten.")
    .max(100, "Der Slug darf höchstens 100 Zeichen enthalten.")
    .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Der Slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten.",
    );

const documentIdSchema = z
    .string()
    .trim()
    .min(1, "Die Dokument-ID ist erforderlich.")
    .max(128, "Die Dokument-ID darf höchstens 128 Zeichen enthalten.")
    .refine(
        (value) => !value.includes("/"),
        "Die Dokument-ID darf keinen Schrägstrich enthalten.",
    )
    .refine(
        (value) => !/^__.*__$/.test(value),
        "Dokument-IDs im Format __name__ sind reserviert.",
    );

const sortOrderSchema = z
    .number()
    .int("Die Sortierung muss eine ganze Zahl sein.")
    .min(0, "Die Sortierung darf nicht negativ sein.")
    .max(
        MAX_SORT_ORDER,
        `Die Sortierung darf höchstens ${MAX_SORT_ORDER} betragen.`,
    );

export const faqRouteKeySchema = z.enum(FAQ_ROUTE_KEYS);

export const faqPlacementSchema: z.ZodType<FaqPlacement> =
    z.object({
        routeKey: faqRouteKeySchema,
        sortOrder: sortOrderSchema,
        showInSchema: z.boolean(),
    });

const faqPlacementsSchema = z
    .array(faqPlacementSchema)
    .min(
        1,
        "Eine FAQ muss mindestens einer Route zugeordnet sein.",
    )
    .max(
        FAQ_ROUTE_KEYS.length,
        "Eine FAQ besitzt zu viele Route-Zuordnungen.",
    )
    .superRefine((placements, context) => {
        const routeKeys = new Set<string>();

        placements.forEach((placement, index) => {
            if (routeKeys.has(placement.routeKey)) {
                context.addIssue({
                    code: "custom",
                    path: [index, "routeKey"],
                    message:
                        "Jede Route darf einer FAQ nur einmal zugeordnet werden.",
                });

                return;
            }

            routeKeys.add(placement.routeKey);
        });
    });

export const faqCategoryCreateSchema = z.object({
    name: z
        .string()
        .trim()
        .min(
            2,
            "Der Kategoriename muss mindestens 2 Zeichen enthalten.",
        )
        .max(
            100,
            "Der Kategoriename darf höchstens 100 Zeichen enthalten.",
        ),
    slug: slugSchema,
    sortOrder: sortOrderSchema,
    isActive: z.boolean(),
});

export const faqCategoryUpdateSchema =
    faqCategoryCreateSchema.partial().refine(
        (value) => Object.keys(value).length > 0,
        {
            message:
                "Für eine Aktualisierung muss mindestens ein Feld angegeben werden.",
        },
    );
export const faqEntryCreateSchema = z.object({
    question: z
        .string()
        .trim()
        .min(
            5,
            "Die Frage muss mindestens 5 Zeichen enthalten.",
        )
        .max(
            250,
            "Die Frage darf höchstens 250 Zeichen enthalten.",
        ),
    answer: z
        .string()
        .trim()
        .min(
            10,
            "Die Antwort muss mindestens 10 Zeichen enthalten.",
        )
        .max(
            20_000,
            "Die Antwort darf höchstens 20.000 Zeichen enthalten.",
        ),
    categoryId: documentIdSchema,
    placements: faqPlacementsSchema,
    isPublished: z.boolean(),
});

export const faqEntryUpdateSchema =
    faqEntryCreateSchema.partial().refine(
        (value) => Object.keys(value).length > 0,
        {
            message:
                "Für eine Aktualisierung muss mindestens ein Feld angegeben werden.",
        },
    );

export function parseFaqCategoryCreateInput(
    value: unknown,
): FaqCategoryCreateInput {
    return faqCategoryCreateSchema.parse(value);
}

export function parseFaqCategoryUpdateInput(
    value: unknown,
): FaqCategoryUpdateInput {
    return faqCategoryUpdateSchema.parse(value);
}

export function parseFaqEntryCreateInput(
    value: unknown,
): FaqEntryCreateInput {
    return faqEntryCreateSchema.parse(value);
}

export function parseFaqEntryUpdateInput(
    value: unknown,
): FaqEntryUpdateInput {
    return faqEntryUpdateSchema.parse(value);
}
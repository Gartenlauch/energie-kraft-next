import type {
  ConfiguratorContactFormValues,
  ConfiguratorState,
  SubmitPhotovoltaicConfiguratorLeadInput,
} from "@/types/configurator";
import { hasPhotovoltaicConfiguratorResult } from "@/types/configurator";

export function buildPhotovoltaicConfiguratorLeadInput(
  state: ConfiguratorState,
  contactValues: ConfiguratorContactFormValues,
  formStartedAt: number,
): SubmitPhotovoltaicConfiguratorLeadInput | null {
  if (
    !hasPhotovoltaicConfiguratorResult(state) ||
    contactValues.installationAtResidence === null
  ) {
    return null;
  }

  const phone = contactValues.phone.trim();
  const website = contactValues.website.trim();

  return {
    type: "configurator",

    configurator: {
      type: "photovoltaic",

      answers: {
        household: {
          ...state.household,
        },

        building: {
          ...state.building,
        },

        roof: {
          ...state.roof,
        },

        interests: {
          ...state.interests,
        },

        notes: {
          ...state.notes,
        },
      },

      result: state.results.photovoltaic,
    },

    contact: {
      firstName: contactValues.firstName.trim(),
      lastName: contactValues.lastName.trim(),
      email: contactValues.email.trim(),

      ...(phone
        ? {
            phone,
          }
        : {}),
    },

    installation: {
      atResidence:
        contactValues.installationAtResidence,

      street: contactValues.street.trim(),
      postalCode: contactValues.postalCode.trim(),
      city: contactValues.city.trim(),
    },

    privacyAccepted:
      contactValues.privacyAccepted,

    ...(website
      ? {
          website,
        }
      : {}),

    formStartedAt,
  };
}
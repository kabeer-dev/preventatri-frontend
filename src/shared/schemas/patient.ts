import {z} from 'zod';

import {TranslateFunction} from '@/shared/types/common';
import {toDateTime} from '@/shared/utils/dateUtils';

import {commonSchema, nameFields} from './commonSchemaCreator';

export const patientFormSchema = ({t}: {t: TranslateFunction}) => {
  const commonFieldsSchema = commonSchema(t);

  return (
    z
      .object({
        // Personal Information (required)
        ...nameFields(t),
        dob: commonFieldsSchema.requiredValue({fieldName: 'Date of Birth'}),
        gender: commonFieldsSchema.requiredString({fieldName: 'Gender'}),

        // Location & Assignment (required)
        county: commonFieldsSchema.requiredString({fieldName: 'County'}),
        status: commonFieldsSchema.requiredString({fieldName: 'Status'}),

        // Optional nurse assignments, empty string = "not selected".
        primaryNurseProfileId: z.string(),
        secondaryNurseProfileId: z.string(),

        // HHAeXchange patients only; empty string = "not selected".
        caseManagerProfileId: z.string(),

        assignedRegion: z.string().optional(),

        // Address (optional)
        streetAddress: z.string().trim().optional(),
        city: z.string().trim().optional(),
        zipCode: z.string().trim().optional(),

        // Additional Information (optional)
        phoneNo: commonFieldsSchema
          .optionalPhoneNo({fieldName: 'Phone No'})
          .nullable(),
        emergencyContact: commonFieldsSchema
          .optionalPhoneNo({fieldName: 'Phone No'})
          .nullable(),
        medicaidId: commonFieldsSchema
          .text({fieldName: 'Medicaid ID', limit: 20})
          .optional(),
        diagnoses: commonFieldsSchema
          .text({fieldName: 'Diagnoses', limit: 2000})
          .optional(),
        notes: commonFieldsSchema
          .text({fieldName: 'Notes', limit: 2000})
          .optional(),
      })

      // The old test reached the sibling through Yup's `this.parent`, which Zod
      // has no equivalent of inside a field.
      .superRefine((values, ctx) => {
        const {primaryNurseProfileId, secondaryNurseProfileId} = values;

        if (!secondaryNurseProfileId || !primaryNurseProfileId) return;

        if (secondaryNurseProfileId === primaryNurseProfileId) {
          ctx.addIssue({
            code: 'custom',
            path: ['secondaryNurseProfileId'],
            message: t('validation.primarySecondaryNurseMustDiffer'),
          });
        }
      })
  );
};

export const patientAssignmentsFormSchema = ({t}: {t: TranslateFunction}) => {
  const commonFieldsSchema = commonSchema(t);

  const assignment = z
    .object({
      checklistTemplateId: commonFieldsSchema.requiredString({
        fieldName: 'Checklist Template',
      }),
      caregiverId: commonFieldsSchema.requiredString({fieldName: 'Caregiver'}),

      // Lets the collapsed row name a caregiver the dropdown no longer holds.
      // Never submitted.
      caregiverName: z.string().optional(),
      frequency: commonFieldsSchema.requiredString({fieldName: 'Frequency'}),
      startDate: commonFieldsSchema.requiredFutureDate({
        fieldName: 'Start Date',
      }),
      endDate: commonFieldsSchema.requiredValue({fieldName: 'End Date'}),
      notes: commonFieldsSchema
        .text({fieldName: 'Notes', limit: 2000})
        .optional(),
    })

    // endDate is compared against its sibling, so the check sits on the
    // assignment object rather than the field, and is scoped per array item.
    .superRefine((values, ctx) => {
      const startDate = toDateTime({value: values.startDate});
      const endDate = toDateTime({value: values.endDate});

      if (!startDate) return;

      if (!endDate || endDate < startDate) {
        ctx.addIssue({
          code: 'custom',
          path: ['endDate'],
          message: t('validation.endDateAfterStartDate'),
        });
      }
    });

  return z.object({assignments: z.array(assignment)});
};

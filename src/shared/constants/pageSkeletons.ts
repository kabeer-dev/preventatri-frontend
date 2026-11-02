import {layout} from '@/@core/theme/spacing';
import {ALERT_REVIEW_COLUMNS} from '@/shared/constants/alertReview';
import {REGION_CARD} from '@/shared/constants/regions';
import {SKELETON_LAYOUT} from '@/shared/constants/skeletons';
import {
  PageSkeletonProps,
  SkeletonCardProps,
} from '@/shared/interfaces/skeletons';
import {PageSkeletonBlock} from '@/shared/types/skeletons';

const PROFILE_TEMPLATE = {md: '5fr 7fr', lg: '4fr 8fr'};

const TABLE_TITLE_IN_CARD: PageSkeletonBlock = {
  type: 'table',
  titleInCard: true,
};

const PATIENT_BANNER: PageSkeletonBlock = {
  type: 'card',
  card: {
    header: 'none',
    rows: 1,
    row: {leading: 'circle', leadingSize: 48, lines: 3},
  },
};

const CHECKLIST_SECTION_CARD: SkeletonCardProps = {
  rows: 3,
  row: {leading: 'circle', lines: 1, trailing: 'button'},
};

const CHECKLIST_SECTION: PageSkeletonBlock = {
  type: 'card',
  card: CHECKLIST_SECTION_CARD,
};

const PERSON_CARD: PageSkeletonBlock = {
  type: 'card',
  card: {
    header: 'none',
    row: {leading: 'circle', leadingSize: 18},
    hasAction: true,
  },
};

const UPCOMING_ASSESSMENT_CARD: PageSkeletonBlock = {
  type: 'card',
  card: {
    header: 'none',
    rows: 1,
    row: {leading: 'square', leadingSize: 24, trailing: 'chip'},
    hasAction: true,
  },
};

export const PAGE_SKELETONS = {
  // NurseDetailsUI: profile rail, 3 stat cards, assigned patients table
  nurseDetails: {
    layout: 'split',
    hasRecordHeading: true,
    recordHeadingLines: 2,
    template: PROFILE_TEMPLATE,
    columns: [
      [
        {
          type: 'card',
          card: {header: 'profile', rows: 13, row: {layout: 'inline'}},
        },
      ],
      [{type: 'stats', count: 3}, TABLE_TITLE_IN_CARD],
    ],
  },

  // CaregiverDetailsUI: profile rail, 2 stat cards, patients, submissions and flags tables
  caregiverDetails: {
    layout: 'split',
    hasRecordHeading: true,
    recordHeadingLines: 2,
    template: PROFILE_TEMPLATE,
    columns: [
      [
        {
          type: 'card',
          card: {header: 'profile', rows: 9, row: {layout: 'inline'}},
        },
      ],
      [
        {type: 'stats', count: 2},
        TABLE_TITLE_IN_CARD,
        TABLE_TITLE_IN_CARD,
        TABLE_TITLE_IN_CARD,
      ],
    ],
  },

  // CaseManagerDetailsUI: profile rail, 3 stat cards, assigned patients table
  caseManagerDetails: {
    layout: 'split',
    hasRecordHeading: true,
    recordHeadingLines: 2,
    template: PROFILE_TEMPLATE,
    columns: [
      [
        {
          type: 'card',
          card: {header: 'profile', rows: 4, row: {layout: 'inline'}},
        },
      ],
      [{type: 'stats', count: 3}, TABLE_TITLE_IN_CARD],
    ],
  },

  // PatientDetailsUI: 3 tables, then the facts and care team cards in the rail
  patientDetails: {
    layout: 'split',
    hasRecordHeading: true,
    recordHeadingLines: 2,
    template: {lg: `minmax(0, 1fr) ${layout.detailRailWidth}px`},
    columns: [
      [TABLE_TITLE_IN_CARD, TABLE_TITLE_IN_CARD, TABLE_TITLE_IN_CARD],
      [
        {type: 'card', card: {rows: 9, columns: 2}},
        {type: 'card', card: {rows: 2, row: {leading: 'circle'}}},
      ],
    ],
  },

  caregiverPatientPhone: {
    layout: 'split',
    hasRecordHeading: true,
    recordHeadingLines: 2,
    template: {lg: '1fr'},
    columns: [
      [
        {type: 'card', card: {rows: 3, row: {lines: 2}}},
        TABLE_TITLE_IN_CARD,
        TABLE_TITLE_IN_CARD,
        {type: 'card', card: {rows: 9, columns: 2}},
        {type: 'card', card: {rows: 2, row: {leading: 'circle'}}},
      ],
    ],
  },

  // HhaSyncRunDetailsUI: summary and timeline, then resource cards and records
  hhaSyncRun: {
    layout: 'split',
    template: {lg: '5fr 7fr'},
    columns: [
      [{type: 'card', card: {rows: 6, row: {layout: 'inline'}}}],
      [{type: 'card', card: {rows: 5, row: {lines: 2}}}],
    ],
  },

  // ChecklistRecordDetailsUI (max-w-7xl): sections card, patient and assignee cards
  checklistRecord: {
    layout: 'split',
    hasRecordHeading: true,
    template: {lg: `minmax(0, 1fr) ${layout.detailRailWidth}px`},
    columns: [
      [
        {
          type: 'card',
          card: {
            rows: 6,
            divided: true,
            row: {lines: 1, trailing: 'button', sx: {py: 3}},
          },
        },
      ],
      [PERSON_CARD, PERSON_CARD],
    ],
  },

  // EmergencyFlagDetailsUI (AlertReviewGrid): people and history, evidence, resolution
  flagCase: {
    layout: 'split',
    hasRecordHeading: true,
    recordHeadingLines: 2,
    template: {lg: ALERT_REVIEW_COLUMNS.wide},
    columns: [
      [
        PERSON_CARD,
        PERSON_CARD,
        {type: 'card', card: {rows: 3, row: {lines: 1}}},
      ],
      [{type: 'card', card: {rows: 4, row: {lines: 3}}}],
      [{type: 'card', card: {rows: 3, row: {lines: 2}, hasAction: true}}],
    ],
  },

  // SubmissionDetailsUI (AlertReviewGrid without resolution): people and outcome, evidence
  submissionReview: {
    layout: 'split',
    hasRecordHeading: true,
    recordHeadingLines: 2,
    template: {lg: ALERT_REVIEW_COLUMNS.withoutResolution},
    columns: [
      [
        PERSON_CARD,
        PERSON_CARD,
        {type: 'card', card: {rows: 2, row: {lines: 1}}},
      ],
      [{type: 'card', card: {rows: 5, row: {lines: 3}}}],
    ],
  },

  // ChecklistFormLayout with the template selector: banner and selector card
  checklistForm: {
    layout: 'column',
    maxWidth: SKELETON_LAYOUT.formMaxWidth,
    columns: [
      [PATIENT_BANNER, {type: 'card', card: {rows: 0, hasAction: true}}],
    ],
  },

  // ChecklistFormLayout without the selector: banner and section cards
  checklistFormSections: {
    layout: 'column',
    maxWidth: SKELETON_LAYOUT.formMaxWidth,
    columns: [[PATIENT_BANNER, CHECKLIST_SECTION, CHECKLIST_SECTION]],
  },

  checklistRunner: {
    layout: 'column',
    maxWidth: SKELETON_LAYOUT.formMaxWidth,
    columns: [
      [
        {type: 'title'},
        {type: 'card', card: {rows: 4, row: {lines: 1}, hasAction: true}},
      ],
    ],
  },

  // RedFlagFormUI: banner, urgency notice, alert details card
  redFlagForm: {
    layout: 'column',
    maxWidth: SKELETON_LAYOUT.formMaxWidth,
    columns: [
      [
        PATIENT_BANNER,
        {
          type: 'card',
          card: {
            surface: 'plain',
            header: 'none',
            rows: 1,
            row: {leading: 'circle', leadingSize: 20, lines: 1},
          },
        },
        {type: 'card', card: {rows: 4, row: {lines: 1}, hasAction: true}},
      ],
    ],
  },

  // AssessmentChecklistDetailsUI: questions card, usage panel
  assessmentChecklistDetails: {
    layout: 'split',
    hasRecordHeading: true,
    recordHeadingLines: 2,
    template: {md: '2fr 1fr', lg: '2fr 1fr'},
    columns: [
      [
        {
          type: 'card',
          card: {
            rows: 6,
            divided: true,
            row: {lines: 1, trailing: 'chip', sx: {py: 2.5}},
          },
        },
      ],
      [
        {
          type: 'card',
          card: {
            rows: 4,
            divided: true,
            row: {lines: 1, trailing: 'text', sx: {py: 1.5}},
          },
        },
      ],
    ],
  },

  // AssessmentsPageUI: overview card, upcoming assessment cards
  assessments: {
    layout: 'split',
    template: {md: '1fr 2fr', lg: '1fr 2fr'},
    columns: [
      [
        {
          type: 'card',
          card: {
            header: 'none',
            rows: 1,
            row: {leading: 'circle', leadingSize: 50},
            hasAction: true,
          },
          nested: {header: 'none', rows: 2, columns: 2},
        },
      ],
      [
        {type: 'title'},
        UPCOMING_ASSESSMENT_CARD,
        UPCOMING_ASSESSMENT_CARD,
        UPCOMING_ASSESSMENT_CARD,
      ],
    ],
  },
} satisfies Record<string, PageSkeletonProps>;

export const WIDGET_SKELETONS = {
  // ChecklistFormLayout section cards while a template loads
  checklistSections: {count: 2, card: CHECKLIST_SECTION_CARD},

  // RegionCard: icon tile header, then the nurse coverage rows
  regionCard: {
    count: 3,
    iconTileSize: REGION_CARD.iconTileSize,
    coverageRows: 2,
  },

  // PatientRow in the caregiver's phone Patients list: avatar, name, next checklist
  caregiverPatientCard: {count: 3, avatarSize: 42},

  caregiverActivity: {count: 5},

  // SeverityIndicator dot at the start of each AlertQueueCard row
  alertQueue: {indicatorSize: 10},

  // ActiveDevicesCard device icon and row spacing
  activeDevices: {iconSize: 28, rowPaddingY: 4},
} as const;

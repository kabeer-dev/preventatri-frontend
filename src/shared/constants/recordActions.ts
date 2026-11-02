/**
 * How a details page's second header action removes the record: patients are
 * archived and stay listable, while org users are deleted outright.
 */
export const RECORD_REMOVE_ACTION = {
  archive: {labelKey: 'recordActions.archive', icon: 'mdi:archive-outline'},
  delete: {labelKey: 'recordActions.delete', icon: 'mdi:archive-outline'},
} as const;

export type RecordRemoveAction = keyof typeof RECORD_REMOVE_ACTION;

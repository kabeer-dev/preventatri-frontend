import {radius} from '@/@core/theme/spacing';

const statusPillSx = {
  display: 'inline-flex',
  alignItems: 'center',
  px: 2.25,
  py: 0.75,
  borderRadius: `${radius.full}px`,
  fontSize: '11.5px',
  fontWeight: 600,
};

export const activePillSx = {
  ...statusPillSx,
  backgroundColor: 'customColors.severityStableBg',
  color: 'customColors.severityStableFg',
};

export const inactivePillSx = {
  ...statusPillSx,
  backgroundColor: 'customColors.rule',
  color: 'customColors.inkFaint',
};

export const countyPillSx = {
  display: 'inline-flex',
  alignItems: 'center',
  px: 2.75,
  py: 1.25,
  borderRadius: `${radius.full}px`,
  fontSize: '12px',
  fontWeight: 600,
  color: 'text.secondary',
  backgroundColor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
};

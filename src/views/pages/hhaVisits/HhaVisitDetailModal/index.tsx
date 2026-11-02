'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import CustomChip from '@/@core/components/mui/chip';
import BaseDialog from '@/shared/components/common/modals/BaseDialog';
import useTranslation from '@/shared/hooks/useTranslation';
import {HhaVisitDetailModalProps} from '@/shared/interfaces/hhaVisit';
import {
  buildHhaVisitDetailSections,
  resolveHhaVisitChip,
} from '@/shared/utils/hhaVisitUtils';

import HhaVisitDetailSection from './HhaVisitDetailSection';

/**
 * Read-only detail of one imported HHAeXchange visit.
 *
 * The "Schedule" and "Actual Visit" sections are the two halves of the same
 * HHAeXchange record -- a schedule IS a visit there -- which is why one dialog
 * shows both rather than the page having a separate schedules view.
 */
const HhaVisitDetailModal = ({
  isOpen,
  onClose,
  visit,
}: HhaVisitDetailModalProps) => {
  const {t} = useTranslation();

  if (!visit) return null;

  const chip = resolveHhaVisitChip({visit, t});
  const sections = buildHhaVisitDetailSections({visit, t});

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={onClose}
      width={600}
      ariaLabelledBy='hha-visit-detail-title'
      paperSx={{maxHeight: '90vh'}}
    >
      {/*
        The body scrolls on its own (same layout as FormModal): the title
        stays put and the six sections scroll beneath it on short screens.
      */}
      <Box
        sx={{
          p: 6,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 4,
            pr: 10,
          }}
        >
          <Typography
            id='hha-visit-detail-title'
            variant='h6'
            sx={{fontWeight: 600}}
          >
            {t('hhaVisits.detail.title')}
          </Typography>
          <CustomChip
            skin='light'
            size='small'
            label={chip.label}
            color={chip.color}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            pr: 2,
            mr: -2,
          }}
        >
          {sections.map((section) => (
            <HhaVisitDetailSection key={section.title} section={section} />
          ))}
        </Box>
      </Box>
    </BaseDialog>
  );
};

export default HhaVisitDetailModal;

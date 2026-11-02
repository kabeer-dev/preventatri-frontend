'use client';

import {useState} from 'react';

import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';

import {ConfirmationModal} from '@/shared/components/common/modals';
import useTranslation from '@/shared/hooks/useTranslation';
import {HhaCoordinatorPickerModalProps} from '@/shared/interfaces/hhaSyncHistory';
import {hhaExchangeMutations} from '@/shared/reactQuery';
import {resolveCoordinatorStatus} from '@/shared/utils/hhaSyncHistoryUtils';

const KEY = 'hhaSyncHistory.coordinators.dialog';

// Picks which HHAeXchange coordinator is the patient's case manager. The
// parent remounts it on open (key) so the selection starts on the current one.
const HhaCoordinatorPickerModal = ({
  target,
  isOpen,
  onClose,
}: HhaCoordinatorPickerModalProps) => {
  const {t} = useTranslation();
  const {useSelectHhaPatientCaseManagerMutation} = hhaExchangeMutations();

  const {mutate: selectCaseManager, isPending} =
    useSelectHhaPatientCaseManagerMutation();

  const current =
    target?.coordinators.find((coordinator) => coordinator.isCaseManager)
      ?.caseManagerProfileId || '';

  const [selected, setSelected] = useState(current);

  if (!target) return null;

  return (
    <ConfirmationModal
      isOpen={isOpen}
      title={t(`${KEY}.title`)}
      confirmLabel={t(`${KEY}.save`)}
      dismissLabel={t(`${KEY}.cancel`)}
      confirmButtonColor='primary'
      onCancel={onClose}
      onConfirm={() =>
        selectCaseManager({
          params: {patientId: target.patientId},
          payload: {caseManagerProfileId: selected},
          callBackFuncs: {onSuccess: onClose},
        })
      }
      confirmLoading={isPending}
      disableConfirm={!selected}
      maxWidth='sm'
      content={
        <Box className='flex flex-col gap-3'>
          <Typography variant='body2' sx={{color: 'text.secondary'}}>
            {t(`${KEY}.message`, {name: target.name})}
          </Typography>
          <RadioGroup
            aria-label={t(`${KEY}.ariaLabel`)}
            value={selected}
            onChange={(event) => setSelected(event.target.value)}
            className='flex flex-col gap-2'
          >
            {target.coordinators.map((coordinator) => {
              const isSelectable =
                Boolean(coordinator.caseManagerProfileId) &&
                coordinator.isActive;

              const isSelected =
                isSelectable && selected === coordinator.caseManagerProfileId;

              return (
                <Box
                  key={coordinator.slot}
                  component='label'
                  className='flex items-center gap-2'
                  sx={{
                    p: 3,
                    border: 1,
                    borderRadius: 1,
                    cursor: isSelectable ? 'pointer' : 'default',
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    backgroundColor: isSelected
                      ? 'action.selected'
                      : 'transparent',
                  }}
                >
                  <Radio
                    size='small'
                    value={coordinator.caseManagerProfileId || ''}
                    disabled={!isSelectable || isPending}
                  />
                  <Box className='min-w-0'>
                    <Typography noWrap variant='body2' sx={{fontWeight: 600}}>
                      {coordinator.name}
                    </Typography>
                    <Typography
                      variant='caption'
                      sx={{color: 'text.secondary'}}
                    >
                      {coordinator.isCaseManager
                        ? t(`${KEY}.current`)
                        : resolveCoordinatorStatus({coordinator, t})?.label}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </RadioGroup>
        </Box>
      }
    />
  );
};

export default HhaCoordinatorPickerModal;

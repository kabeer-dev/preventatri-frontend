'use client';

import {useState} from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {useForm, useWatch} from 'react-hook-form';

import RHFAsyncAutocompleteField from '@/shared/components/common/inputs/RHFAsyncAutocompleteField';
import {ConfirmationModal} from '@/shared/components/common/modals/ConfirmationModal';
import {useRegionSelectOptions} from '@/shared/hooks/useRegionSelectOptions';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  HhaSyncAddCountyForm,
  HhaSyncExceptionActionsProps,
} from '@/shared/interfaces/hhaSyncHistory';
import {hhaExchangeMutations} from '@/shared/reactQuery';

const KEY = 'hhaSyncHistory.exceptions';

const defaultValues: HhaSyncAddCountyForm = {regionId: ''};

// Answers "county not set up" in place: the admin only picks the region.
const HhaSyncAddCountyAction = ({
  exception,
  onDone,
}: HhaSyncExceptionActionsProps) => {
  const {t} = useTranslation();
  const {useAddHhaSyncExceptionCountyMutation} = hhaExchangeMutations();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {control, reset} = useForm<HhaSyncAddCountyForm>({defaultValues});
  const regionId = useWatch({control, name: 'regionId'});

  const regionSource = useRegionSelectOptions({enabled: isDialogOpen});

  const {mutate: addCounty, isPending} = useAddHhaSyncExceptionCountyMutation();

  const close = () => {
    setIsDialogOpen(false);
    reset(defaultValues);
  };

  const confirm = () =>
    addCounty({
      params: {id: exception.id},
      payload: {regionId},
      callBackFuncs: {
        onSuccess: () => {
          close();
          onDone();
        },
      },
    });

  return (
    <>
      <Button variant='contained' onClick={() => setIsDialogOpen(true)}>
        {t(`${KEY}.detail.addCounty`)}
      </Button>

      <ConfirmationModal
        isOpen={isDialogOpen}
        title={t(`${KEY}.countyDialog.title`, {county: exception.detail})}
        content={
          <Box className='flex flex-col gap-4'>
            <Typography variant='body2'>
              {t(`${KEY}.countyDialog.message`)}
            </Typography>

            <RHFAsyncAutocompleteField
              name='regionId'
              control={control}
              label={t(`${KEY}.countyDialog.regionLabel`)}
              placeholder={t(`${KEY}.countyDialog.regionPlaceholder`)}
              source={regionSource}
              disabled={isPending}
            />
          </Box>
        }
        confirmLabel={t(`${KEY}.countyDialog.confirm`)}
        confirmButtonColor='primary'
        confirmLoading={isPending}
        disableConfirm={!regionId}
        onConfirm={confirm}
        onCancel={close}
      />
    </>
  );
};

export default HhaSyncAddCountyAction;

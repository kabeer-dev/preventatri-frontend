'use client';

import {useEffect, useMemo} from 'react';

import {Icon} from '@iconify/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {alpha, useTheme} from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import {layout} from '@/@core/theme/spacing';
import ImageGallery from '@/shared/components/common/ImageGallery';
import Link from '@/shared/components/common/localeLink';
import PatientInfoBanner from '@/shared/components/common/PatientInfoBanner';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useTranslation from '@/shared/hooks/useTranslation';
import {Patient} from '@/shared/interfaces/patient';
import {RedFlagFormValues} from '@/shared/types/redFlag';
import {formatDate, getCurrentDateTime} from '@/shared/utils/dateUtils';
import {getReasonLabel} from '@/shared/utils/redFlagUtils';

interface RedFlagSubmittedUIProps {
  patient: Patient;
  submittedValues: RedFlagFormValues;
  images: File[];
  audioBlob: Blob | null;
}

const RedFlagSubmittedUI = ({
  patient,
  submittedValues,
  images,
  audioBlob,
}: RedFlagSubmittedUIProps) => {
  const {t} = useTranslation();
  const theme = useTheme();

  const reasonLabel = getReasonLabel({reason: submittedValues.reason});

  const imageGalleryItems = useMemo(
    () =>
      images.map((file, index) => ({
        url: URL.createObjectURL(file),
        key: `img-${index}`,
      })),
    [images]
  );

  const audioUrl = useMemo(
    () => (audioBlob ? URL.createObjectURL(audioBlob) : null),
    [audioBlob]
  );

  const submittedDate = useMemo(
    () =>
      formatDate({
        date: getCurrentDateTime(),
        format: 'MMM d, yyyy h:mm a',
      }),
    []
  );

  useEffect(
    () => () => {
      imageGalleryItems.forEach((item) => URL.revokeObjectURL(item.url));
    },
    [imageGalleryItems]
  );

  useEffect(
    () => () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    },
    [audioUrl]
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        width: '100%',
        maxWidth: layout.formMaxWidth,
        mx: 'auto',
        pb: 6,
        pt: {xs: 2, md: 4},
      }}
    >
      {/* Success Header */}
      <Card elevation={6} sx={{overflow: 'hidden'}}>
        <Box
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.06)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
          }}
        >
          <CardContent
            sx={{
              py: 6,
              px: 5,
              display: 'flex',
              flexDirection: {xs: 'column', sm: 'row'},
              alignItems: 'center',
              gap: {xs: 3, sm: 4},
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                minWidth: 72,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.success.main, 0.12),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon
                icon='mdi:check-bold'
                fontSize='2rem'
                color={theme.palette.success.main}
              />
            </Box>

            <Box sx={{textAlign: {xs: 'center', sm: 'left'}, flex: 1}}>
              <Typography variant='h5' sx={{fontWeight: 700, mb: 0.5}}>
                {t('redFlag.submittedTitle')}
              </Typography>
              <Typography
                variant='body2'
                sx={{color: 'text.secondary', mb: 2.5}}
              >
                {t('redFlag.submittedMessage')}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexWrap: 'wrap',
                  justifyContent: {xs: 'center', sm: 'flex-start'},
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    py: 0.75,
                    px: 2,
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                  }}
                >
                  <Icon
                    icon='mdi:alert-decagram'
                    fontSize='1rem'
                    color={theme.palette.error.main}
                  />
                  <Typography
                    variant='body2'
                    sx={{fontWeight: 600, color: 'error.main'}}
                  >
                    {reasonLabel}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    py: 0.75,
                    px: 2,
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                  }}
                >
                  <Icon
                    icon='mdi:clock-outline'
                    fontSize='1rem'
                    color={theme.palette.text.secondary}
                  />
                  <Typography
                    variant='body2'
                    sx={{fontWeight: 500, color: 'text.secondary'}}
                  >
                    {submittedDate}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Box>
      </Card>

      {/* Patient Info */}
      <PatientInfoBanner
        patient={patient}
        subtitle={t('redFlag.submittedFor')}
        showContactInfo
      />

      {/* Reason Card */}
      <Card elevation={6}>
        <CardContent sx={{py: 4, px: 5}}>
          <Typography variant='subtitle1' sx={{fontWeight: 700, mb: 3}}>
            {t('redFlag.reasonLabel')}
          </Typography>
          <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
            <Icon
              icon='mdi:check-circle'
              color={theme.palette.success.main}
              fontSize='1.1rem'
            />
            <Typography variant='body2' sx={{fontWeight: 500}}>
              {reasonLabel}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Description Card */}
      <Card elevation={6}>
        <CardContent sx={{py: 4, px: 5}}>
          <Typography variant='subtitle1' sx={{fontWeight: 700, mb: 3}}>
            {t('redFlag.descriptionLabel')}
          </Typography>
          <Box
            sx={{
              pl: 2,
              borderLeft: '2px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant='body2'
              sx={{color: 'text.secondary', lineHeight: 1.7}}
            >
              {submittedValues.description}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Attachments Card */}
      {(imageGalleryItems.length > 0 || audioBlob) && (
        <Card elevation={6}>
          <CardContent sx={{py: 4, px: 5}}>
            <Typography variant='subtitle1' sx={{fontWeight: 700, mb: 3}}>
              {t('redFlag.supportingEvidence')}
            </Typography>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
              {imageGalleryItems.length > 0 && (
                <ImageGallery images={imageGalleryItems} />
              )}
              {audioBlob && (
                <Box
                  component='audio'
                  controls
                  src={audioUrl || undefined}
                  sx={{width: '100%', height: 40, display: 'block'}}
                />
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Box sx={{display: 'flex', justifyContent: 'center', gap: 2, mt: 1}}>
        <Button
          component={Link}
          variant='outlined'
          startIcon={<Icon icon='mdi:arrow-left' />}
          href={DASHBOARD_ROUTES.home()}
          sx={{textTransform: 'none', px: 3}}
        >
          {t('redFlag.backToDashboard')}
        </Button>
      </Box>
    </Box>
  );
};

export default RedFlagSubmittedUI;

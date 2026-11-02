'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import EvidenceEmptyNote from '@/shared/components/common/alertReview/EvidenceEmptyNote';
import CustomAudioPlayer from '@/shared/components/common/audio/CustomAudioPlayer';
import ImageGallery from '@/shared/components/common/ImageGallery';
import {
  ALERT_REVIEW_ROW_SX,
  ALERT_REVIEW_SIZES,
} from '@/shared/constants/alertReview';
import useTranslation from '@/shared/hooks/useTranslation';
import {EvidenceMediaProps} from '@/shared/interfaces/alertReview';

const EvidenceMedia = ({images, audioUrl}: EvidenceMediaProps) => {
  const {t} = useTranslation();

  if (images.length === 0 && !audioUrl) {
    return <EvidenceEmptyNote message={t('alertReview.evidence.noMedia')} />;
  }

  const labelSx = {fontWeight: 700, color: 'text.secondary', mb: 2.5};

  return (
    <>
      {images.length > 0 && (
        <Box sx={{...ALERT_REVIEW_ROW_SX, pt: 3, pb: 4}}>
          <Typography variant='small' component='h3' sx={labelSx}>
            {t('alertReview.evidence.photos')}
          </Typography>
          <ImageGallery
            images={images}
            thumbnailSize={ALERT_REVIEW_SIZES.evidenceThumbnail}
          />
        </Box>
      )}

      {audioUrl && (
        <Box sx={{...ALERT_REVIEW_ROW_SX, pt: 3, pb: 4}}>
          <Typography variant='small' component='h3' sx={labelSx}>
            {t('alertReview.evidence.audioNote')}
          </Typography>
          <CustomAudioPlayer src={audioUrl} />
        </Box>
      )}
    </>
  );
};

export default EvidenceMedia;

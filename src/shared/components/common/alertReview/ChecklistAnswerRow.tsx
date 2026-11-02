'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import ChecklistAnswerValue from '@/shared/components/common/alertReview/ChecklistAnswerValue';
import ImageGallery from '@/shared/components/common/ImageGallery';
import {
  ALERT_REVIEW_ROW_SX,
  ALERT_REVIEW_SIZES,
  ANSWER_TONES,
  UNSCORED_ANSWER_GLYPH,
} from '@/shared/constants/alertReview';
import {SEVERITY_LEVELS} from '@/shared/constants/severity';
import useTranslation from '@/shared/hooks/useTranslation';
import {ChecklistAnswerRowProps} from '@/shared/interfaces/alertReview';
import {getAnswerFlag} from '@/shared/utils/alertReview';
import {getSeverityFromFlag} from '@/shared/utils/severity';

const ChecklistAnswerRow = ({question}: ChecklistAnswerRowProps) => {
  const {t} = useTranslation();

  const value = question.answer?.value ?? null;
  const comment = question.answer?.comment;
  const images = question.answer?.images ?? [];

  const level = getSeverityFromFlag({flag: getAnswerFlag({value})});
  const tone = level ? ANSWER_TONES[level] : null;

  const detailOffset = `${ALERT_REVIEW_SIZES.answerGlyphWidth + 12}px`;

  return (
    <Box sx={{...ALERT_REVIEW_ROW_SX, py: 2.5}}>
      <Box sx={{display: 'flex', alignItems: 'baseline', gap: 3}}>
        <Box
          component='span'
          aria-hidden
          sx={{
            flex: 'none',
            width: ALERT_REVIEW_SIZES.answerGlyphWidth,
            textAlign: 'center',
            fontSize: 11,
            lineHeight: 1,
            color: tone?.glyphColor ?? 'text.disabled',
          }}
        >
          {level ? (
            <Icon
              icon={SEVERITY_LEVELS[level].glyph}
              fontSize={14}
              style={{verticalAlign: 'middle'}}
            />
          ) : (
            UNSCORED_ANSWER_GLYPH
          )}
        </Box>
        {level && (
          <span className='sr-only'>{t(SEVERITY_LEVELS[level].labelKey)}</span>
        )}
        <Typography
          variant='body'
          sx={{flex: 1, minWidth: 0, color: 'text.secondary'}}
        >
          {question.title}
        </Typography>
        <ChecklistAnswerValue
          value={value}
          type={question.type}
          color={tone?.answerColor ?? 'text.primary'}
        />
      </Box>

      {comment && (
        <Typography
          variant='small'
          component='p'
          sx={{
            m: 0,
            mt: 1.25,
            ml: detailOffset,
            color: 'customColors.inkSoft',
            whiteSpace: 'pre-wrap',
          }}
        >
          <Box component='span' sx={{fontWeight: 600, color: 'text.secondary'}}>
            {`${t('submissions.detail.extraNote')}: `}
          </Box>
          {comment}
        </Typography>
      )}

      {images.length > 0 && (
        <Box sx={{mt: 2.25, ml: detailOffset}}>
          <ImageGallery
            images={images}
            thumbnailSize={ALERT_REVIEW_SIZES.answerThumbnail}
          />
        </Box>
      )}
    </Box>
  );
};

export default ChecklistAnswerRow;

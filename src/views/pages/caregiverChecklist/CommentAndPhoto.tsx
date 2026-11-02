'use client';

import {useRef} from 'react';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import ImageGallery from '@/shared/components/common/ImageGallery';
import {MAX_UPLOAD_IMAGES} from '@/shared/constants/common';
import useTranslation from '@/shared/hooks/useTranslation';
import {RunnerAttachment} from '@/shared/interfaces/caregiverChecklistRunner';

interface Props {
  comment: string;
  attachments: RunnerAttachment[];
  onCommentChange: ({comment}: {comment: string}) => void;
  onAddFiles: ({files}: {files: File[]}) => void;
  onRemoveAttachment: ({previewUrl}: {previewUrl: string}) => void;
}

/** Thumbnails are 64px on both shells, small enough to sit under one line. */
const THUMBNAIL_SIZE = 64;

/**
 * W02's comment field: one line that grows as she types, with a paperclip at
 * its right end for photos. The preview URLs come in already made, so this
 * only ever displays them.
 */
const CommentAndPhoto = ({
  comment,
  attachments,
  onCommentChange,
  onAddFiles,
  onRemoveAttachment,
}: Props) => {
  const {t} = useTranslation();

  const fileInput = useRef<HTMLInputElement>(null);

  const isFull = attachments.length >= MAX_UPLOAD_IMAGES;

  const images = attachments.map(({previewUrl}) => ({
    url: previewUrl,
    key: previewUrl,
  }));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
      }}
    >
      <TextField
        fullWidth
        multiline
        minRows={1}
        value={comment}
        onChange={(event) => onCommentChange({comment: event.target.value})}
        placeholder={t('caregiverChecklist.comment.placeholder')}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position='end' sx={{alignSelf: 'flex-end'}}>
                <IconButton
                  aria-label={t('caregiverChecklist.photo.attach')}
                  title={t('caregiverChecklist.photo.attach')}
                  disabled={isFull}
                  onClick={() => fileInput.current?.click()}
                  sx={{color: 'text.secondary'}}
                >
                  <Icon icon='mdi:paperclip' fontSize={18} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <input
        ref={fileInput}
        type='file'
        accept='image/*'
        multiple
        hidden
        onChange={(event) => {
          onAddFiles({files: Array.from(event.target.files || [])});

          // Cleared so picking the same photo twice in a row still fires.
          event.target.value = '';
        }}
      />

      {attachments.length > 0 && (
        <ImageGallery
          images={images}
          thumbnailSize={THUMBNAIL_SIZE}
          onRemove={(previewUrl) => onRemoveAttachment({previewUrl})}
          removeLabel={({number}) =>
            t('caregiverChecklist.photo.remove', {number})
          }
        />
      )}

      <Typography sx={{fontSize: '0.75rem', color: 'customColors.inkFaint'}}>
        {t('caregiverChecklist.comment.hint')}
      </Typography>
    </Box>
  );
};

export default CommentAndPhoto;

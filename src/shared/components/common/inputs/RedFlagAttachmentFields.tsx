'use client';

import Box from '@mui/material/Box';

import AudioRecorder from '@/shared/components/common/inputs/AudioRecorder';
import FieldLabel from '@/shared/components/common/inputs/FieldLabel';
import FileDropzone from '@/shared/components/common/inputs/FileDropzone';
import {MAX_UPLOAD_IMAGES} from '@/shared/constants/common';
import {RedFlagAttachmentFieldsProps} from '@/shared/interfaces/inputs';

/**
 * Photos and a voice note for a red flag. The dropzone closes once the image
 * limit is reached, and both controls lock while the flag is being sent.
 */
const RedFlagAttachmentFields = ({
  images,
  onImagesChange,
  onAudioChange,
  audioRecorderRef,
  isSubmitting,
  uploadText,
  browseText,
  photosLabel,
  voiceNoteLabel,
  gap = 5,
}: RedFlagAttachmentFieldsProps) => (
  <Box sx={{display: 'flex', flexDirection: 'column', gap}}>
    <Box>
      {photosLabel && <FieldLabel>{photosLabel}</FieldLabel>}

      <FileDropzone
        files={images}
        onFilesChange={onImagesChange}
        uploadText={uploadText}
        browseText={browseText}
        maxFiles={MAX_UPLOAD_IMAGES}
        hideDropzone={images.length >= MAX_UPLOAD_IMAGES}
        disabled={isSubmitting}
      />
    </Box>

    <Box>
      {voiceNoteLabel && <FieldLabel>{voiceNoteLabel}</FieldLabel>}

      <AudioRecorder
        ref={audioRecorderRef}
        onAudioChange={onAudioChange}
        disabled={isSubmitting}
      />
    </Box>
  </Box>
);

export default RedFlagAttachmentFields;

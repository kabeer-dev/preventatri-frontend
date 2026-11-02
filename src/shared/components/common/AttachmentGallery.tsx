'use client';

import {useState} from 'react';

import {Icon} from '@iconify/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

export interface AttachmentItem {
  url: string;
  key: string;
  mimeType?: string | null;
  originalName?: string | null;
}

interface AttachmentGalleryProps {
  attachments: AttachmentItem[];
  thumbnailSize?: number;
}

const isImageAttachment = ({attachment}: {attachment: AttachmentItem}) => {
  if (attachment.mimeType?.startsWith('image/')) return true;

  return /\.(png|jpe?g|webp|heic|heif)$/i.test(
    attachment.originalName || attachment.key || attachment.url
  );
};

const getFileIcon = ({mimeType, originalName, key, url}: AttachmentItem) => {
  // Stored attachments often have no mimeType/originalName, so fall back to the
  // filename in the key/url to detect the type.
  const name = originalName || key || url;

  if (mimeType === 'application/pdf' || /\.pdf$/i.test(name)) {
    return 'mdi:file-pdf-box';
  }

  if (
    mimeType === 'application/msword' ||
    mimeType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    /\.(doc|docx)$/i.test(name)
  ) {
    return 'mdi:file-word-box';
  }

  return 'mdi:file-outline';
};

// Attachments are stored as {url, key} only, so when there is no originalName we
// derive a readable label from the stored filename and strip the timestamp the
// upload middleware injects before the extension (name.<timestamp>.ext).
const getDisplayName = ({originalName, key, url}: AttachmentItem) => {
  if (originalName) return originalName;

  const base = (key || url).split('/').pop() || 'Attachment';

  // decodeURIComponent throws on malformed `%` sequences; fall back to the raw
  // filename so a single bad key never crashes the attachment row.
  let decoded = base;
  try {
    decoded = decodeURIComponent(base);
  } catch {
    decoded = base;
  }

  return decoded.replace(/\.\d{10,}(?=\.[^.]+$)/, '');
};

const AttachmentGallery = ({
  attachments,
  thumbnailSize = 104,
}: AttachmentGalleryProps) => {
  // -1 means lightbox is closed; >= 0 is the active image index
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  // Images shown in the lightbox, in the same order they appear in the row.
  const imageAttachments = attachments.filter((attachment) =>
    isImageAttachment({attachment})
  );

  const isSingleImage = imageAttachments.length <= 1;

  const tileSx = {
    width: thumbnailSize,
    height: thumbnailSize,
    borderRadius: 2,
    overflow: 'hidden',
    boxShadow: 1,
    transition: 'opacity 0.2s',
    '&:hover': {opacity: 0.8},
  };

  return (
    <>
      <Box sx={{display: 'flex', gap: 2, flexWrap: 'wrap'}}>
        {attachments.map((attachment) => {
          if (isImageAttachment({attachment})) {
            const imageIndex = imageAttachments.findIndex(
              (image) => image.key === attachment.key
            );

            return (
              <Box
                key={attachment.key}
                component='img'
                src={attachment.url}
                alt={getDisplayName(attachment)}
                onClick={() => setLightboxIndex(imageIndex)}
                sx={Object.assign({}, tileSx, {
                  objectFit: 'cover',
                  cursor: 'pointer',
                })}
              />
            );
          }

          return (
            <Box
              key={attachment.key}
              component='a'
              href={attachment.url}
              target='_blank'
              rel='noreferrer'
              title={getDisplayName(attachment)}
              sx={Object.assign({}, tileSx, {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
                px: 1,
                bgcolor: 'action.hover',
                color: 'text.primary',
                textDecoration: 'none',
              })}
            >
              <Icon
                icon={getFileIcon(attachment)}
                fontSize='2rem'
                color='var(--mui-palette-primary-main)'
              />
              <Typography
                variant='caption'
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  wordBreak: 'break-all',
                  textAlign: 'center',
                  lineHeight: 1.2,
                  fontSize: '0.65rem',
                }}
              >
                {getDisplayName(attachment)}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={imageAttachments.map((image) => ({src: image.url}))}
        plugins={[Zoom]}
        carousel={{finite: true}}
        {...(isSingleImage && {
          render: {
            buttonPrev: () => null,
            buttonNext: () => null,
          },
        })}
      />
    </>
  );
};

export default AttachmentGallery;

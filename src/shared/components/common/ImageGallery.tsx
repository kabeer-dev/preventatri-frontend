'use client';

import {useState} from 'react';

import {Icon} from '@iconify/react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

import 'yet-another-react-lightbox/styles.css';

interface ImageGalleryProps {
  images: {url: string; key: string}[];
  thumbnailSize?: number;
  onRemove?: (key: string) => void;

  /**
   * Names one remove button, given that image's position in the gallery. A
   * screen reader hears "Remove photo 2", not four buttons called the same
   * thing. Falls back to a plain English label when the caller has none.
   */
  removeLabel?: ({number}: {number: number}) => string;
}

const ImageGallery = ({
  images,
  thumbnailSize = 80,
  onRemove,
  removeLabel,
}: ImageGalleryProps) => {
  // -1 means lightbox is closed; >= 0 is the active image index
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const isSingleImage = images.length <= 1;

  return (
    <>
      <Box sx={{display: 'flex', gap: 2, flexWrap: 'wrap'}}>
        {images.map((image, index) => (
          <Box
            key={image.key}
            sx={{
              position: 'relative',
              width: thumbnailSize,
              height: thumbnailSize,
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: 1,
              cursor: 'pointer',
              transition: 'opacity 0.2s',
              '&:hover': {opacity: 0.8},
            }}
          >
            <Box
              component='img'
              src={image.url}
              alt='Attachment'
              onClick={() => setLightboxIndex(index)}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {onRemove && (
              <IconButton
                size='small'
                aria-label={
                  removeLabel
                    ? removeLabel({number: index + 1})
                    : `Remove image ${index + 1}`
                }
                onClick={() => onRemove(image.key)}
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  bgcolor: 'rgba(0,0,0,0.55)',
                  color: 'common.white',
                  p: 0.5,
                  '&:hover': {bgcolor: 'rgba(0,0,0,0.75)'},
                }}
              >
                <Icon icon='mdi:close' fontSize='1rem' />
              </IconButton>
            )}
          </Box>
        ))}
      </Box>
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={images.map((image) => ({src: image.url}))}
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

export default ImageGallery;

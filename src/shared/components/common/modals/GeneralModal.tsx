'use client';

import {Fragment, ReactNode} from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import {layout} from '@/@core/theme/spacing';
import {CloseIcon, LoaderIcon} from '@/shared/components/icons';
import Modal from '@/shared/components/ui/modal';
import {ButtonProps, GeneralModalProps} from '@/shared/interfaces/modals';
import {cn} from '@/shared/utils/tailwindUtils';

export const GeneralModal = ({
  title,
  content,
  isOpen,
  width = layout.modalWidth,
  buttons,
  buttonsAlignment = 'justify-center',
  onClose,
}: GeneralModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} width={width}>
      <Box className='relative'>
        <IconButton
          onClick={() => onClose(false)}
          className='absolute top-[-8px] right-[-8px] hover:bg-gray-100'
          aria-label='close'
        >
          <CloseIcon size={20} />
        </IconButton>
        <Typography>{title}</Typography>
        <Box>
          <Box className='flex flex-col'>
            {content && (
              <>
                {content.map((contentItem: ReactNode, index: number) => (
                  <Fragment key={'key' + index}>{contentItem}</Fragment>
                ))}
              </>
            )}
          </Box>
          {buttons && (
            <Box
              className={cn(
                'flex gap-[10px] pt-5 w-full items-center',
                buttonsAlignment
              )}
            >
              {buttons.map((button: ButtonProps) => (
                <Button
                  className={cn('w-full capitalize', button.styles)}
                  onClick={button.handleClick}
                  key={button.title}
                  variant={button.variant}
                  disabled={button.disabled || button.loading}
                >
                  {button?.loading ? (
                    <LoaderIcon size={20} className='loader-icon' />
                  ) : (
                    button.title
                  )}
                </Button>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

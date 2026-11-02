import {ChangeEvent, useEffect, useRef} from 'react';

import {Icon} from '@iconify/react';
import Box from '@mui/material/Box';
import Button, {ButtonProps} from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import {styled} from '@mui/material/styles';

import CustomAvatar from '@/@core/components/mui/avatar';
import {getInitials} from '@/@core/utils/userUtils';
import {ALLOWED_FILE_TYPES} from '@/shared/constants/general';
import useTranslation from '@/shared/hooks/useTranslation';
import {ImageUploadProps} from '@/shared/interfaces/common';
import {showToast} from '@/shared/utils/toasts';

const RemoveButtonStyled = styled(Button)<ButtonProps>(({theme}) => ({
  minWidth: 0,
  padding: 0,
  fontWeight: 400,
  color: theme.palette.text.secondary,

  '&:hover': {
    backgroundColor: 'transparent',
    textDecoration: 'underline',
  },

  '&.Mui-disabled': {
    color: theme.palette.text.disabled,
  },
}));

const EditIconButtonStyled = styled(IconButton)<
  ButtonProps & {component?: 'label'; htmlFor?: string}
>(({theme}) => ({
  position: 'absolute',
  top: -4,
  right: -4,
  width: 24,
  height: 24,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,

  '&:hover': {
    backgroundColor: theme.palette.background.paper,
  },
}));

const ImageUpload = ({
  setIsCropModalOpen,
  setImagePreview,
  setTempImagePreview,
  setCrop,
  imagePreview,
  hasImage,
  name,
  setFile,
  onRemove,
  showRemove,
  isProcessing = false,
}: ImageUploadProps) => {
  const {t} = useTranslation();

  const lastBlobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof imagePreview === 'string' && imagePreview.startsWith('blob:')) {
      if (lastBlobUrlRef.current && lastBlobUrlRef.current !== imagePreview) {
        URL.revokeObjectURL(lastBlobUrlRef.current);
      }
      lastBlobUrlRef.current = imagePreview;
    }
  }, [imagePreview]);

  // Revoke any remaining blob URL on unmount
  useEffect(
    () => () => {
      if (lastBlobUrlRef.current) {
        URL.revokeObjectURL(lastBlobUrlRef.current);
      }
    },
    []
  );

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      showToast({
        type: 'error',
        message: t('commonContent.invalidFileFormat'),
      });

      // Reset input value to allow selecting the same file again
      e.target.value = '';

      return;
    }

    // Save current image before opening crop modal
    setTempImagePreview(imagePreview);
    setIsCropModalOpen(true);
    setFile(file);

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target?.result) {
        setImagePreview(event.target.result as string);
        setCrop({unit: 'px', x: 0, y: 0, width: 50, height: 50});
      }
    };
    reader.readAsDataURL(file);

    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const fileInput = (
    <input
      hidden
      type='file'
      accept='image/png, image/jpeg'
      onChange={handleOnChange}
      id='account-settings-upload-image'
      disabled={isProcessing}
    />
  );

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Box sx={{position: 'relative'}}>
        <CustomAvatar
          skin='light'
          color='primary'
          src={hasImage ? imagePreview : undefined}
          alt={t('settings.profilePhoto.altText')}
          sx={{width: 64, height: 64, fontSize: '1.25rem', fontWeight: 600}}
        >
          {getInitials({name})}
        </CustomAvatar>
        {isProcessing && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
            }}
          >
            <CircularProgress size={24} sx={{color: 'common.white'}} />
          </Box>
        )}
        {hasImage && !isProcessing && (
          <EditIconButtonStyled
            component='label'
            htmlFor='account-settings-upload-image'
            disabled={isProcessing}
            size='small'
          >
            <Icon icon='mdi:pencil-outline' fontSize={14} />
            {fileInput}
          </EditIconButtonStyled>
        )}
      </Box>
      {!hasImage && (
        <Button
          component='label'
          variant='outlined'
          color='secondary'
          size='small'
          htmlFor='account-settings-upload-image'
          disabled={isProcessing}
          sx={{mt: 3}}
        >
          {t('settings.profilePhoto.uploadNewPhoto')}
          {fileInput}
        </Button>
      )}
      <RemoveButtonStyled
        variant='text'
        size='small'
        onClick={onRemove}
        disabled={isProcessing || !showRemove}
        sx={{mt: 2}}
      >
        {t('settings.profilePhoto.reset')}
      </RemoveButtonStyled>
    </Box>
  );
};

export default ImageUpload;

'use client';

import {useEffect, useState} from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import ImageCropper from '@/shared/components/common/imageCropper';
import ImageUpload from '@/shared/components/common/imageCropper/ImageUpload';
import {InfoModal} from '@/shared/components/common/modals';
import {DEFAULT_LOGO} from '@/shared/constants/general';
import useGetLoggedInUser from '@/shared/hooks/useGetLoggedInUser';
import {useImageCrop} from '@/shared/hooks/useImageCrop';
import useTranslation from '@/shared/hooks/useTranslation';
import {userMutations} from '@/shared/reactQuery';

export const ProfileImage = () => {
  const {t} = useTranslation();
  const {currentUser, refetch: refetchLoggedInUser} = useGetLoggedInUser();

  const {
    useUploadProfileImageMutation,
    useUpdateProfileImageMutation,
    useDeleteProfileImageMutation,
  } = userMutations();

  const {mutateAsync: uploadProfileImage, isPending: isUploading} =
    useUploadProfileImageMutation();

  const {mutateAsync: updateProfileImage, isPending: isUpdating} =
    useUpdateProfileImageMutation();

  const {mutateAsync: deleteProfileImage, isPending: isDeleting} =
    useDeleteProfileImageMutation();

  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  const {
    handleCrop,
    handleCropComplete,
    imagePreview,
    setImagePreview,
    tempImagePreview,
    setTempImagePreview,
    isCropModalOpen,
    setIsCropModalOpen,
    file,
    setFile,
    crop,
    setCrop,
    imageRef,
  } = useImageCrop({
    initialImage: currentUser?.profileImage?.url || DEFAULT_LOGO,
  });

  useEffect(() => {
    setImagePreview(currentUser?.profileImage?.url || DEFAULT_LOGO);
  }, [currentUser?.profileImage?.url, setImagePreview]);

  const handleConfirmCrop = async () => {
    const blob = await handleCropComplete();
    setIsCropModalOpen(false);

    if (!blob) return;

    const formData = new FormData();
    formData.append('file', blob, file?.name || 'profile-image.png');

    const mutate = currentUser?.profileImage
      ? updateProfileImage
      : uploadProfileImage;

    await mutate({payload: formData});

    const {data: refetched} = await refetchLoggedInUser();

    setImagePreview(refetched?.data?.user?.profileImage?.url || DEFAULT_LOGO);
  };

  const handleCloseCropModal = () => {
    setIsCropModalOpen(false);

    // Reset to previous image if crop is cancelled
    if (tempImagePreview) {
      setImagePreview(tempImagePreview);
    }
  };

  const handleConfirmRemove = async () => {
    setIsRemoveModalOpen(false);
    await deleteProfileImage();

    const {data: refetched} = await refetchLoggedInUser();

    setImagePreview(refetched?.data?.user?.profileImage?.url || DEFAULT_LOGO);
  };

  return (
    <Box>
      <ImageUpload
        setIsCropModalOpen={setIsCropModalOpen}
        setImagePreview={setImagePreview}
        setTempImagePreview={setTempImagePreview}
        setCrop={setCrop}
        imagePreview={imagePreview}
        hasImage={imagePreview !== DEFAULT_LOGO}
        name={`${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim()}
        setFile={setFile}
        onRemove={() => setIsRemoveModalOpen(true)}
        showRemove={!!currentUser?.profileImage}
        isProcessing={isUploading || isUpdating || isDeleting}
      />

      <InfoModal
        title={t('profileImage.cropImage')}
        isOpen={isCropModalOpen}
        onConfirm={handleConfirmCrop}
        onClose={handleCloseCropModal}
        label={t('profileImage.confirmLabel')}
        content={[
          <Box
            key='crop-content'
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              py: 4,
            }}
          >
            {file && imagePreview && (
              <Box sx={{maxWidth: '100%', overflow: 'auto'}}>
                <ImageCropper
                  crop={crop}
                  handleCrop={handleCrop}
                  imageWidth={400}
                  imageHeight={400}
                  imagePreview={imagePreview}
                  imageRef={imageRef}
                />
              </Box>
            )}
            <Typography variant='body2' sx={{mt: 4, color: 'text.secondary'}}>
              {t('profileImage.cropImageDescription')}
            </Typography>
          </Box>,
        ]}
      />

      <InfoModal
        title={t('profileImage.removeImage')}
        isOpen={isRemoveModalOpen}
        onConfirm={handleConfirmRemove}
        onClose={() => setIsRemoveModalOpen(false)}
        label={t('profileImage.removeConfirmLabel')}
        content={[
          <Typography key='remove-content' variant='body2'>
            {t('profileImage.removeImageDescription')}
          </Typography>,
        ]}
      />
    </Box>
  );
};

export default ProfileImage;

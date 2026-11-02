import {useEffect, useRef, useState} from 'react';

import {Crop} from 'react-image-crop';

import {getCroppedImg} from '@/shared/utils/imageUtils';

export const useImageCrop = ({initialImage}: {initialImage: string}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [croppedImageBlob, setCroppedImageBlob] = useState<Blob | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string>(initialImage);

  const [tempImagePreview, setTempImagePreview] = useState<string | null>(null);

  const [crop, setCrop] = useState<Crop>({
    unit: 'px',
    x: 0,
    y: 0,
    width: 50,
    height: 50,
  });

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleCrop = (c: Crop) => {
    setCrop(c);
  };

  const handleCropComplete = async (): Promise<Blob | null> => {
    if (imageRef.current && crop.width && crop.height) {
      const croppedImgBlob = await getCroppedImg({
        image: imageRef.current,
        crop,
      });
      setCroppedImageBlob(croppedImgBlob);

      // Revoke previous object URL before creating new one
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }

      const croppedImgUrl = URL.createObjectURL(croppedImgBlob);
      objectUrlRef.current = croppedImgUrl;
      setImagePreview(croppedImgUrl);
      setTempImagePreview(null);

      return croppedImgBlob;
    }

    return null;
  };

  return {
    handleCrop,
    handleCropComplete,
    imagePreview,
    setImagePreview,
    tempImagePreview,
    setTempImagePreview,
    isCropModalOpen,
    setIsCropModalOpen,
    croppedImageBlob,
    file,
    setFile,
    crop,
    setCrop,
    imageRef,
  };
};

import Image from 'next/image';
import ReactCrop from 'react-image-crop';

import 'react-image-crop/dist/ReactCrop.css';
import {ImageCropperProps} from '@/shared/interfaces/common';

const ImageCropper = ({
  crop,
  handleCrop,
  imageWidth,
  imageHeight,
  imagePreview,
  imageRef,
}: ImageCropperProps) => (
  <ReactCrop crop={crop} onChange={handleCrop} aspect={1}>
    <Image
      src={imagePreview}
      alt='image'
      width={imageWidth}
      height={imageHeight}
      ref={imageRef}
    />
  </ReactCrop>
);

export default ImageCropper;

import {Crop} from 'react-image-crop';

export const getCroppedImg = ({
  image,
  crop,
}: {
  image: HTMLImageElement;
  crop: Crop;
}): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width ?? 0;
  canvas.height = crop.height ?? 0;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('2D context not available');
  }

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(
    image,
    (crop.x ?? 0) * scaleX,
    (crop.y ?? 0) * scaleY,
    (crop.width ?? 0) * scaleX,
    (crop.height ?? 0) * scaleY,
    0,
    0,
    crop.width ?? 0,
    crop.height ?? 0
  );

  // eslint-disable-next-line local-rules/enforce-single-object-param
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));

        return;
      }

      const namedBlob = new Blob([blob], {type: 'image/jpeg'}) as Blob & {
        name: string;
      };
      namedBlob.name = 'croppedImage.jpg';

      resolve(namedBlob);
    }, 'image/jpeg');
  });
};

'use client';

import {ChangeEvent, useEffect, useMemo, useRef, useState} from 'react';

import {Icon} from '@iconify/react';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import {ALLOWED_IMAGE_ACCEPT} from '@/shared/constants/general';

interface FileDropzoneProps {
  files: File[];
  onFilesChange: ({files}: {files: File[]}) => void;
  accept?: string;
  multiple?: boolean;
  uploadText?: string;
  browseText?: string;
  icon?: string;
  showPreviews?: boolean;
  previewSize?: number;
  maxFiles?: number;
  hideDropzone?: boolean;
  disabled?: boolean;
}

const FileDropzone = ({
  files,
  onFilesChange,
  accept = ALLOWED_IMAGE_ACCEPT,
  multiple = true,
  uploadText = 'Drop files here or',
  browseText = 'browse',
  icon = 'mdi:tray-arrow-up',
  showPreviews = true,
  previewSize = 80,
  maxFiles,
  hideDropzone = false,
  disabled = false,
}: FileDropzoneProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // When only a single file is allowed the native picker should not offer
  // multi-select — otherwise users can pick multiple and we silently drop all
  // but one. `maxFiles === 1` is the source of truth here.
  const allowMultiple = multiple && maxFiles !== 1;

  // Both upload paths (picker + drag-and-drop) must enforce the same accept
  // rules: the native `accept` attribute is only a hint and can be bypassed via
  // the picker's "All files" option.
  const acceptedTypes = accept
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  const matchesAccept = ({file}: {file: File}) => {
    if (acceptedTypes.length === 0) return true;

    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    return acceptedTypes.some((type) => {
      // `.ext` extension, `type/*` wildcard, or exact MIME type.
      if (type.startsWith('.')) return fileName.endsWith(type);
      if (type.endsWith('/*')) return fileType.startsWith(type.slice(0, -1));

      return fileType === type;
    });
  };

  const deduplicateIncoming = ({incoming}: {incoming: File[]}): File[] => {
    return incoming.filter(
      (f) =>
        !files.some(
          (existing) => existing.name === f.name && existing.size === f.size
        )
    );
  };

  const limitFiles = ({incoming}: {incoming: File[]}): File[] => {
    if (!maxFiles) return incoming;
    const allowed = maxFiles - files.length;
    if (allowed <= 0) return [];

    return incoming.slice(0, allowed);
  };

  const handleFileSelect = ({e}: {e: ChangeEvent<HTMLInputElement>}) => {
    const selected = e.target.files;
    if (!selected || disabled) return;

    const incoming = deduplicateIncoming({
      incoming: Array.from(selected).filter((file) => matchesAccept({file})),
    });

    const limited = allowMultiple
      ? limitFiles({incoming})
      : incoming.slice(0, 1);

    if (limited.length === 0) {
      e.target.value = '';

      return;
    }

    const newFiles = allowMultiple ? [...files, ...limited] : limited;

    onFilesChange({files: newFiles});
    e.target.value = '';
  };

  const handleDrop = ({e}: {e: React.DragEvent<HTMLButtonElement>}) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    const dropped = deduplicateIncoming({
      incoming: Array.from(e.dataTransfer.files).filter((file) =>
        matchesAccept({file})
      ),
    });

    if (dropped.length === 0) return;

    const limited = allowMultiple
      ? limitFiles({incoming: dropped})
      : dropped.slice(0, 1);
    if (limited.length === 0) return;

    const newFiles = allowMultiple ? [...files, ...limited] : limited;
    onFilesChange({files: newFiles});
  };

  const handleRemove = ({index}: {index: number}) => {
    if (disabled) return;
    onFilesChange({files: files.filter((_, i) => i !== index)});
  };

  const isImageFile = ({file}: {file: File}) => file.type.startsWith('image/');

  const getFileIcon = ({file}: {file: File}) => {
    const type = file.type;
    const name = file.name.toLowerCase();

    if (type === 'application/pdf' || name.endsWith('.pdf'))
      return 'mdi:file-pdf-box';
    if (
      type.includes('word') ||
      name.endsWith('.doc') ||
      name.endsWith('.docx')
    )
      return 'mdi:file-word-box';
    if (
      type.includes('sheet') ||
      type.includes('excel') ||
      name.endsWith('.xls') ||
      name.endsWith('.xlsx') ||
      name.endsWith('.csv')
    )
      return 'mdi:file-excel-box';
    if (type.startsWith('text/') || name.endsWith('.txt'))
      return 'mdi:file-document-outline';

    return 'mdi:file-outline';
  };

  const formatFileSize = ({bytes}: {bytes: number}) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const previewUrls = useMemo(
    () =>
      showPreviews
        ? files.map((file) =>
            file.type.startsWith('image/') ? URL.createObjectURL(file) : ''
          )
        : [],
    [files, showPreviews]
  );

  useEffect(
    () => () => {
      previewUrls.forEach((url) => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
    },
    [previewUrls]
  );

  return (
    <div
      className={`flex flex-col gap-3 ${disabled ? 'opacity-60' : ''}`}
      aria-disabled={disabled || undefined}
    >
      <input
        ref={fileInputRef}
        type='file'
        hidden
        multiple={allowMultiple}
        accept={accept}
        disabled={disabled}
        onChange={(e) => handleFileSelect({e})}
      />

      {/* Drop Zone */}
      {!hideDropzone && (
        <button
          type='button'
          disabled={disabled}
          aria-label={`${uploadText} ${browseText}`}
          onDragOver={(e) => {
            if (disabled) return;
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => handleDrop({e})}
          onClick={() => {
            if (disabled) return;
            fileInputRef.current?.click();
          }}
          className={`w-full appearance-none text-inherit font-inherit border-2 border-dashed rounded-lg py-5 px-4 transition-[border-color,background-color] duration-200 flex flex-col items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--mui-palette-primary-main) ${
            disabled ? 'cursor-not-allowed' : 'cursor-pointer'
          } ${
            isDragOver
              ? 'border-(--mui-palette-primary-main) bg-(--mui-palette-action-hover)'
              : 'border-(--mui-palette-divider) bg-transparent hover:border-(--mui-palette-text-disabled) hover:bg-(--mui-palette-action-hover)'
          }`}
        >
          <div className='flex items-center justify-center w-12 h-12 rounded-lg bg-(--mui-palette-action-selected)'>
            <Icon
              icon={icon}
              fontSize='1.5rem'
              color='var(--mui-palette-text-secondary)'
            />
          </div>

          <Typography
            variant='body2'
            className='text-center'
            sx={{
              color: 'text.secondary',
            }}
          >
            {uploadText}{' '}
            <span className='text-(--mui-palette-primary-main) font-semibold underline underline-offset-[3px]'>
              {browseText}
            </span>
          </Typography>
        </button>
      )}

      {/* File Previews */}
      {showPreviews && files.length > 0 && (
        <div className='flex gap-2 flex-wrap'>
          {files.map((file, index) => (
            <div
              key={index}
              className='relative rounded-lg overflow-hidden shadow'
              style={{width: previewSize, height: previewSize}}
            >
              {isImageFile({file}) ? (
                <img
                  src={previewUrls[index] || undefined}
                  alt={file.name}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div
                  className='w-full h-full flex flex-col items-center justify-center gap-1 px-1 bg-(--mui-palette-action-hover)'
                  title={`${file.name} (${formatFileSize({bytes: file.size})})`}
                >
                  <Icon
                    icon={getFileIcon({file})}
                    fontSize='2rem'
                    color='var(--mui-palette-primary-main)'
                  />
                  <Typography
                    variant='caption'
                    className='w-full text-center leading-tight'
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      wordBreak: 'break-all',
                      fontSize: '0.65rem',
                    }}
                  >
                    {file.name}
                  </Typography>
                  <Typography
                    variant='caption'
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.6rem',
                      lineHeight: 1,
                    }}
                  >
                    {formatFileSize({bytes: file.size})}
                  </Typography>
                </div>
              )}
              <IconButton
                size='small'
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove({index});
                }}
                sx={{
                  position: 'absolute',
                  top: 3,
                  right: 3,
                  bgcolor: 'rgba(0,0,0,0.55)',
                  color: 'common.white',
                  width: 20,
                  height: 20,
                  '&:hover': {bgcolor: 'rgba(0,0,0,0.75)'},
                }}
              >
                <Icon icon='mdi:close' fontSize='0.75rem' />
              </IconButton>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileDropzone;

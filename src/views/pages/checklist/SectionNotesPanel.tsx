'use client';

import React, {useCallback, useEffect, useState} from 'react';

import {Icon} from '@iconify/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import {alpha, useTheme} from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import FileDropzone from '@/shared/components/common/inputs/FileDropzone';
import useTranslation from '@/shared/hooks/useTranslation';

import {SectionAttachment} from './types';

const PillItem = ({
  icon,
  color,
  children,
}: {
  icon: string;
  color: string;
  children: React.ReactNode;
}) => (
  <Box className='flex items-center gap-1.5'>
    <Icon icon={icon} fontSize='1rem' color={color} />
    <Typography variant='body2' sx={{fontWeight: 600, color: 'primary.main'}}>
      {children}
    </Typography>
  </Box>
);

interface SectionNotesPanelProps {
  sectionId: string;
  comment: string;
  attachments: SectionAttachment[];
  onCommentChange: (params: {sectionId: string; comment: string}) => void;
  onAttachmentsChange: (params: {
    sectionId: string;
    attachments: SectionAttachment[];
  }) => void;
  attachmentAccept?: string;
  attachmentMaxFiles?: number;
}

const SectionNotesPanel = ({
  sectionId,
  comment,
  attachments,
  onCommentChange,
  onAttachmentsChange,
  attachmentAccept,
  attachmentMaxFiles = 1,
}: SectionNotesPanelProps) => {
  const {t} = useTranslation();
  const theme = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [commentDraft, setCommentDraft] = useState(comment);
  const [isEditingComment, setIsEditingComment] = useState(false);

  const hasComment = comment.length > 0;
  const hasAttachments = attachments.length > 0;
  const hasNotes = hasComment || hasAttachments;

  const handleSaveComment = () => {
    onCommentChange({sectionId, comment: commentDraft});
    setIsEditingComment(false);
  };

  const handleCancelComment = () => {
    setCommentDraft(comment);
    setIsEditingComment(false);
  };

  const handleDeleteComment = () => {
    onCommentChange({sectionId, comment: ''});
    setCommentDraft('');
    setIsEditingComment(false);
  };

  // Revoke object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      attachments.forEach((att) => URL.revokeObjectURL(att.preview));
    };
  }, [attachments]);

  // Bridge File[] <-> SectionAttachment[] for FileDropzone
  const attachmentFiles = attachments.map((a) => a.file);

  const handleFilesChange = useCallback(
    ({files}: {files: File[]}) => {
      const updated: SectionAttachment[] = files.map((file) => {
        const existing = attachments.find((a) => a.file === file);
        if (existing) return existing;

        return {
          file,
          preview: URL.createObjectURL(file),
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        };
      });

      // Revoke URLs for removed attachments
      for (const att of attachments) {
        if (!files.includes(att.file)) URL.revokeObjectURL(att.preview);
      }

      onAttachmentsChange({sectionId, attachments: updated});
    },
    [attachments, onAttachmentsChange, sectionId]
  );

  const primaryColor = theme.palette.primary.main;

  return (
    <Box sx={{mt: 5}}>
      {/* Summary pill when collapsed */}
      {hasNotes && !isOpen && (
        <Box
          onClick={() => setIsOpen(true)}
          role='button'
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setIsOpen(true);
          }}
          className='inline-flex items-center cursor-pointer rounded'
          sx={{
            gap: 1.5,
            py: 1,
            px: 2,
            bgcolor: alpha(primaryColor, 0.06),
            transition: 'all 0.2s ease',
            '&:hover': {bgcolor: alpha(primaryColor, 0.1)},
          }}
        >
          {hasComment && (
            <PillItem icon='mdi:comment-text-outline' color={primaryColor}>
              {t('checklist.noteCount_one')}
            </PillItem>
          )}
          {hasComment && hasAttachments && (
            <Box
              sx={{width: 1, height: 16, bgcolor: alpha(primaryColor, 0.2)}}
            />
          )}
          {hasAttachments && (
            <PillItem icon='mdi:image-outline' color={primaryColor}>
              {attachments.length === 1
                ? t('checklist.photoCount', {count: 1})
                : t('checklist.photoCount_plural', {count: attachments.length})}
            </PillItem>
          )}
          <Icon
            icon='mdi:pencil-outline'
            fontSize='0.9rem'
            color={primaryColor}
          />
        </Box>
      )}

      {/* Toggle button when empty */}
      {!hasNotes && !isOpen && (
        <Button
          startIcon={<Icon icon='mdi:note-plus-outline' />}
          onClick={() => {
            setIsOpen(true);
            setIsEditingComment(true);
          }}
          sx={{
            textTransform: 'none',
            color: 'text.secondary',
            fontWeight: 500,
            fontSize: '0.875rem',
            py: 1,
            px: 2,
            '&:hover': {
              bgcolor: alpha(primaryColor, 0.06),
              color: 'primary.main',
            },
          }}
        >
          {t('checklist.addNoteOrPhoto')}
        </Button>
      )}

      {/* Expanded Panel */}
      <Collapse in={isOpen}>
        <Box
          className='flex flex-col rounded'
          sx={{gap: 4, mt: 2, p: 4, bgcolor: theme.palette.background.default}}
        >
          <Box className='flex items-center justify-between'>
            <Typography
              variant='subtitle1'
              className='flex items-center gap-2 font-semibold'
            >
              <Icon icon='mdi:note-text-outline' fontSize='1.25rem' />
              {t('checklist.notesAndAttachments')}
            </Typography>
            <IconButton onClick={() => setIsOpen(false)} size='small'>
              <Icon icon='mdi:chevron-up' fontSize='1.25rem' />
            </IconButton>
          </Box>

          {/* Comment */}
          {hasComment && !isEditingComment ? (
            <Box className='rounded' sx={{p: 3, bgcolor: 'background.paper'}}>
              <Typography
                variant='body2'
                sx={{mb: 2.5, whiteSpace: 'pre-wrap', lineHeight: 1.7}}
              >
                {comment}
              </Typography>
              <Box className='flex' sx={{gap: 2}}>
                <Button
                  variant='outlined'
                  size='small'
                  startIcon={<Icon icon='mdi:pencil-outline' />}
                  onClick={() => {
                    setCommentDraft(comment);
                    setIsEditingComment(true);
                  }}
                  sx={{textTransform: 'none'}}
                >
                  {t('checklist.edit')}
                </Button>
                <Button
                  variant='outlined'
                  size='small'
                  color='error'
                  startIcon={<Icon icon='mdi:delete-outline' />}
                  onClick={handleDeleteComment}
                  sx={{textTransform: 'none'}}
                >
                  {t('checklist.remove')}
                </Button>
              </Box>
            </Box>
          ) : (
            <Box>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder={t('checklist.commentPlaceholder')}
                value={commentDraft}
                onChange={(e) => setCommentDraft(e.target.value)}
              />
              {(isEditingComment || commentDraft.trim()) && (
                <Box className='flex' sx={{gap: 2, mt: 2.5}}>
                  <Button
                    variant='contained'
                    onClick={handleSaveComment}
                    disabled={!commentDraft.trim()}
                    sx={{textTransform: 'none', px: 3}}
                  >
                    {t('checklist.saveNote')}
                  </Button>
                  <Button
                    variant='outlined'
                    onClick={handleCancelComment}
                    sx={{textTransform: 'none'}}
                  >
                    {t('checklist.cancel')}
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {/* Attachments — hide picker once cap reached */}
          <FileDropzone
            files={attachmentFiles}
            onFilesChange={handleFilesChange}
            accept={attachmentAccept}
            icon='mdi:camera-plus-outline'
            uploadText={t('checklist.uploadPhotoPrompt')}
            browseText={t('checklist.uploadPhotoHint')}
            previewSize={120}
            maxFiles={attachmentMaxFiles}
            hideDropzone={
              attachmentMaxFiles
                ? attachments.length >= attachmentMaxFiles
                : false
            }
          />
        </Box>
      </Collapse>
    </Box>
  );
};

export default SectionNotesPanel;

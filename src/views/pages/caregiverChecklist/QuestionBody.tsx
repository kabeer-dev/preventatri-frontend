'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import RequiredMark from '@/shared/components/common/RequiredMark';
import useTranslation from '@/shared/hooks/useTranslation';
import {QuestionBodyProps} from '@/shared/interfaces/caregiverChecklistRunner';
import CommentAndPhoto from '@/views/pages/caregiverChecklist/CommentAndPhoto';
import QuestionInput from '@/views/pages/caregiverChecklist/QuestionInput';

/**
 * The question in view: its label, title and hint, the answer control, the
 * "answer this first" line, and the comment and photo field under it. The
 * two shells wrap this differently but ask the same thing the same way.
 */
const QuestionBody = ({runner, label, isPhone}: QuestionBodyProps) => {
  const {t} = useTranslation();

  const {currentQuestion, isBlocked} = runner;

  if (!currentQuestion) return null;

  const answer = runner.getAnswer({questionId: currentQuestion.id});

  return (
    <>
      <Typography
        variant='eyebrow'
        component='h2'
        sx={{
          color: 'text.disabled',
          ...(isPhone ? {pt: 6} : {px: 1, pb: 2}),
        }}
      >
        {label}
      </Typography>

      <Typography variant='h1' sx={isPhone ? {mt: 2.5} : {fontSize: '2rem'}}>
        {currentQuestion.title}
        {currentQuestion.required && <RequiredMark />}
      </Typography>

      {currentQuestion.placeholder && (
        <Typography
          sx={{
            fontSize: isPhone ? '0.90625rem' : '0.9375rem',
            color: 'text.secondary',
            lineHeight: 1.55,
            mt: isPhone ? 3 : 2.5,
          }}
        >
          {currentQuestion.placeholder}
        </Typography>
      )}

      <Box data-runner-input sx={{mt: isPhone ? 6 : 7.5}}>
        <QuestionInput
          isPhone={isPhone}
          question={currentQuestion}
          answer={answer}
          onChange={({value}) =>
            runner.setAnswer({questionId: currentQuestion.id, value})
          }
        />
      </Box>

      {isBlocked && (
        <Typography sx={{fontSize: '0.8125rem', color: 'error.main', mt: 3}}>
          {t('caregiverChecklist.required')}
        </Typography>
      )}

      <Box sx={{mt: isPhone ? 5 : 8.5}}>
        <CommentAndPhoto
          key={currentQuestion.id}
          comment={answer.comment}
          attachments={answer.attachments}
          onCommentChange={({comment}) =>
            runner.setComment({questionId: currentQuestion.id, comment})
          }
          onAddFiles={({files}) =>
            runner.addAttachments({questionId: currentQuestion.id, files})
          }
          onRemoveAttachment={({previewUrl}) =>
            runner.removeAttachment({
              questionId: currentQuestion.id,
              previewUrl,
            })
          }
        />
      </Box>
    </>
  );
};

export default QuestionBody;

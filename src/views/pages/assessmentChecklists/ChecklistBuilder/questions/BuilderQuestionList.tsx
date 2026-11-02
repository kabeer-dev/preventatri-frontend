'use client';

import {useState} from 'react';

import {Icon} from '@iconify/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {useFieldArray} from 'react-hook-form';

import {CHECKLIST_BUILDER_ICONS} from '@/shared/constants/checklistBuilder';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  BuilderMoveParams,
  BuilderQuestionListProps,
} from '@/shared/interfaces/checklistBuilder';
import {createEmptyQuestion} from '@/shared/utils/checklistBuilderUtils';

import BuilderQuestionEditor from './BuilderQuestionEditor';
import BuilderQuestionRow from './BuilderQuestionRow';

const BuilderQuestionList = ({
  control,
  templateType,
  sectionIndex,
}: BuilderQuestionListProps) => {
  const {t} = useTranslation();

  const {fields, append, remove, move} = useFieldArray({
    control,
    name: `sections.${sectionIndex}.questions`,
  });

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleAdd = () => {
    setOpenIndex(fields.length);
    append(createEmptyQuestion());
  };

  // The open editor follows its item when rows move or earlier rows go away.
  const handleMove = ({from, to}: BuilderMoveParams) => {
    move(from, to);
    if (openIndex === from) setOpenIndex(to);
    else if (openIndex === to) setOpenIndex(from);
  };

  const handleRemove = ({index}: {index: number}) => {
    remove(index);
    if (openIndex === null) return;
    if (openIndex === index) setOpenIndex(null);
    else if (openIndex > index) setOpenIndex(openIndex - 1);
  };

  return (
    <Box>
      {fields.map((field, questionIndex) => {
        const sharedProps = {
          control,
          templateType,
          sectionIndex,
          questionIndex,
          onRemove: () => handleRemove({index: questionIndex}),
        };

        return questionIndex === openIndex ? (
          <BuilderQuestionEditor
            key={field.id}
            {...sharedProps}
            onDone={() => setOpenIndex(null)}
          />
        ) : (
          <BuilderQuestionRow
            key={field.id}
            {...sharedProps}
            questionCount={fields.length}
            onOpen={() => setOpenIndex(questionIndex)}
            onMove={handleMove}
          />
        );
      })}

      <Box sx={{px: 4, py: 2}}>
        <Button
          size='small'
          startIcon={<Icon icon={CHECKLIST_BUILDER_ICONS.add} />}
          onClick={handleAdd}
        >
          {t('assessmentChecklists.builder.actions.addItem')}
        </Button>
      </Box>
    </Box>
  );
};

export default BuilderQuestionList;

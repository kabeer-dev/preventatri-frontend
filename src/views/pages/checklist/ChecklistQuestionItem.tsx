'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import RequiredMark from '@/shared/components/common/RequiredMark';
import useTranslation from '@/shared/hooks/useTranslation';
import {CHECKLIST_FIELD_TYPES} from '@/shared/interfaces/assessmentChecklistDetails';
import {parseMultiSelectValue} from '@/shared/utils/assessmentChecklistUtils';

import ChecklistFieldInput from './ChecklistFieldInput';
import SelectableOption from './SelectableOption';
import {ChecklistAnswer, ChecklistOption, ChecklistQuestion} from './types';

interface ChecklistQuestionItemProps {
  index: number;
  question: ChecklistQuestion;
  answer: ChecklistAnswer;
  onAnswerChange: (params: {answer: ChecklistAnswer}) => void;
}

const ChecklistQuestionItem = ({
  index,
  question,
  answer,
  onAnswerChange,
}: ChecklistQuestionItemProps) => {
  const {t} = useTranslation();
  const hasOptions = question.options && question.options.length > 0;
  const isMultiSelect = question.type === CHECKLIST_FIELD_TYPES.MULTI_SELECT;
  const isBooleanType = question.type === CHECKLIST_FIELD_TYPES.BOOLEAN;
  const isCheckboxType = question.type === CHECKLIST_FIELD_TYPES.CHECKBOX;

  const handleOptionChange = ({value}: {value: string}) => {
    onAnswerChange({answer: {...answer, selectedOption: value}});
  };

  const handleMultiSelectToggle = ({optionValue}: {optionValue: string}) => {
    const current = parseMultiSelectValue({value: answer.selectedOption});

    const updated = current.includes(optionValue)
      ? current.filter((v) => v !== optionValue)
      : [...current, optionValue];

    onAnswerChange({
      answer: {...answer, selectedOption: JSON.stringify(updated)},
    });
  };

  const renderOptionList = ({
    options,
    variant,
  }: {
    options: ChecklistOption[];
    variant: 'radio' | 'checkbox';
  }) => {
    const selectedValues =
      variant === 'checkbox'
        ? parseMultiSelectValue({value: answer.selectedOption})
        : [];

    return (
      <Box className='flex flex-col' sx={{gap: 0.5}}>
        {options.map((option) => (
          <SelectableOption
            key={option.value}
            label={option.label}
            variant={variant}
            selected={
              variant === 'checkbox'
                ? selectedValues.includes(option.value)
                : answer.selectedOption === option.value
            }
            onClick={() =>
              variant === 'checkbox'
                ? handleMultiSelectToggle({optionValue: option.value})
                : handleOptionChange({value: option.value})
            }
          />
        ))}
      </Box>
    );
  };

  const renderInput = () => {
    if (isMultiSelect && hasOptions) {
      return renderOptionList({options: question.options, variant: 'checkbox'});
    }

    if (hasOptions) {
      return renderOptionList({options: question.options, variant: 'radio'});
    }

    if (isBooleanType) {
      return renderOptionList({
        options: [
          {label: t('commonContent.yes'), value: 'true'},
          {label: t('commonContent.no'), value: 'false'},
        ],
        variant: 'radio',
      });
    }

    if (isCheckboxType) {
      return renderOptionList({
        options: [
          {label: t('commonContent.yes'), value: 'yes'},
          {label: t('commonContent.no'), value: 'no'},
        ],
        variant: 'radio',
      });
    }

    return (
      <ChecklistFieldInput
        type={question.type}
        value={answer.selectedOption}
        placeholder={question.placeholder || undefined}
        onChange={handleOptionChange}
      />
    );
  };

  return (
    <Box>
      <Typography
        variant='body1'
        className='flex items-baseline gap-1'
        sx={{fontWeight: 600, mb: 1}}
      >
        {index + 1}. {question.title}
        {question.required && <RequiredMark fontSize='1rem' />}
      </Typography>
      <Box sx={{mt: 1}}>{renderInput()}</Box>
    </Box>
  );
};

export default ChecklistQuestionItem;

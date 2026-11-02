'use client';

import Box from '@mui/material/Box';

import useTranslation from '@/shared/hooks/useTranslation';
import {CHECKLIST_FIELD_TYPES} from '@/shared/interfaces/assessmentChecklistDetails';
import {
  RunnerAnswer,
  RunnerQuestion,
} from '@/shared/interfaces/caregiverChecklistRunner';
import {ChecklistOption} from '@/shared/interfaces/checklist';
import {parseMultiSelectValue} from '@/shared/utils/assessmentChecklistUtils';
import ChecklistFieldInput from '@/views/pages/checklist/ChecklistFieldInput';
import SelectableOption from '@/views/pages/checklist/SelectableOption';

interface Props {
  question: RunnerQuestion;
  answer: RunnerAnswer;
  onChange: ({value}: {value: string}) => void;

  /** The phone gives every control a thumb sized row. */
  isPhone: boolean;
}

const QuestionInput = ({question, answer, onChange, isPhone}: Props) => {
  const {t} = useTranslation();

  const {type, options} = question;

  const hasOptions = options.length > 0;

  const size = isPhone ? 'large' : 'medium';

  const handleMultiToggle = ({optionValue}: {optionValue: string}) => {
    const current = parseMultiSelectValue({value: answer.value});

    const updated = current.includes(optionValue)
      ? current.filter((item) => item !== optionValue)
      : [...current, optionValue];

    onChange({value: JSON.stringify(updated)});
  };

  const renderRows = ({
    rows,
    isMulti,
  }: {
    rows: ChecklistOption[];
    isMulti: boolean;
  }) => {
    const selectedValues = isMulti
      ? parseMultiSelectValue({value: answer.value})
      : [];

    return (
      <Box sx={{display: 'flex', flexDirection: 'column', gap: 2.5}}>
        {rows.map((option) => (
          <SelectableOption
            key={option.value}
            label={option.label}
            variant={isMulti ? 'checkbox' : 'radio'}
            size={size}
            selected={
              isMulti
                ? selectedValues.includes(option.value)
                : answer.value === option.value
            }
            onClick={() =>
              isMulti
                ? handleMultiToggle({optionValue: option.value})
                : onChange({value: option.value})
            }
          />
        ))}
      </Box>
    );
  };

  if (type === CHECKLIST_FIELD_TYPES.MULTI_SELECT && hasOptions) {
    return renderRows({rows: options, isMulti: true});
  }

  if (hasOptions) return renderRows({rows: options, isMulti: false});

  if (
    type === CHECKLIST_FIELD_TYPES.BOOLEAN ||
    type === CHECKLIST_FIELD_TYPES.CHECKBOX
  ) {
    const isBoolean = type === CHECKLIST_FIELD_TYPES.BOOLEAN;

    const yesValue = isBoolean ? 'true' : 'yes';

    const noValue = isBoolean ? 'false' : 'no';

    // The one large Yes or No button the phone shows for a true or false answer.
    return (
      <Box sx={{display: 'flex', flexDirection: 'column', gap: 2.5}}>
        <SelectableOption
          labelOnly
          variant='radio'
          size={size}
          label={t('commonContent.yes')}
          selected={answer.value === yesValue}
          onClick={() => onChange({value: yesValue})}
        />
        <SelectableOption
          labelOnly
          variant='radio'
          size={size}
          label={t('commonContent.no')}
          selected={answer.value === noValue}
          onClick={() => onChange({value: noValue})}
        />
      </Box>
    );
  }

  return (
    <ChecklistFieldInput
      type={type}
      value={answer.value}
      onChange={onChange}
      placeholder={question.placeholder || undefined}
      size={size}
    />
  );
};

export default QuestionInput;

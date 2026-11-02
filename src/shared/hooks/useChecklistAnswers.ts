'use client';

import {useState} from 'react';

import {
  ChecklistAnswer,
  ChecklistQuestion,
} from '@/shared/interfaces/checklist';

const useChecklistAnswers = ({
  allQuestions,
  templateId,
}: {
  allQuestions: ChecklistQuestion[];
  templateId?: string;
}) => {
  const [answers, setAnswers] = useState<ChecklistAnswer[]>([]);
  const [seededTemplateId, setSeededTemplateId] = useState<string>();

  const needsSeeding = templateId !== seededTemplateId || answers.length === 0;

  if (allQuestions.length > 0 && templateId && needsSeeding) {
    setSeededTemplateId(templateId);
    setAnswers(
      allQuestions.map((question) => ({
        questionId: question.id,
        selectedOption: '',
        comment: '',
      }))
    );
  }

  return {answers, setAnswers};
};

export default useChecklistAnswers;

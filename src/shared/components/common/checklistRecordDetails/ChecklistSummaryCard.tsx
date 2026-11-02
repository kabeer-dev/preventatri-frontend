'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import {ChecklistSummaryCardProps} from '@/shared/interfaces/workItem';

// Read-only question list of a work item's checklist, for anyone but the
// person who will answer it.
const ChecklistSummaryCard = ({
  title,
  questions,
  hint,
  emptyLabel,
}: ChecklistSummaryCardProps) => (
  <Card elevation={6}>
    <CardContent className='px-3 py-6 md:px-4'>
      <Typography variant='h6' className='font-bold'>
        {title}
      </Typography>
      {hint && (
        <Typography
          variant='small'
          sx={{display: 'block', mb: 3, color: 'text.disabled'}}
        >
          {hint}
        </Typography>
      )}

      {questions.length === 0 ? (
        <Typography variant='body2' sx={{color: 'text.disabled'}}>
          {emptyLabel}
        </Typography>
      ) : (
        <Stack divider={<Divider />}>
          {questions.map((question, index) => (
            <Box
              key={question.id}
              className='flex items-baseline gap-3 px-1 py-2'
            >
              <Typography
                variant='small'
                sx={{
                  color: 'text.disabled',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {index + 1}
              </Typography>
              <Typography variant='body2'>{question.title}</Typography>
            </Box>
          ))}
        </Stack>
      )}
    </CardContent>
  </Card>
);

export default ChecklistSummaryCard;

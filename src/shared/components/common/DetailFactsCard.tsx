'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import {DETAIL_FACTS_CARD} from '@/shared/constants/common';
import {DetailFactsCardProps} from '@/shared/interfaces/uiComponents';

// A rail card of label/value pairs: the record's own facts, stated once and
// never repeated in the working column beside it. Facts with no value are
// dropped by the caller, and a card left with none renders nothing rather than
// a bare heading. `inline` is the narrow-rail reading: label beside value on
// one line, rather than the two-column grid of stacked pairs.
const DetailFactsCard = ({
  title,
  facts,
  inline,
  inlineLabelWidth = DETAIL_FACTS_CARD.inlineLabelWidth,
  divided,
  footer,
}: DetailFactsCardProps) => {
  if (facts.length === 0 && !footer) return null;

  // Undefined leaves each line on its own variant's line height.
  const dividedLineHeight = divided
    ? DETAIL_FACTS_CARD.dividedLineHeight
    : undefined;

  const inlineListClassName = divided
    ? 'flex flex-col gap-1.5'
    : 'flex flex-col gap-2.5';

  return (
    <Card>
      <CardContent className='flex flex-col gap-3.5'>
        <Typography
          variant='eyebrow'
          component='h2'
          sx={{color: 'text.secondary'}}
        >
          {title}
        </Typography>

        <Box
          className={
            inline ? inlineListClassName : 'grid grid-cols-2 gap-x-3.5 gap-y-3'
          }
        >
          {facts.map(({label, value, wide}) =>
            inline ? (
              <Box
                key={label}
                className={
                  divided
                    ? 'flex flex-wrap items-baseline gap-x-3 border-b border-border pb-1.5 last:border-b-0 last:pb-0'
                    : 'flex items-baseline gap-3'
                }
              >
                <Typography
                  variant='small'
                  sx={{
                    color: 'text.secondary',
                    flex: 'none',
                    width: inlineLabelWidth,
                    lineHeight: dividedLineHeight,
                  }}
                >
                  {label}
                </Typography>
                <Typography
                  variant='bodyStrong'
                  component='div'
                  className='min-w-0'
                  sx={{
                    overflowWrap: 'anywhere',
                    lineHeight: dividedLineHeight,
                    flex: divided
                      ? `1 1 ${DETAIL_FACTS_CARD.dividedValueMinWidth}px`
                      : undefined,
                  }}
                >
                  {value}
                </Typography>
              </Box>
            ) : (
              <Box
                key={label}
                className='min-w-0'
                sx={wide ? {gridColumn: '1 / -1'} : undefined}
              >
                <Typography variant='small' sx={{color: 'text.secondary'}}>
                  {label}
                </Typography>
                <Typography
                  variant='bodyStrong'
                  component='div'
                  sx={{mt: 0.5, overflowWrap: 'anywhere'}}
                >
                  {value}
                </Typography>
              </Box>
            )
          )}
        </Box>

        {footer}
      </CardContent>
    </Card>
  );
};

export default DetailFactsCard;

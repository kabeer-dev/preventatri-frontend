'use client';

import {Icon} from '@iconify/react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

import {radius} from '@/@core/theme/spacing';
import {LIST_TOOLBAR} from '@/shared/constants/listToolbar';
import useTranslation from '@/shared/hooks/useTranslation';
import {AddFilterFieldListProps} from '@/shared/interfaces/listToolbar';
import {getFilterFlagLabel} from '@/shared/utils/listToolbar';

const AddFilterFieldList = ({
  fields,
  activeParam,
  onSelect,
}: AddFilterFieldListProps) => {
  const {t} = useTranslation();

  return (
    <Box
      className='bg-surface p-1.5'
      sx={{
        width: {xs: '100%', sm: LIST_TOOLBAR.fieldListWidth},
        flexShrink: 0,
        borderStyle: 'solid',
        borderColor: 'customColors.ruleStrong',
        borderWidth: 0,
        borderLeftWidth: {sm: 1},
        borderBottomWidth: {xs: 1, sm: 0},
      }}
    >
      <Typography
        variant='eyebrow'
        className='text-ink-faint px-2.5 pt-2 pb-1.5'
        sx={{display: {xs: 'none', sm: 'block'}}}
      >
        {t('listToolbar.filterBy')}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: {xs: 'row', sm: 'column'},
          overflowX: {xs: 'auto', sm: 'visible'},
        }}
      >
        {fields.map((field) => {
          const isActive = field.param === activeParam;
          const flagLabel = getFilterFlagLabel({field, t});

          return (
            <ButtonBase
              key={field.param}
              aria-current={isActive}
              onClick={() => onSelect({param: field.param})}
              sx={{
                justifyContent: 'flex-start',
                flexShrink: 0,
                gap: 2.5,
                px: 2.5,
                py: 2,
                whiteSpace: 'nowrap',
                borderRadius: `${radius.sm}px`,
                typography: isActive ? 'bodyStrong' : 'body',
                color: field.disabled
                  ? 'customColors.inkFaint'
                  : 'text.primary',
                ...(isActive && {
                  bgcolor: field.disabled
                    ? 'customColors.ruleStrong'
                    : 'customColors.brandTint',
                  color: field.disabled ? 'text.secondary' : 'primary.dark',
                }),
                '&:hover': {
                  bgcolor: isActive ? undefined : 'customColors.ruleStrong',
                },
              }}
            >
              <Icon icon={field.icon} fontSize={16} style={{opacity: 0.6}} />
              {field.label}
              {flagLabel && (
                <Typography
                  component='span'
                  variant='small'
                  sx={{
                    ml: 'auto',
                    pl: 2,
                    color: field.disabled
                      ? 'customColors.inkFaint'
                      : isActive
                        ? 'primary.dark'
                        : 'customColors.brandMuted',
                  }}
                >
                  {flagLabel}
                </Typography>
              )}
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
};

export default AddFilterFieldList;

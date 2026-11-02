'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import {radius} from '@/@core/theme/spacing';
import RegionsIcon from '@/shared/assets/icons/regions.svg';
import {REGION_CARD} from '@/shared/constants/regions';
import useTranslation from '@/shared/hooks/useTranslation';
import {RegionCardProps} from '@/shared/interfaces/region';
import {formatCountyLabel} from '@/shared/utils/countyUtils';

import NurseCoverageRow from './NurseCoverageRow';
import {activePillSx, countyPillSx, inactivePillSx} from './styles';

const RegionCard = ({region, onEdit, onDelete, disabled}: RegionCardProps) => {
  const {t} = useTranslation();

  const counties = region.counties || [];

  // An archived region stays on the page for reference but cannot be changed.
  const isArchived = Boolean(region.archived ?? region.isDeleted);

  const totalNurses =
    (region.primaryNurses?.length || 0) + (region.secondaryNurses?.length || 0);

  return (
    <Card>
      <Box className='flex items-start gap-3 px-4.5 py-3.75'>
        <Box
          sx={{
            width: REGION_CARD.iconTileSize,
            height: REGION_CARD.iconTileSize,
            borderRadius: `${radius.sm}px`,
            display: 'grid',
            placeItems: 'center',
            flex: 'none',
            color: 'primary.main',
            backgroundColor: 'customColors.brandTint',
          }}
        >
          <RegionsIcon className='size-[19px]' />
        </Box>

        <Box className='flex min-w-0 flex-auto flex-col gap-1'>
          <Box className='flex flex-wrap items-center gap-2.25'>
            <Typography variant='h3' component='h3'>
              {region.name}
            </Typography>

            {region.code && (
              <Typography
                variant='mono'
                sx={{color: 'customColors.inkFaint', fontSize: '11.5px'}}
              >
                {region.code}
              </Typography>
            )}

            <Box
              component='span'
              sx={
                region.isActive && !isArchived ? activePillSx : inactivePillSx
              }
            >
              {t(
                isArchived
                  ? 'region.archived'
                  : region.isActive
                    ? 'region.active'
                    : 'region.inactive'
              )}
            </Box>
          </Box>

          <Typography variant='small' sx={{color: 'text.secondary'}}>
            {t('region.card.nurseCount', {count: totalNurses})}
          </Typography>
        </Box>

        {!isArchived && (
          <Box className='flex flex-none items-center gap-2'>
            <Button
              variant='outlined'
              color='secondary'
              size='small'
              disabled={disabled}
              onClick={() => onEdit?.({id: region.id})}
            >
              {t('region.card.edit')}
            </Button>
            <Button
              variant='outlined'
              color='error'
              size='small'
              disabled={disabled}
              onClick={() => onDelete?.({id: region.id})}
            >
              {t('region.card.delete')}
            </Button>
          </Box>
        )}
      </Box>

      <Box
        className='flex flex-col items-start gap-5 md:flex-row'
        sx={{
          px: 4.5,
          pt: 3.25,
          pb: 3.5,
          backgroundColor: 'customColors.surfaceRaised',
          borderTop: '1px solid',
          borderColor: 'customColors.ruleStrong',
        }}
      >
        <Box className='flex min-w-0 flex-auto flex-col gap-1.75'>
          <Typography
            variant='eyebrow'
            component='p'
            sx={{color: 'text.disabled'}}
          >
            {t('region.card.countiesHeading', {count: counties.length})}
          </Typography>

          <Box className='flex flex-wrap items-center gap-1.75'>
            {counties.map((county) => (
              <Box key={county.id} component='span' sx={countyPillSx}>
                {formatCountyLabel(county)}
              </Box>
            ))}

            {!isArchived && (
              <Button
                variant='text'
                disabled={disabled}
                onClick={() => onEdit?.({id: region.id})}
                sx={{
                  minHeight: 'auto',
                  px: 2.75,
                  py: 2,
                  fontSize: '12px',
                  fontWeight: 400,
                  color: 'customColors.inkFaint',
                }}
              >
                {t('region.card.addCounty')}
              </Button>
            )}
          </Box>
        </Box>

        <Box className='flex w-full flex-col gap-1.75 md:w-[300px] md:flex-none'>
          <Typography
            variant='eyebrow'
            component='p'
            sx={{color: 'text.disabled'}}
          >
            {t('region.card.nurseCoverage')}
          </Typography>

          <NurseCoverageRow
            label={t('region.card.primary')}
            nurses={region.primaryNurses}
          />
          <NurseCoverageRow
            label={t('region.card.secondary')}
            nurses={region.secondaryNurses}
          />
        </Box>
      </Box>
    </Card>
  );
};

export default RegionCard;

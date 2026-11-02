'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import {PASSWORD_RULES} from '@/shared/constants/passwordPolicy';
import useTranslation from '@/shared/hooks/useTranslation';
import {PasswordPolicyChecklistProps} from '@/shared/interfaces/inputs';
import {cn} from '@/shared/utils/tailwindUtils';

export default function PasswordPolicyChecklist({
  password,
}: PasswordPolicyChecklistProps) {
  const {t} = useTranslation();

  // The schema trims before it applies the rules, so the checklist has to as
  // well, or leading spaces tick every rule green over a value zod will reject.
  const value = password.trim();

  return (
    <Box className='bg-surface-raised rounded-xl px-4 py-3.5'>
      <Typography variant='eyebrow' className='text-ink-muted mb-2.5 block'>
        {t('auth.agencyPolicy')}
      </Typography>

      <Box
        component='ul'
        aria-live='polite'
        className='grid list-none grid-cols-1 gap-x-4 gap-y-2.5 p-0 sm:grid-cols-2'
      >
        {PASSWORD_RULES.map((rule) => {
          const isMet = rule.isMet({value});

          return (
            <Box
              component='li'
              key={rule.id}
              className='flex items-center gap-2.5'
            >
              <Box
                aria-hidden
                className={cn(
                  'grid size-4.5 shrink-0 place-items-center rounded-full',
                  isMet ? 'bg-brand-tint text-brand' : 'bg-rule text-ink-subtle'
                )}
              >
                {isMet && <Icon icon='mdi:check' fontSize={11} />}
              </Box>

              <Typography
                variant='small'
                className={isMet ? 'text-ink-muted' : 'text-ink-subtle'}
              >
                {t(rule.messageKey)}
                <span className='sr-only'>
                  {` (${isMet ? t('auth.policyRuleMet') : t('auth.policyRuleUnmet')})`}
                </span>
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

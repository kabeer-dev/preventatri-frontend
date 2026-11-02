'use client';

import Box from '@mui/material/Box';

import AlertReviewGrid from '@/shared/components/common/alertReview/AlertReviewGrid';
import RecordHeading from '@/shared/components/common/headers/RecordHeading';
import TopBarSlot from '@/shared/components/layout/topBarSlot';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useTranslation from '@/shared/hooks/useTranslation';
import useUserRole from '@/shared/hooks/useUserRole';
import {ReviewDetailLayoutProps} from '@/shared/interfaces/alertReview';

const ReviewDetailLayout = ({
  backLabel,
  backHref,
  name,
  avatarColor,
  banner,
  ...gridProps
}: ReviewDetailLayoutProps) => {
  const {t} = useTranslation();
  const {isCaregiver} = useUserRole();

  // Caregivers have no access to the lists; they reach these pages from Activity.
  const back = isCaregiver
    ? {
        label: t('alertReview.backToActivity'),
        href: DASHBOARD_ROUTES.activity.all(),
      }
    : {label: backLabel, href: backHref};

  return (
    <>
      <TopBarSlot side='left'>
        <RecordHeading
          crumb={back.label}
          crumbHref={back.href}
          name={name}
          avatarColor={avatarColor}
        />
      </TopBarSlot>

      {banner ? (
        <Box sx={{display: 'grid', gap: 4}}>
          {banner}
          <AlertReviewGrid {...gridProps} />
        </Box>
      ) : (
        <AlertReviewGrid {...gridProps} />
      )}
    </>
  );
};

export default ReviewDetailLayout;

import CenteredColumnSkeleton from '@/shared/components/common/skeletons/CenteredColumnSkeleton';
import PageSkeletonBlock from '@/shared/components/common/skeletons/PageSkeletonBlock';
import SplitLayoutSkeleton from '@/shared/components/common/skeletons/SplitLayoutSkeleton';
import {SKELETON_LAYOUT} from '@/shared/constants/skeletons';
import {PageSkeletonProps} from '@/shared/interfaces/skeletons';

const PageSkeleton = ({
  layout,
  columns,
  template = {lg: '1fr'},
  hasRecordHeading = false,
  recordHeadingLines,
  maxWidth,
}: PageSkeletonProps) => {
  const columnNodes = columns.map((blocks) =>
    blocks.map((block, index) => (
      <PageSkeletonBlock key={index} block={block} />
    ))
  );

  if (layout === 'column') {
    return (
      <CenteredColumnSkeleton
        maxWidth={maxWidth ?? SKELETON_LAYOUT.formMaxWidth}
      >
        {columnNodes[0]}
      </CenteredColumnSkeleton>
    );
  }

  return (
    <SplitLayoutSkeleton
      template={template}
      columns={columnNodes}
      hasRecordHeading={hasRecordHeading}
      recordHeadingLines={recordHeadingLines}
      maxWidth={maxWidth}
    />
  );
};

export default PageSkeleton;

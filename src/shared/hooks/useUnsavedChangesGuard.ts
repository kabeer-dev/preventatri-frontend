import {useState} from 'react';

import {UseUnsavedChangesGuardParams} from '@/shared/interfaces/hooks';

// Stands between a form surface's close affordances and the actual close: a
// dirty form asks first, a submitting one refuses outright. Shared by the form
// modal and the form drawer so both answer a stray Escape the same way.
const useUnsavedChangesGuard = ({
  isDirty,
  isLoading,
  onClose,
}: UseUnsavedChangesGuardParams) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const requestClose = () => {
    if (isLoading) return;
    if (isDirty) setIsConfirmOpen(true);
    else onClose();
  };

  const confirmClose = () => {
    setIsConfirmOpen(false);
    onClose();
  };

  const cancelClose = () => setIsConfirmOpen(false);

  return {isConfirmOpen, requestClose, confirmClose, cancelClose};
};

export default useUnsavedChangesGuard;

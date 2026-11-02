import {ReactNode} from 'react';

import {ButtonProps as MuiButtonProps} from '@mui/material/Button';

import {ThemeColor} from '@/@core/theme/types';
import type {BaseDialogProps} from '@/shared/components/common/modals/BaseDialog';

export interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: null | ((value: boolean) => void);
  width?: number;
  outlineColor?: string;
}

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface FormModalProps<TPayload> extends BaseModalProps {
  onSubmit: (data: TPayload) => void;
  isLoading?: boolean;

  // Renders the bare form so a host (the invite drawer) supplies the one drawer.
  embedded?: boolean;
  formId?: string;
  onDirtyChange?: ({isDirty}: {isDirty: boolean}) => void;
}

export interface ButtonProps {
  title: string;
  handleClick?: () => void;
  variant?: MuiButtonProps['variant'];
  styles?: string;
  loading?: boolean;
  loaderColor?: string;
  disabled?: boolean;
}

export interface GeneralModalProps {
  title?: string;
  content?: ReactNode[];
  isOpen: boolean;
  width?: number;
  buttons?: ButtonProps[];
  buttonsAlignment?: string;
  onClose: (value: boolean) => void;
}

export interface ConfirmationModalProps {
  title: string;
  isOpen: boolean;
  dismissLabel?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm?: () => void;
  confirmLoading?: boolean;
  disableConfirm?: boolean;
  buttons?: ButtonProps[];
  content?: ReactNode | string;
  confirmButtonColor?: ThemeColor;
  width?: BaseDialogProps['width'];
  maxWidth?: BaseDialogProps['maxWidth'];
}

export interface DeleteConfirmationModalProps {
  title: string;
  isOpen: boolean;
  dismissLabel?: string;
  deleteLabel?: string;
  onCancel: () => void;
  onDelete: () => void;
  deleteLoading: boolean;
  content?: ReactNode[];
  onClose: (value: boolean) => void;
}

export interface VoidReasonModalProps {
  title: string;
  isOpen: boolean;
  description?: string;
  onCancel: () => void;
  onConfirm: ({reason}: {reason: string}) => void;
  confirmLoading: boolean;
}

export interface ErrorModalProps {
  title: string;
  onConfirm: () => void;
  isOpen: boolean;
  label?: string;
  content: ReactNode[];
  onClose: (value: boolean) => void;
}

export interface InformModalProps {
  title: string;
  onConfirm: () => void;
  isOpen: boolean;
  label?: string;
  content: ReactNode[];
  onClose: (value: boolean) => void;
}

export interface DialogCloseButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export interface SessionTimeoutModalProps {
  isOpen: boolean;
  onLogout: () => void;
  isLogoutPending?: boolean;
}

export interface MarkCompleteDialogLabels {
  title: string;
  notesLabel: string;
  notesPlaceholder: string;
  notesHelper: string;
  confirm: string;
  cancel: string;
}

export interface MarkCompleteDialogProps {
  isOpen: boolean;
  isSubmitting: boolean;
  labels: MarkCompleteDialogLabels;
  ariaLabelledBy?: string;
  onCancel: () => void;
  onConfirm: ({completionNotes}: {completionNotes: string}) => void;
}

export interface MarkCompleteButtonProps {
  buttonLabel: string;
  dialogLabels: MarkCompleteDialogLabels;
  isSubmitting: boolean;
  onConfirm: ({
    completionNotes,
    close,
  }: {
    completionNotes: string;
    close: () => void;
  }) => void;
  ariaLabelledBy?: string;
  buttonIcon?: string;
  iconOnly?: boolean;
  tooltip?: string;
}

// The shared cancel/submit pair at the foot of a form modal or form drawer.
export interface FormSurfaceActionsProps {
  formId: string;
  isLoading: boolean;
  isEditMode: boolean;
  isDirty: boolean;
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  allowPristineSubmit?: boolean;
}

// A form rendered in the right-hand drawer. Same contract as the form modal so
// a form can move between the two surfaces without changing.
export interface FormDrawerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  formId?: string;
  isLoading?: boolean;
  isEditMode?: boolean;
  isDirty: boolean;
  disableEscapeKeyDown?: boolean;
  submitLabel?: string;

  // Quiet content at the far left of the footer, level with the actions.
  footerStartContent?: ReactNode;

  subheader?: ReactNode;

  cancelLabel?: string;
  onCancel?: () => void;

  allowPristineSubmit?: boolean;
}

// The contract shared by the two form surfaces: the centred dialog and the
// drawer. Distinct from FormModalProps<TPayload> above, which types what a
// form submits rather than how the surface is rendered.
export interface FormSurfaceProps {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  formId?: string;
  isLoading?: boolean;
  isEditMode?: boolean;
  width?: number;
  footer?: ReactNode;
  footerStartContent?: ReactNode;
  disableEscapeKeyDown?: boolean;
  disableBackdropClick?: boolean;
  isDirty: boolean;
}

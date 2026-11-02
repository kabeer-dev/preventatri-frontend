import {Dispatch, ReactNode, RefObject, SetStateAction, SVGProps} from 'react';

export interface RootLayoutProps {
  children: ReactNode;
  params: Promise<{locale: string}>;
}

// Minimal user fields returned alongside profile lookups across roles
// (nurse, caregiver, case manager, etc.).
export interface UserRef {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  isVerified?: boolean;
}

export interface ResendInvitationTarget {
  email: string;
  firstName?: string;
  lastName?: string;

  /** Never invited before, so the dialog reads "send" rather than "resend". */
  isFirstInvitation?: boolean;
}

// onSent runs once the invitation went out, after the dialog closed.
export interface UseResendInvitationFlowParams {
  onSent?: () => void;
}

export interface CancelInvitationTarget {
  userId: string;
  firstName?: string;
  lastName?: string;
}

export interface GlobalErrorProps {
  error: Error;
}

export interface NodeChildrenProps {
  children: ReactNode;
}

export interface FullWidthContainerProps {
  children: ReactNode;
  className?: string;
}

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: string | number;
  className?: string;

  // MUI slot APIs inject it; it must not reach the DOM.
  ownerState?: unknown;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  resetKey?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
}

export interface SuspenseWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export interface ReactPrefetchQueryProviderProps {
  queriesToFetch?: any[]; // Replace 'any[]' with a specific type if possible
  children: ReactNode;
}

export interface AppContextType {
  user: any;
  setUser: Dispatch<SetStateAction<any>>;
  isUserAuthenticated: boolean;
  setIsUserAuthenticated: Dispatch<SetStateAction<boolean>>;
}

export interface ScriptLoaderProps {
  src: string;
  maxRetries?: number;
  retryDelay?: number;
  strategy?: 'lazyOnload' | 'afterInteractive' | 'beforeInteractive' | 'worker';
}

export interface Option {
  label: string;
  value: string | number;
}

export interface GlobalLoaderProps {
  className?: string;
}

export interface LoaderProps {
  size?: number;
  className?: string;
}

export interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export interface MaintenanceContainerProps {
  children: React.ReactNode;
  className?: string;
  blobColor?: string;
}

export interface MaintenanceMessageProps {
  title: string;
  message: string;
  className?: string;
}

export interface ErrorCodeProps {
  code?: string;
  className?: string;
}

export interface ErrorPageAction {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: string;
  isLoading?: boolean;
}

export interface ErrorPageProps {
  code: string;
  title: string;
  message: string;

  /** Leaves the back button out when missing, e.g. on a page opened from an email. */
  backLabel?: string;
  primaryAction: ErrorPageAction;
  details?: ReactNode;
}

export interface ErrorFallbackProps {
  onReset: () => void;
}

export interface ContentNotAvailableProps {
  title?: string;
  message?: string;
  icon?: ReactNode;
  onBack?: () => void;
  showBackButton?: boolean;
  backButtonText?: string;
}

export interface LogoProps {
  className?: string;
  onDark?: boolean;
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  error: {type: string};
}

export interface ImageUploadProps {
  setIsCropModalOpen: Dispatch<SetStateAction<boolean>>;
  setImagePreview: Dispatch<SetStateAction<string>>;
  setTempImagePreview: Dispatch<SetStateAction<string | null>>;
  setCrop: Dispatch<SetStateAction<any>>;
  imagePreview: string;
  hasImage: boolean;
  name: string;
  setFile: Dispatch<SetStateAction<File | null>>;
  onRemove: () => void;
  showRemove: boolean;
  isProcessing?: boolean;
}

export interface ImageCropperProps {
  crop: any;
  handleCrop: (c: any) => void;
  imageWidth: number;
  imageHeight: number;
  imagePreview: string;
  imageRef: RefObject<HTMLImageElement | null>;
}

// The envelope every first-party endpoint responds with: the payload under
// `body`, alongside whatever metadata the endpoint adds. Both react-query
// handlers unwrap it to `{data: body, ...rest}`.
export interface ApiEnvelope {
  body?: unknown;
  [key: string]: unknown;
}

import {BaseDialog} from '@/shared/components/common/modals';
import OtpCard from '@/shared/components/pages/auth/otpVerification/otpCard';
import {OTP_MODAL_TITLE_ID} from '@/shared/constants/common';

import {useModal} from './useModal';

export const useOtpVerificationModal = () => {
  const {closeModal, isModalOpen, openModal, setIsModalOpen, toggleModal} =
    useModal();

  const OtpVerificationModal = (
    <BaseDialog
      isOpen={isModalOpen}
      onClose={closeModal}
      hideCloseButton
      width={520}
      ariaLabelledBy={OTP_MODAL_TITLE_ID}
      paperSx={{
        backgroundColor: 'transparent',
        boxShadow: 'none',
      }}
    >
      <OtpCard key='otp-verification-form' onClose={closeModal} />
    </BaseDialog>
  );

  return {
    openModal,
    closeModal,
    toggleModal,
    isModalOpen,
    setIsModalOpen,
    OtpVerificationModal,
  };
};

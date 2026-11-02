import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import {layout, radius} from '@/@core/theme/spacing';
import {ModalProps} from '@/shared/interfaces/modals';

const CustomModal = ({
  children,
  isOpen,
  onClose,
  width = layout.modalWidth,
  outlineColor,
}: ModalProps) => {
  const focusOutline = outlineColor ? `1px solid ${outlineColor}` : undefined;

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: `${radius.md}px`,
    p: 4,
    '&:focus': {outline: focusOutline},
    '&:focus-visible': {outline: focusOutline},
  };

  return (
    <Modal open={isOpen} onClose={onClose ? onClose : undefined}>
      <Box sx={style}>{children}</Box>
    </Modal>
  );
};

export default CustomModal;

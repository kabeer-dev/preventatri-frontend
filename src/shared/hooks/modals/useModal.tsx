import {useState} from 'react';

export const useModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsLoading(false);
    setIsModalOpen(false);
  };

  const toggleModal = () => {
    setIsLoading(false);
    setIsModalOpen(!isModalOpen);
  };

  return {
    openModal,
    closeModal,
    toggleModal,
    isModalOpen,
    setIsModalOpen,
    isLoading,
    setIsLoading,
  };
};

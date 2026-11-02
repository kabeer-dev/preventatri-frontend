'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import useIsDesktop from '@/shared/hooks/useIsDesktop';
import {
  CaregiverCurrentPatient,
  CaregiverRedFlagContextValue,
} from '@/shared/interfaces/caregiverRedFlag';
import {NodeChildrenProps} from '@/shared/interfaces/common';
import RedFlagDialog from '@/views/pages/caregiverRedFlag/RedFlagDialog';

const CaregiverRedFlagContext =
  createContext<CaregiverRedFlagContextValue | null>(null);

/**
 * Holds whether the red flag dialog is open, and for which patient. It sits in
 * the caregiver shell so the sidebar button, the Today row and any patient
 * screen can raise a flag without leaving the page they are on. Phones never
 * open the dialog: they navigate to the full screen instead.
 */
const CaregiverRedFlagProvider = ({children}: NodeChildrenProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [patientId, setPatientId] = useState('');

  const [currentPatient, setCurrentPatientState] =
    useState<CaregiverCurrentPatient | null>(null);

  const [preselectedPatientId, setPreselectedPatientId] = useState<
    string | null
  >(null);

  const isDesktop = useIsDesktop();

  const openRedFlag = useCallback(({patientId: id}: {patientId?: string}) => {
    setPatientId(id || '');
    setIsOpen(true);
  }, []);

  const closeRedFlag = useCallback(() => setIsOpen(false), []);

  const setCurrentPatient = useCallback(
    ({patient}: {patient: CaregiverCurrentPatient | null}) => {
      setCurrentPatientState(patient);
    },
    []
  );

  const preselectPatient = useCallback(
    ({patientId: id}: {patientId: string | null}) => {
      setPreselectedPatientId(id);
    },
    []
  );

  const value = useMemo(
    () => ({
      openRedFlag,
      closeRedFlag,
      isOpen,
      patientId,
      currentPatient,
      setCurrentPatient,
      preselectedPatientId,
      preselectPatient,
    }),
    [
      openRedFlag,
      closeRedFlag,
      isOpen,
      patientId,
      currentPatient,
      setCurrentPatient,
      preselectedPatientId,
      preselectPatient,
    ]
  );

  return (
    <CaregiverRedFlagContext.Provider value={value}>
      {children}

      {isDesktop && isOpen && (
        <RedFlagDialog patientId={patientId} onClose={closeRedFlag} />
      )}
    </CaregiverRedFlagContext.Provider>
  );
};

export const useCaregiverRedFlag = () => {
  const context = useContext(CaregiverRedFlagContext);

  if (!context) {
    throw new Error(
      'useCaregiverRedFlag must be used inside CaregiverRedFlagProvider'
    );
  }

  return context;
};

/**
 * Names the patient the current screen is about, for as long as it is
 * mounted. A red flag raised from that screen is preselected to this patient.
 *
 * Outside the caregiver shell there is no provider and nothing to tell, so
 * the shared patient page can call this whoever is reading it.
 */
export const useRegisterCurrentPatient = ({
  id,
  name,
}: {
  id: string;
  name: string;
}) => {
  const setCurrentPatient = useContext(
    CaregiverRedFlagContext
  )?.setCurrentPatient;

  useEffect(() => {
    if (!setCurrentPatient) return;

    setCurrentPatient({patient: id ? {id, name} : null});

    return () => setCurrentPatient({patient: null});
  }, [id, name, setCurrentPatient]);
};

export default CaregiverRedFlagProvider;

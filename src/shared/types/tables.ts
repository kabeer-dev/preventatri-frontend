import {
  CancelInvitationTarget,
  ResendInvitationTarget,
} from '@/shared/interfaces/common';

export type RowAction = ({id}: {id: string}) => void;

export type ResendInvitationAction = (target: ResendInvitationTarget) => void;

export type CancelInvitationAction = (target: CancelInvitationTarget) => void;

import {keyframes} from '@mui/material/styles';

export const PULSE_RING = keyframes`
  0% {
    opacity: 0.55;
    transform: scale(0.92);
  }
  100% {
    opacity: 0;
    transform: scale(1.28);
  }
`;

export const PULSE_RING_DURATION = '1.8s';

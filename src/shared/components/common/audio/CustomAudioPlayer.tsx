'use client';

import {useRef, useState} from 'react';

import Button from '@mui/material/Button';
import {alpha} from '@mui/material/styles';
import H5AudioPlayer, {RHAP_UI} from 'react-h5-audio-player';

import 'react-h5-audio-player/lib/styles.css';
import './customAudioPlayer.css';

const SPEED_OPTIONS = [1, 1.25, 1.5, 2];

interface CustomAudioPlayerProps {
  src: string;
}

const CustomAudioPlayer = ({src}: CustomAudioPlayerProps) => {
  const playerRef = useRef<H5AudioPlayer>(null);
  const [speedIndex, setSpeedIndex] = useState(0);

  const cycleSpeed = () => {
    const next = (speedIndex + 1) % SPEED_OPTIONS.length;

    setSpeedIndex(next);

    const audio = playerRef.current?.audio?.current;

    if (audio) {
      audio.playbackRate = SPEED_OPTIONS[next];
    }
  };

  const speedControl = (
    <Button
      key='speed'
      size='small'
      onClick={cycleSpeed}
      sx={{
        width: 44,
        minWidth: 44,
        px: 0.75,
        py: 0,
        fontSize: '0.65rem',
        fontWeight: 700,
        color: 'primary.main',
        border: '1px solid',
        borderColor: 'primary.main',
        borderRadius: 1,
        lineHeight: 1.6,
        ml: 'auto',
        '&:hover': {bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08)},
      }}
    >
      {SPEED_OPTIONS[speedIndex]}x
    </Button>
  );

  return (
    <div className='custom-audio-player'>
      <H5AudioPlayer
        ref={playerRef}
        src={src}
        showJumpControls={false}
        showFilledVolume
        layout='stacked'
        customControlsSection={[
          RHAP_UI.MAIN_CONTROLS,
          RHAP_UI.VOLUME_CONTROLS,
          speedControl,
        ]}
        customAdditionalControls={[]}
        customVolumeControls={[RHAP_UI.VOLUME]}
        style={{}}
      />
    </div>
  );
};

export default CustomAudioPlayer;

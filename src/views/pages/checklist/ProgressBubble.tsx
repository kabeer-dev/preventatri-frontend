'use client';

import {useCallback, useEffect, useRef, useState} from 'react';

import {Icon} from '@iconify/react';
import Box from '@mui/material/Box';
import {useTheme} from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const BUBBLE_SIZE = 56;
const STROKE_WIDTH = 4;
const RADIUS = (BUBBLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const EDGE_MARGIN = 16;

interface ProgressBubbleProps {
  completed: number;
  total: number;
}

const ProgressBubble = ({completed, total}: ProgressBubbleProps) => {
  const theme = useTheme();
  const progress = total > 0 ? completed / total : 0;
  const allComplete = completed === total;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  const progressColor = allComplete
    ? theme.palette.success.main
    : theme.palette.primary.main;
  const trackColor = theme.palette.divider;

  const bubbleRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartPos = useRef({x: 0, y: 0});
  const bubbleStartPos = useRef({x: 0, y: 0});
  const hasMoved = useRef(false);

  const [position, setPosition] = useState<{x: number; y: number} | null>(
    () => {
      if (typeof window === 'undefined') return null;

      return {
        x: window.innerWidth - BUBBLE_SIZE - EDGE_MARGIN,
        y: window.innerHeight - BUBBLE_SIZE - EDGE_MARGIN,
      };
    }
  );
  const [isAnimating, setIsAnimating] = useState(false);

  // Keep bubble in bounds on resize
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => {
        if (!prev) return prev;

        return {
          x: Math.min(prev.x, window.innerWidth - BUBBLE_SIZE - EDGE_MARGIN),
          y: Math.min(prev.y, window.innerHeight - BUBBLE_SIZE - EDGE_MARGIN),
        };
      });
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const animationTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const snapToEdge = useCallback(({x, y}: {x: number; y: number}) => {
    const midX = window.innerWidth / 2;

    const snapX =
      x + BUBBLE_SIZE / 2 < midX
        ? EDGE_MARGIN
        : window.innerWidth - BUBBLE_SIZE - EDGE_MARGIN;

    const clampedY = Math.max(
      EDGE_MARGIN,
      Math.min(y, window.innerHeight - BUBBLE_SIZE - EDGE_MARGIN)
    );

    setIsAnimating(true);
    setPosition({x: snapX, y: clampedY});
    clearTimeout(animationTimer.current);
    animationTimer.current = setTimeout(() => setIsAnimating(false), 300);
  }, []);

  // Clean up animation timer on unmount
  useEffect(() => {
    return () => clearTimeout(animationTimer.current);
  }, []);

  const startDrag = useCallback(
    ({clientX, clientY}: {clientX: number; clientY: number}) => {
      if (!position) return;
      isDragging.current = true;
      hasMoved.current = false;
      dragStartPos.current = {x: clientX, y: clientY};
      bubbleStartPos.current = {x: position.x, y: position.y};
    },
    [position]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      startDrag({clientX: e.clientX, clientY: e.clientY});
      e.preventDefault();
    },
    [startDrag]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      startDrag({clientX: touch.clientX, clientY: touch.clientY});
    },
    [startDrag]
  );

  useEffect(() => {
    const onMove = ({clientX, clientY}: {clientX: number; clientY: number}) => {
      if (!isDragging.current) return;
      hasMoved.current = true;
      setIsAnimating(false);
      setPosition({
        x: bubbleStartPos.current.x + (clientX - dragStartPos.current.x),
        y: bubbleStartPos.current.y + (clientY - dragStartPos.current.y),
      });
    };

    const onEnd = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      setPosition((prev) => {
        if (prev && hasMoved.current) snapToEdge({x: prev.x, y: prev.y});

        return prev;
      });
    };

    const handleMouseMove = (e: MouseEvent) =>
      onMove({clientX: e.clientX, clientY: e.clientY});

    const handleTouchMove = (e: TouchEvent) =>
      onMove({clientX: e.touches[0].clientX, clientY: e.touches[0].clientY});

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', handleTouchMove, {passive: true});
    window.addEventListener('touchend', onEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [snapToEdge]);

  if (!position) return null;

  return (
    <Box
      ref={bubbleRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      sx={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 1300,
        width: BUBBLE_SIZE,
        height: BUBBLE_SIZE,
        borderRadius: '50%',
        bgcolor: 'background.paper',
        boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab',
        userSelect: 'none',
        touchAction: 'none',
        transition: isAnimating
          ? 'left 0.3s cubic-bezier(0.25, 1, 0.5, 1), top 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
          : 'none',
      }}
    >
      <svg
        width={BUBBLE_SIZE}
        height={BUBBLE_SIZE}
        style={{position: 'absolute', top: 0, left: 0, pointerEvents: 'none'}}
      >
        <circle
          cx={BUBBLE_SIZE / 2}
          cy={BUBBLE_SIZE / 2}
          r={RADIUS}
          fill='none'
          stroke={trackColor}
          strokeWidth={STROKE_WIDTH}
        />
        <circle
          cx={BUBBLE_SIZE / 2}
          cy={BUBBLE_SIZE / 2}
          r={RADIUS}
          fill='none'
          stroke={progressColor}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap='round'
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          style={{
            transition: 'stroke-dashoffset 0.4s ease, stroke 0.3s ease',
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
          }}
        />
      </svg>
      <Typography
        variant='caption'
        sx={{
          fontWeight: 700,
          fontSize: '0.7rem',
          lineHeight: 1,
          color: allComplete ? 'success.main' : 'text.primary',
          zIndex: 1,
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        {allComplete ? (
          <Icon icon='mdi:check' fontSize='1.25rem' />
        ) : (
          <>
            {completed}/{total}
          </>
        )}
      </Typography>
    </Box>
  );
};

export default ProgressBubble;

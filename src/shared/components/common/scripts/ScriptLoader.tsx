'use client';

import {useState, useEffect} from 'react';

import Script from 'next/script';

import {ScriptLoaderProps} from '@/shared/interfaces/common';

function ScriptLoader({
  src,
  maxRetries = 3,
  retryDelay = 2000,
  strategy = 'lazyOnload',
}: ScriptLoaderProps) {
  const [retryCount, setRetryCount] = useState(0);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (retrying && retryCount < maxRetries && !scriptLoaded) {
      const timer = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        setRetrying(false);
      }, retryDelay);

      return () => clearTimeout(timer);
    }
  }, [retryCount, retrying, scriptLoaded, maxRetries, retryDelay]);

  const handleScriptLoad = () => {
    setScriptLoaded(true);
  };

  const handleScriptError = () => {
    if (retryCount < maxRetries) {
      setRetrying(true);
    }
  };

  return (
    <>
      {retryCount < maxRetries && !scriptLoaded && (
        <Script
          src={src}
          onLoad={handleScriptLoad}
          onError={handleScriptError}
          strategy={strategy}
          key={retryCount}
        />
      )}
    </>
  );
}

export default ScriptLoader;

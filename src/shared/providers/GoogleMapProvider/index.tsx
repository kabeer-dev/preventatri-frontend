// // 'use client';

// // import {useMemo, useState, useEffect} from 'react';

// // import {useJsApiLoader} from '@react-google-maps/api';

// // import {MAX_RETRIES_LIMIT} from '@/shared/constants/scripts';

// const GoogleMapProvider = () => {
//   // const [retryCount, setRetryCount] = useState(0);
//   // const libraries = useMemo<Array<'places'>>(() => ['places'], []);

//   // const {loadError} = useJsApiLoader({
//   //   id: 'google-map-script',
//   //   googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
//   //   libraries,
//   // });

//   // useEffect(() => {
//   //   if (loadError && retryCount < MAX_RETRIES_LIMIT) {
//   //     const retryTimeout = setTimeout(() => {
//   //       setRetryCount((prevCount) => prevCount + 1);
//   //     }, 3000);

//   //     return () => clearTimeout(retryTimeout);
//   //   }
//   // }, [loadError, retryCount]);

//   return null;
// };

// export default GoogleMapProvider;

import {AwsRum, type AwsRumConfig} from 'aws-rum-web';

let rumClient: AwsRum | null = null;

export const initializeRUM = () => {
  if (typeof window === 'undefined') return;

  // Prevent duplicate instances across HMR reloads in development

  const existing = (window as any).__RUM_CLIENT__;

  if (existing) {
    rumClient = existing;

    return;
  }

  try {
    const config: AwsRumConfig = {
      sessionSampleRate: 1,
      identityPoolId: process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID,
      endpoint: process.env.NEXT_PUBLIC_AWS_CLOUDWATCH_RUM_ENDPOINT,
      telemetries: ['performance', 'errors', 'http'],
      allowCookies: true,
      enableXRay: true,
      signing: true, // If you have a public resource policy and wish to send unsigned requests please set this to false
      sessionEventLimit: 0, // Remove the default 200 event cap so events are recorded for the entire session
    };

    const APPLICATION_ID: string = process.env.NEXT_PUBLIC_AWS_APPLICATION_ID!;

    const APPLICATION_VERSION: string =
      process.env.NEXT_PUBLIC_AWS_CLOUDWATCH_RUM_APP_VERSION!;

    const APPLICATION_REGION: string = process.env.NEXT_PUBLIC_AWS_REGION!;

    rumClient = new AwsRum(
      APPLICATION_ID,
      APPLICATION_VERSION,
      APPLICATION_REGION,
      config
    );

    // Persist instance on window to survive HMR reloads

    (window as any).__RUM_CLIENT__ = rumClient;
  } catch (error) {
    console.error('Failed to initialize real user monitoring:', error);
  }
};

export const getRumClient = (): AwsRum | null => {
  return rumClient;
};

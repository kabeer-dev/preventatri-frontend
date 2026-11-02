import LinkSentGeneralUI from './LinkSentGeneralUI';
import LinkSentVerifyUI from './LinkSentVerifyUI';

export default function ActionMessage({action}: {action: string}) {
  if (action === 'verify') {
    return <LinkSentVerifyUI />;
  }

  return <LinkSentGeneralUI />;
}

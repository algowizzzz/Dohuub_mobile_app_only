import React from 'react';
import ConfirmModal from './ConfirmModal';
import { useLoginPromptStore } from '../../store/loginPromptStore';
import { navigationRef } from '../../navigation/navigationRef';

/**
 * Mounted once, inside NavigationContainer. Shown whenever a guest reaches for
 * something that needs an account; "Sign In" opens the sign-in screen on top
 * of where they are, so backing out returns them to what they were browsing.
 */
export default function LoginRequiredModal() {
  const visible = useLoginPromptStore(state => state.visible);
  const message = useLoginPromptStore(state => state.message);
  const close = useLoginPromptStore(state => state.close);

  const goToSignIn = () => {
    close();
    if (navigationRef.isReady()) navigationRef.navigate('Welcome');
  };

  return (
    <ConfirmModal
      visible={visible}
      title="Sign in required"
      message={message}
      icon="lock-closed-outline"
      iconTone="primary"
      cancelLabel="Not now"
      confirmLabel="Sign In"
      onCancel={close}
      onConfirm={goToSignIn}
    />
  );
}

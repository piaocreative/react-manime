import { Auth } from '@aws-amplify/auth';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

declare var window;

export default function ({ callback }) {
  const userData = useSelector((state: any) => state.userData);
  const dispatch = useDispatch();

  async function signOut() {
    try {
      Auth.signOut().finally(() => {
        if (window['dataLayer']) {
          window['dataLayer'].push({
            event: 'signOut',
            customerId: null,
            customerEmailSHA1: null,
            customerPhoneSHA1: null,
            customerEmailSHA256: null,
            customerPhoneSHA256: null,
          });
        }
        Auth.currentAuthenticatedUser();

        dispatch({ type: 'RESET_USER_DATA' });
      });
    } catch (error) {}
    callback({ success: true });
  }

  useEffect(() => {
    // maybe sign out?
    signOut();
  }, []);

  return <div></div>;
}

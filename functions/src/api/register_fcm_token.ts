import * as functions from 'firebase-functions';
import {setFcmToken} from '../helpers/fcm_token.helpers';

export const registerFcmToken = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'must be called while authenticated.');

  const uid = context.auth.uid;
  const {token} = data;
  if (!uid || !token) throw new functions.https.HttpsError('invalid-argument', 'missing parameter');

  await setFcmToken(uid, token);
  return {status: 200};
});

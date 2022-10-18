import * as functions from 'firebase-functions';
import {getFcmToken} from '../../helpers/fcm_token.helpers';
import * as admin from 'firebase-admin';

export const onUserCreated = functions.firestore.document('users/{uid}').onCreate(async (snap, context) => {
  const token = await getFcmToken(context.params.uid);
  if (!token) return;

  const payload = {
    notification: {
      title: '登録が完了しました',
      body: 'プロフィールの設置をしましょう。',
      sound: 'default',
    },
  };
  const options = {
    priority: 'high',
  };
  try {
    await admin.messaging().sendToDevice(token, payload, options);
  } catch (error) {
    console.error(error);
  }
});

import * as admin from 'firebase-admin';

export const getFcmToken = async (uid: string): Promise<string> => {
  const ref = admin.firestore().collection('fcm_token').doc(uid);
  const snapshot = await ref.get();
  const data = await snapshot.data();
  return data?.token ?? '';
};

export const setFcmToken = async (uid: string, token: string) => {
  const ref = admin.firestore().collection('fcm_token').doc(uid);
  return ref.set({'token': token});
};

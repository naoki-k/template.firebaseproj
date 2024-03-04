import * as admin from 'firebase-admin';

export const sendSystemMail = async (subject: string, message: string, toUids: Array<string>) => {
  const newMail = {
    toUids: toUids,
    template: {
      name: 'buzma-noreply-system-mail',
      data: {
        subject: subject,
        message: message,
      },
    },
  };

  const db = admin.firestore();
  try {
    await db.collection('system_mails').add(newMail);
  } catch (error) {
    console.error('Error adding document: ', error);
  }
};

export const sendSystemMailIfNeeded = async (chat: admin.firestore.DocumentData) => {
  const db = admin.firestore();
  const toInfluencer = chat.user_a != chat.last_message_sent_by;
  const toRef = toInfluencer ? chat.user_b : chat.user_a;
  const fromRef = toInfluencer ? chat.user_a : chat.user_b;
  const toDoc = await db.doc(toRef).get();
  const fromDoc = await db.doc(fromRef).get();
  if (toDoc.data()?.allowChatMailNotification != 'true') {
    return;
  }

  const fromName = (toInfluencer ? chat.spot_name ?? fromDoc.data()?.username : fromDoc.data()?.username) ?? 'ユーザー';
  const subject = fromName + 'さんからメッセージが届きました';
  await sendSystemMail(subject, subject, [toRef.id]);
};

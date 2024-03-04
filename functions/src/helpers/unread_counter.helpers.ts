import * as admin from 'firebase-admin';

export const countChats = async (userReference: admin.firestore.DocumentReference): Promise<number> => {
  try {
    const db = admin.firestore();
    const snapshot = await db.collection('chats').get();
    return snapshot.docs
        .map((doc) => doc.data())
        .filter((chat) =>
          chat.last_message_seen_by.length > 0 &&
          !chat.last_message_seen_by.includes(userReference)
        ).length;
  } catch (error) {
    return 0;
  }
};

export const updateMessageNotificationCount = async (userReference: admin.firestore.DocumentReference) => {
  const db = admin.firestore();
  const notificationsRef = db.collection(`users/${userReference.id}/notifications`);
  const snapshot = await notificationsRef.limit(1).get();

  if (!snapshot.empty) {
    await snapshot.docs[0].ref.update({message: await countChats(userReference)});
  } else {
    await notificationsRef.add({
      invitation: 0,
      message: await countChats(userReference),
    });
  }
};

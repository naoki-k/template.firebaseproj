import * as functions from 'firebase-functions';
import {getFcmToken} from '../../helpers/fcm_token.helpers';
import * as admin from 'firebase-admin';
import {sendSystemMailIfNeeded} from "../../helpers/send_system_mail.helpers";
import {updateMessageNotificationCount} from "../../helpers/unread_counter.helpers";

export const onChatCreated = functions.firestore.document('chats/{documentID}').onUpdate(async (change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();

    const hasNewMessage = beforeData.last_message_time != afterData.last_message_time;
    if (hasNewMessage) {
        await sendSystemMailIfNeeded(afterData);
    }

    for (const user of afterData.users) {
        await updateMessageNotificationCount(user);
    }
});

import * as admin from 'firebase-admin';
import {onChatCreated} from './callback/firestore/on_chat_created';

admin.initializeApp();

export const OnChatCreated = onChatCreated;

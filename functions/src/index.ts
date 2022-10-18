import * as admin from 'firebase-admin';
import {registerFcmToken} from './api/register_fcm_token';
import {onUserCreated} from './callback/firestore/on_user_created';

admin.initializeApp();

export const RegisterFcmToken = registerFcmToken;
export const OnUserCreated = onUserCreated;

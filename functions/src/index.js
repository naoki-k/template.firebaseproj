"use strict";
exports.__esModule = true;
exports.OnUserCreated = exports.RegisterFcmToken = void 0;
var admin = require("firebase-admin");
var register_fcm_token_1 = require("./api/register_fcm_token");
var on_user_created_1 = require("./callback/firestore/on_user_created");
admin.initializeApp();
exports.RegisterFcmToken = register_fcm_token_1.registerFcmToken;
exports.OnUserCreated = on_user_created_1.onUserCreated;

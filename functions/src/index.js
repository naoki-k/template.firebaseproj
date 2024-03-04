"use strict";
exports.__esModule = true;
exports.OnChatCreated = void 0;
var admin = require("firebase-admin");
var on_chat_created_1 = require("./callback/firestore/on_chat_created");
admin.initializeApp();
exports.OnChatCreated = on_chat_created_1.onChatCreated;

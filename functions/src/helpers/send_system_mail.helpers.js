"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.sendSystemMailIfNeeded = exports.sendSystemMail = void 0;
var admin = require("firebase-admin");
var sendSystemMail = function (subject, message, toUids) { return __awaiter(void 0, void 0, void 0, function () {
    var newMail, db, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                newMail = {
                    toUids: toUids,
                    template: {
                        name: 'buzma-noreply-system-mail',
                        data: {
                            subject: subject,
                            message: message
                        }
                    }
                };
                db = admin.firestore();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db.collection('system_mails').add(newMail)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error('Error adding document: ', error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.sendSystemMail = sendSystemMail;
var sendSystemMailIfNeeded = function (chat) { return __awaiter(void 0, void 0, void 0, function () {
    var db, toInfluencer, toRef, fromRef, toDoc, fromDoc, fromName, subject;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                db = admin.firestore();
                toInfluencer = chat.user_a != chat.last_message_sent_by;
                toRef = toInfluencer ? chat.user_b : chat.user_a;
                fromRef = toInfluencer ? chat.user_a : chat.user_b;
                return [4 /*yield*/, db.doc(toRef).get()];
            case 1:
                toDoc = _f.sent();
                return [4 /*yield*/, db.doc(fromRef).get()];
            case 2:
                fromDoc = _f.sent();
                if (((_a = toDoc.data()) === null || _a === void 0 ? void 0 : _a.allowChatMailNotification) != 'true') {
                    return [2 /*return*/];
                }
                fromName = (_e = (toInfluencer ? (_b = chat.spot_name) !== null && _b !== void 0 ? _b : (_c = fromDoc.data()) === null || _c === void 0 ? void 0 : _c.username : (_d = fromDoc.data()) === null || _d === void 0 ? void 0 : _d.username)) !== null && _e !== void 0 ? _e : 'ユーザー';
                subject = fromName + 'さんからメッセージが届きました';
                return [4 /*yield*/, (0, exports.sendSystemMail)(subject, subject, [toRef.id])];
            case 3:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.sendSystemMailIfNeeded = sendSystemMailIfNeeded;

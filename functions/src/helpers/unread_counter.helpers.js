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
exports.updateMessageNotificationCount = exports.countChats = void 0;
var admin = require("firebase-admin");
var countChats = function (userReference) { return __awaiter(void 0, void 0, void 0, function () {
    var db, snapshot, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                db = admin.firestore();
                return [4 /*yield*/, db.collection('chats').get()];
            case 1:
                snapshot = _a.sent();
                return [2 /*return*/, snapshot.docs
                        .map(function (doc) { return doc.data(); })
                        .filter(function (chat) {
                        return chat.last_message_seen_by.length > 0 &&
                            !chat.last_message_seen_by.includes(userReference);
                    }).length];
            case 2:
                error_1 = _a.sent();
                return [2 /*return*/, 0];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.countChats = countChats;
var updateMessageNotificationCount = function (userReference) { return __awaiter(void 0, void 0, void 0, function () {
    var db, notificationsRef, snapshot, _a, _b, _c, _d;
    var _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                db = admin.firestore();
                notificationsRef = db.collection("users/".concat(userReference.id, "/notifications"));
                return [4 /*yield*/, notificationsRef.limit(1).get()];
            case 1:
                snapshot = _g.sent();
                if (!!snapshot.empty) return [3 /*break*/, 4];
                _b = (_a = snapshot.docs[0].ref).update;
                _e = {};
                return [4 /*yield*/, (0, exports.countChats)(userReference)];
            case 2: return [4 /*yield*/, _b.apply(_a, [(_e.message = _g.sent(), _e)])];
            case 3:
                _g.sent();
                return [3 /*break*/, 7];
            case 4:
                _d = (_c = notificationsRef).add;
                _f = {
                    invitation: 0
                };
                return [4 /*yield*/, (0, exports.countChats)(userReference)];
            case 5: return [4 /*yield*/, _d.apply(_c, [(_f.message = _g.sent(),
                        _f)])];
            case 6:
                _g.sent();
                _g.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.updateMessageNotificationCount = updateMessageNotificationCount;

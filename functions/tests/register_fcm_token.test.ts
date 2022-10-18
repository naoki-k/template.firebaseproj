import * as admin from 'firebase-admin';
import * as test from 'firebase-functions-test';
import {FeaturesList} from "firebase-functions-test/lib/features";
import {registerFcmToken} from "../src/api/register_fcm_token";
import { v4 } from 'uuid';
import * as assert from "assert";

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

let future: FeaturesList

beforeAll(async () => {
  admin.initializeApp()
  future = test({projectId: `${process.env.PROJECT_ID}`})
})

afterAll(async () => {
  await future.cleanup()
})

describe('on_user_created', () => {
  it('success', async () => {
    const id = v4()
    const subject = future.wrap(registerFcmToken)
    const data = {token: v4()}
    const context = {auth: {uid: id}}
    const result = await subject(data, context);
    expect(result.status).toEqual(200);
    const ref = await admin.firestore().collection('fcm_token').doc(id).get();
    expect(ref.exists).toEqual(true);
  })

  it('fails: unauthenticated', async () => {
    const id = v4()
    const subject = future.wrap(registerFcmToken)
    const data = {token: v4()}
    const context = {}
    await expect(subject(data, context)).rejects.toThrow();
    const ref = await admin.firestore().collection('fcm_token').doc(id).get();
    expect(ref.exists).toEqual(false);
  })
})

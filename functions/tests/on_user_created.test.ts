import * as admin from 'firebase-admin';
import * as test from 'firebase-functions-test';
import {onUserCreated} from "../src/callback/firestore/on_user_created";
import {readFileSync} from "fs";
import {FeaturesList} from "firebase-functions-test/lib/features";
import { v4 } from 'uuid'
import * as sinon from 'sinon'

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

let future: FeaturesList
let adminMessageSend: sinon.SinonStub<[admin.messaging.Message, (boolean | undefined)?]>

beforeAll(async () => {
  admin.initializeApp()
  future = test({projectId: `${process.env.PROJECT_ID}`})
})

afterAll(async () => {
  await future.cleanup()
})

beforeEach(async () => {
  adminMessageSend = sinon.stub(admin.messaging(), "send")
})

afterEach(async () => {
  await adminMessageSend.restore()
})

describe('on_user_created', () => {
  it('success', async () => {
    const id = v4();
    await admin.firestore().collection('users').doc('id').set({
      uid: id,
      name: 'test',
    })
    await setTimeout(() => {
      expect(adminMessageSend.callCount).toEqual(1)
    }, 100);
  })
})

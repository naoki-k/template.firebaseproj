import { readFileSync } from 'fs'
import * as firestore from '@firebase/rules-unit-testing'
import { v4 } from 'uuid'
import firebase from 'firebase/compat/app'

const serverTimestamp = () => firebase.firestore.Timestamp.now()
let env: firestore.RulesTestEnvironment

beforeAll(async () => {
  env = await firestore.initializeTestEnvironment({
    projectId: v4(),
    firestore: {
      rules: readFileSync('./firestore.generate.rules', 'utf-8')
    }
  })
})

beforeEach(async () => {
  await env.clearFirestore()
})

afterAll(async () => {
  await env.cleanup()
})

describe('', () => {
  describe('write', () => {
    it('success', async () => {
      const id = v4()
      const context = env.authenticatedContext(id)
      const db = context.firestore()
      await firestore.assertSucceeds(
        db.collection('users').doc(id).set({
          uid: id,
          name: 'test',
        })
      )
    })

    it('invalid: extra params', async () => {
      const id = v4()
      const context = env.authenticatedContext(id)
      const db = context.firestore()
      await firestore.assertFails(
        db.collection('users').doc(id).set({
          uid: id,
          name: 'test',
          nickname: 'tester',
        })
      )
    })
  })
});

import { readFileSync } from 'fs'
import * as test from '@firebase/rules-unit-testing'
import { v4 } from 'uuid'

let env: test.RulesTestEnvironment

beforeAll(async () => {
  env = await test.initializeTestEnvironment({
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

describe('users', () => {
  describe('write', () => {
    it('success', async () => {
      const id = v4()
      const context = env.authenticatedContext(id)
      const db = context.firestore()
      await test.assertSucceeds(
        db.collection('users').doc(id).set({
          uid: id,
          name: 'test',
        })
      )
    })

    it('fails: extra params', async () => {
      const id = v4()
      const context = env.authenticatedContext(id)
      const db = context.firestore()
      await test.assertFails(
        db.collection('users').doc(id).set({
          uid: id,
          name: 'test',
          nickname: 'tester',
        })
      )
    })

    it('fails: not matches request uid', async () => {
      const id = v4()
      const anotherId = v4()
      const context = env.authenticatedContext(id)
      const db = context.firestore()
      await test.assertFails(
        db.collection('users').doc(anotherId).set({
          uid: id,
          name: 'test',
          nickname: 'tester',
        })
      )
    })
  })
});

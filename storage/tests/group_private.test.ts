import { readFileSync } from 'fs'
import * as test from '@firebase/rules-unit-testing'
import { v4 } from 'uuid'

let env: test.RulesTestEnvironment

beforeAll(async () => {
  env = await test.initializeTestEnvironment({
    projectId: v4(),
    storage: {
      rules: readFileSync('./storage.generate.rules', 'utf-8')
    }
  })
})

beforeEach(async () => {
  await env.clearStorage()
})

afterAll(async () => {
  await env.cleanup()
})

describe('group_activity', () => {
  describe('write', () => {
    it('success', async () => {
      const tag = v4()
      const id = v4()
      const claim = {}
      claim['member'] = tag

      const context = env.authenticatedContext(id, claim)
      const storage = context.storage()
      await test.assertSucceeds(
        storage.ref(`groups/${tag}/private/image.png`).put(
          readFileSync('./tests/files/sample_1mb.png'),
          { contentType: 'image/png' }
        ).then()
      )
    })

    it('fails', async () => {
      const tag = v4()
      const id = v4()
      const claim = {}

      const context = env.authenticatedContext(id, claim)
      const storage = context.storage()
      await test.assertFails(
        storage.ref(`groups/${tag}/private/image.png`).put(
          readFileSync('./tests/files/sample_1mb.png'),
          { contentType: 'image/png' }
        ).then()
      )
    })
  })

  describe('read', () => {
    it('success', async () => {
      const tag = v4()
      const id = v4()
      const claim = {}
      claim['member'] = tag

      await env.withSecurityRulesDisabled(async context => {
        await context.storage().ref(`groups/${tag}/private/image.png`).put(
          readFileSync('./tests/files/sample_5mb.png'),
          { contentType: 'image/jpg' }
        ).then()
      })

      const context = env.authenticatedContext(id, claim)
      await test.assertSucceeds(
        context.storage().ref(`groups/${tag}/private/image.png`).getDownloadURL()
      )
    })

    it('fails: without uid', async () => {
      const tag = v4()
      const id = v4()
      const claim = {}

      await env.withSecurityRulesDisabled(async context => {
        await context.storage().ref(`groups/${tag}/private/image.png`).put(
          readFileSync('./tests/files/sample_5mb.png'),
          { contentType: 'image/jpg' }
        ).then()
      })

      const context = env.authenticatedContext(id, claim)
      await test.assertFails(
        context.storage().ref(`groups/${tag}/private/image.png`).getDownloadURL()
      )
    })
  })
});

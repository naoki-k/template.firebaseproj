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

describe('user_profile', () => {
  describe('write', () => {
    it('success', async () => {
      const id = v4()
      const context = env.authenticatedContext(id)
      const storage = context.storage()
      await test.assertSucceeds(
        storage.ref(`users/${id}/profile/profile.png`).put(
          readFileSync('./tests/files/sample_1mb.png'),
          { contentType: 'image/png' }
        ).then()
      )
    })

    it('fails: file size over 1.5mb', async () => {
      const id = v4()
      const context = env.authenticatedContext(id)
      const storage = context.storage()
      await test.assertFails(
        storage.ref(`users/${id}/profile/profile.png`).put(
          readFileSync('./tests/files/sample_5mb.png'),
          { contentType: 'image/png' }
        ).then()
      )
    })

    it('fails: contentType is not png', async () => {
      const id = v4()
      const context = env.authenticatedContext(id)
      const storage = context.storage()
      await test.assertFails(
        storage.ref(`users/${id}/profile/profile.png`).put(
          readFileSync('./tests/files/sample_5mb.png'),
          { contentType: 'image/jpg' }
        ).then()
      )
    })

    it('fails: not matches request uid', async () => {
      const id = v4()
      const anotherId = v4()
      const context = env.authenticatedContext(id)
      const storage = context.storage()
      await test.assertFails(
        storage.ref(`users/${anotherId}/profile/profile.png`).put(
          readFileSync('./tests/files/sample_5mb.png'),
          { contentType: 'image/jpg' }
        ).then()
      )
    })
  })

  describe('read', () => {
    it('success: has uid', async () => {
      const id = v4()
      await env.withSecurityRulesDisabled(async context => {
        await context.storage().ref(`users/${id}/profile/profile.png`).put(
          readFileSync('./tests/files/sample_5mb.png'),
          { contentType: 'image/jpg' }
        ).then()
      })

      const context = env.authenticatedContext(v4())
      await test.assertSucceeds(
        context.storage().ref(`users/${id}/profile/profile.png`).getDownloadURL()
      )
    })

    it('fails: without uid', async () => {
      const id = v4()
      await env.withSecurityRulesDisabled(async context => {
        await context.storage().ref(`users/${id}/profile/profile.png`).put(
          readFileSync('./tests/files/sample_5mb.png'),
          { contentType: 'image/jpg' }
        ).then()
      })

      const context = env.unauthenticatedContext()
      await test.assertFails(
        context.storage().ref(`users/${id}/profile/profile.png`).getDownloadURL()
      )
    })
  })
});

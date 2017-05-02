/* eslint-env mocha */

// The module imported using import statement
import redis2 from '../'

// The module imported using require statement
const redis = require('../')

const Redis = require('ioredis')
const assert = require('assert')

if (process.env.REDIS_CLUSTER_NODES) {
  console.log('we have a cluster!')
}

describe('ok', () => {
  describe('redis', () => {
    it('is instanceof', () => {
      if (process.env.REDIS_CLUSTER_NODES) {
        assert.ok(redis instanceof Redis.Cluster)
      } else {
        assert.ok(redis instanceof Redis)
      }
    })

    it('functions', () => {
      assert.ok(typeof redis.setAsync === 'function')
      assert.ok(typeof redis.getAsync === 'function')
    })

    it('sets and gets', async () => {
      await redis2.delAsync('test:ok')
      await redis.set('test:ok', 'yes')
      assert.deepEqual(await redis.getAsync('test:ok'), 'yes')
    })
  })

  describe('redis2', () => {
    it('is instanceof', () => {
      if (process.env.REDIS_CLUSTER_NODES) {
        assert.ok(redis2 instanceof Redis.Cluster)
      } else {
        assert.ok(redis2 instanceof Redis)
      }
    })

    it('functions', () => {
      assert.ok(typeof redis2.setAsync === 'function')
      assert.ok(typeof redis2.getAsync === 'function')
    })

    it('sets and gets', async () => {
      await redis2.delAsync('test:ok')
      await redis2.set('test:ok', 'yes')
      assert.deepEqual(await redis2.getAsync('test:ok'), 'yes')
    })
  })
})

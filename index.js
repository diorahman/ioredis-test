// Modules
const Redis = require('ioredis')

// NOTE: involved env vars:
// 1. REDIS_CLUSTER_NODES e.g. 127.0.0.1:30001,127.0.0.1:30002
// 2. REDIS_CLUSTER_SCALE_READS e.g. 'slave'
// 3. REDIS_PORT e.g. 6379
// 4. REDIS_HOST e.g. 127.0.0.1
//
// if `REDIS_CLUSTER_NODES` empty or parsed as `[]`
// we will consider to create a simple redis client
// based on `REDIS_HOST` and `REDIS_PORT`.

const nodes = configs()

// FIXME: extend it to accomodate sentinel
const client = nodes.length > 0
    ? new Redis.Cluster(nodes, options())
    // It is sad that we don't have cluster.
    : new Redis({
      port: process.env.REDIS_PORT || 6379,
      host: process.env.REDIS_HOST || 'localhost'
    })

for (let key in client) {
  if (typeof client[key] === 'function') {
        // FIXME: whitelist all required suffix-ed methods
    client[key + 'Async'] = function () {
      return client[key](...arguments)
    }
  }
}

function options () {
  return {
        // This one is based on luin/ioredis README
        // we might want to revisit this.
    clusterRetryStrategy: function (times) {
      let delay = Math.min(100 + times * 2, 2000)
      return delay
    },
        // Defaults to slave seems sensible.
    scaleReads: process.env.REDIS_CLUSTER_SCALE_READS || 'slave'
  }
}

function configs () {
  let addresses = (process.env.REDIS_CLUSTER_NODES || '').split(',')
  return addresses.map((address) => {
    let config = address.split(':')
    let port = config.pop()
    let host = config.pop()
    if (!port || !host) {
      return null
    }
    return {
      port,
      host
    }
  }).filter((item) => {
    return item
  })
}

module.exports = client

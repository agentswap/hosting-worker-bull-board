import { createBullBoard } from '@bull-board/api'
import { BullAdapter } from '@bull-board/api/dist/src/queueAdapters/bull.js'
import { FastifyAdapter } from '@bull-board/fastify'
import Queue from 'bull'
import type { FastifyInstance } from 'fastify'

import { environment } from './env/index.ts'

const createQueue = (name: string) => {
  const port = environment.REDIS_PORT
  const host = environment.REDIS_HOST
  const password = environment.REDIS_PASS
  return new Queue(name, { redis: { port, host, password } })
}

async function routes(fastify: FastifyInstance) {
  const bullQueueList = ['test'] // TODO: get list from env
  const queues = bullQueueList.map((q) => {
    const queue = createQueue(q)
    return new BullAdapter(queue)
  })

  const serverAdapter = new FastifyAdapter()

  createBullBoard({
    queues,
    serverAdapter,
  })

  serverAdapter.setBasePath('/monitor/bull')

  fastify.register(serverAdapter.registerPlugin(), {
    basePath: '/monitor/bull',
    prefix: '/monitor/bull',
  })
}

export default routes

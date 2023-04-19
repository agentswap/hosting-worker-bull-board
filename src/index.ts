import Fastify from 'fastify'

import bullBoard from './bull-board.ts'
import { environment } from './env/index.ts'

const app = Fastify({ logger: true })

const run = async () => {
  app.register(bullBoard)

  const port = environment.PORT
  await app.listen({ port })
}

run()

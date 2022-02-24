/* eslint-disable import/no-named-as-default */
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { FastifyAdapter } from '@bull-board/fastify';
import Queue from 'bull';
import fp from 'fastify-plugin';

import { config } from '../configs';

export default fp(async (fastify) => {
  const port = config.get<number>('redis.port', 6379);
  const host = config.get<string>('redis.host', 'localhost');
  const createQueue = (name: string) =>
    new Queue(name, { redis: { port, host } });
  const bullQueueList = config.get<string[]>('bull.queue.name', []);
  const queues = bullQueueList.map((q) => {
    const queue = createQueue(q);
    return new BullAdapter(queue);
  });

  const serverAdapter = new FastifyAdapter();

  createBullBoard({
    queues: queues,
    serverAdapter,
  });

  serverAdapter.setBasePath('/monitor/bull');

  fastify.register(serverAdapter.registerPlugin(), {
    basePath: '/monitor/bull',
    prefix: '/monitor/bull',
  });
});

import Fastify from 'fastify';

const server = Fastify();

server.get('/', async () => ({ message: 'soroban-devkit express example' }));

server.listen({ port: 3000 }).then(() => console.log('Server started on 3000'));

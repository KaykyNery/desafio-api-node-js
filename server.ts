// const fastify = require('fastify');
// const { randomUUID } = require('crypto');

import fastify from 'fastify'
import crypto from 'crypto'

const server = fastify({
    logger: {
        transport: {
        target: 'pino-pretty',
        options: {
          colorize: true
        }
      }
    }
});

server.addContentTypeParser('application/json', { parseAs: 'string' }, (req, body, done) => {
    try {
        const json = JSON.parse(body as string);
        done(null, json);
    } catch (err) {
        done(err as Error, undefined);
    }
});

const courses = [
    { id: '1', name: 'Node.js' },
    { id: '2', name: 'React' },
    { id: '3', name: 'MongoDB' },
];

server.get('/courses', () => {
    return { courses };
});

server.get('/courses/:id', (request, reply) => {
    type Params = {
        id: string
    }
    const params = request.params as Params;
    const courseId = params.id;
    const course = courses.find(course => course.id === courseId);
    
    if (course) {
        return { course };
    } else {
        return reply.status(404).send({ error: 'Course not found' });
    }
});

server.post('/courses', async (request, reply) => {
    type Body = {
        title: string
    }
    const body = request.body as Body;
    const courseTitle = body.title;
    const courseID = crypto.randomUUID();

    if (!courseTitle) {
        return reply.status(400).send({ error: 'Title is required' });
    }

    const newCourse = { id: courseID, name: courseTitle };
    courses.push(newCourse);

    return reply.status(201).send(newCourse);
});

server.listen({ port: 3333 }).then(() => {
    console.log('Server is running on port 3333')
});

import Fastify from "fastify"
import cors from '@fastify/cors'
import ShortUniqueId from 'short-unique-id'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    log: ['query'],
})

async function bootstrap() {
    const fastify = Fastify({
        logger: true,
    })

    await fastify.register(cors, {
        origin: true
    })

    fastify.get('/pools/count', async () => {
        const poolCount = await prisma.pool.count()
        
        return { count: poolCount }
    })

    fastify.get('/users/count', async () => {
        const userCount = await prisma.user.count()
        
        return { count: userCount }
    })

    fastify.get('/guesses/count', async () => {
        const guessesCount = await prisma.guess.count()
        
        return { count: guessesCount }
    })

    fastify.post('/pools', async (request, reply) => {
        const createPoolBody = z.object({
            title: z.string(),
        })

        const { title } = createPoolBody.parse(request.body)

        const generateCode = new ShortUniqueId({ length: 6 })
        const code = String(generateCode()).toUpperCase()

        await prisma.pool.create({
            data: {
                title,
                code,
            }
        })
        
        return reply.status(201).send({ code })
    })

    await fastify.listen({ port: 3333, host: '0.0.0.0' })
}

bootstrap()
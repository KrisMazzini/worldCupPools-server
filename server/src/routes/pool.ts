import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from 'zod'
import ShortUniqueId from 'short-unique-id'


export async function poolRoutes(fastify: FastifyInstance) {
    fastify.get('/pools/count', async () => {
        const poolCount = await prisma.pool.count()
        
        return { count: poolCount }
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
}
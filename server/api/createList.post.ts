import pkg from '@prisma/client';
import { checkPassword, generateJWT } from '../utils/authUtils.js';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    if (!event.context.uid) {
        event.res.statusCode = 401;
        return {
            error: 'Unauthorized',
        }
    }
    const body = await useBody(event);
    if (!body.name) {
        event.res.statusCode = 400;
        return {
            error: 'Missing name',
        }
    }

    const user = await prisma.user.findUnique({
        where: {
            id: event.context.uid,
        },
    });

    if (!user) {
        await prisma.$disconnect();
        event.res.statusCode = 400;
        return {
            error: 'User not found',
        }
    }


    const list = await prisma.list.create({
        data: {
            name: body.name,
            users: {
                connect: {
                    id: user.id,
                },
            },
        },
    });

    await prisma.$disconnect();


    return {
        listId: list.id,
    }
})
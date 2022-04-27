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
    if (!body.listId) {
        event.res.statusCode = 400;
        return {
            error: 'Missing id',
        }
    }

    const user = await prisma.user.findUnique({
        where: {
            id: event.context.uid,
        },
    });

    if (!user) {
        event.res.statusCode = 400;
        return {
            error: 'User not found',
        }
    }


    const list = await prisma.list.findUnique({
        where: {
            id: body.listId,
        },
        include: {
            users: true,
            items: true,
        }
    });

    await prisma.$disconnect();

    if (!list || !list.users.some(u => u.id === user.id)) {
        event.res.statusCode = 404;
        return {
            error: 'List not found',
        }
    }

    return {
        id: list.id,
        name: list.name,
        items: list.items,
        users: list.users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
        })),
        updatedAt: list.updatedAt,
    }
})
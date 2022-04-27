import pkg from '@prisma/client';
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
    if (!body.item || !body.listId) {
        event.res.statusCode = 400;
        return {
            error: 'Missing item or list id',
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

    if (!list || !list.users.some(u => u.id === user.id)) {
        await prisma.$disconnect();
        event.res.statusCode = 404;
        return {
            error: 'List not found',
        }
    }

    if (list.items.some(i => i.name.toLowerCase() === body.item.toLowerCase())) {
        await prisma.$disconnect();
        event.res.statusCode = 400;
        return {
            error: 'Item already exists',
        }
    }

    const item = await prisma.item.create({
        data: {
            name: body.item,
            list: {
                connect: {
                    id: list.id,
                },
            },
            addedBy: {
                connect: {
                    id: user.id,
                }
            }
        },
    });

    await prisma.$disconnect();

    return {
        listId: list.id,
    }
})
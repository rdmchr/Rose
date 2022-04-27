import pkg from '@prisma/client';
import { checkPassword, generateJWT } from '../utils/authUtils.js';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await useBody(event);
    if (!body.email || !body.password) {
        return {
            error: 'Invalid credentials.'
        }
    }
    const { email, password } = body;
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    await prisma.$disconnect();

    if (!user) {
        return {
            error: 'Invalid credentials.'
        }
    }

    const isValid = await checkPassword(password, user.password);
    if (!isValid) {
        return {
            error: 'Invalid credentials.'
        }
    }

    return {
        token: generateJWT(user),
    }
})
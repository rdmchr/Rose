import pkg from '@prisma/client';
import { generateJWT, hashPassword } from '../utils/authUtils.js';
import { sendVerifyEmail } from '../utils/mailUtils.js';
import crypto from 'crypto';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await useBody(event);
    if (!body.email || !body.password || !body.name) {
        return {
            error: 'Invalid credentials.'
        }
    }
    const { email, password, name } = body;
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (user) {
        return {
            error: 'User already exists.'
        }
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    });
    await prisma.$disconnect();

    const verifyToken = crypto.randomUUID();
    const verifyEmail = await prisma.verifyEmail.create({
        data: {
            user: {
                connect: {
                    id: newUser.id
                }
            },
            token: verifyToken
        }
    });
    const verifyLink = `${process.env.BASE_URL}/verify?token=${verifyToken}&uid=${newUser.id}`;
    await sendVerifyEmail(newUser.email, verifyLink);

    return {
        token: generateJWT(newUser)
    }
})
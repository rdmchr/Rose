import pkg from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import { validateJWT } from '../utils/authUtils.js';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    let uid = null;
    if (event.req.headers.authorization) {
        const token = event.req.headers.authorization;
        const payload = validateJWT(token) as JwtPayload;
        if (payload.uid) {
            uid = payload.uid;
        }
    }
    event.context.uid = uid;
})
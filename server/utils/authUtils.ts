import { User } from '.prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * hashes a password
 * @param pass the clear text password
 */
export async function hashPassword(pass: string) {
    return bcrypt.hash(pass, 10);
}

/**
 * checks if the password is correct
 * @param pass the clear text password
 * @param hash the hashed password
 */
export async function checkPassword(pass: string, hash: string) {
    return bcrypt.compare(pass, hash);
}

/**
 * generates a JWT token
 * @param user the user to generate a token for
 */
export function generateJWT(user: User) {
    return jwt.sign({
        uid: user.id,
    }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
}

/**
 * validates a JWT
 * @param token the JWT token
 */
export function validateJWT(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET, {ignoreExpiration: false});
}
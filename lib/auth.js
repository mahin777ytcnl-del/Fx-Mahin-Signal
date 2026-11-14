import crypto from 'crypto';
export const token = () => crypto.createHash('sha256').update(`${process.env.ADMIN_USER}:${process.env.ADMIN_PASS}:${process.env.AUTH_SECRET}`).digest('hex');

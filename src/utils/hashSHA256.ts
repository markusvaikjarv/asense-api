import { createHash } from 'node:crypto';

export const hashSHA256 = (data: string): string => createHash('sha256').update(data).digest('hex');

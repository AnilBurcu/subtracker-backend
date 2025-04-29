import { config } from 'dotenv';

const env = process.env.NODE_ENV || 'development';
config({ path: `.env.${env}.local` });

export const { PORT } = process.env;
import { config } from 'dotenv';
// Load environment variables from .env.local first, which will contain secrets
config({ path: '.env.local' });
// Then, load the default .env file, which may contain non-sensitive defaults
config({ path: '.env' });

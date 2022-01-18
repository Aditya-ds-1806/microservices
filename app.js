import dotenv from 'dotenv';
import ContentService from './services/ContentService.js';
import UserInteractionService from './services/UserInteractionService.js';
import UserService from './services/UserService.js';

dotenv.config();

const { PORT_1, PORT_2, PORT_3 } = process.env;

new ContentService(PORT_1).register();
new UserInteractionService(PORT_2).register();
new UserService(PORT_3).register();

import ContentService from './services/ContentService.js';
import UserInteractionService from './services/UserInteractionService.js';
import UserService from './services/UserService.js';

new ContentService(3000).register();
new UserInteractionService(3001).register();
new UserService(3002).register();

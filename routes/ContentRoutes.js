import { Router } from 'express';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';
import ContentMiddleware from '../middleware/Content.js';
import ContentControllers from '../controllers/ContentControllers.js';

dotenv.config({ path: 'routes/.env' });

const ContentRouter = new Router();
const { existsUser, existsContent } = ContentMiddleware;
const {
    listAllContent, readContent, createContent, updateContent, deleteContent, bulkInsert,
} = ContentControllers;

ContentRouter.put('/content', fileUpload(), bulkInsert);
ContentRouter.get('/content', listAllContent);
ContentRouter.post('/content', existsUser, createContent);
ContentRouter.get('/content/:contentId', existsContent, readContent);
ContentRouter.put('/content/:contentId', existsContent, updateContent);
ContentRouter.delete('/content/:contentId', existsContent, deleteContent);

export default ContentRouter;

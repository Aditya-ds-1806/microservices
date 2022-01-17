import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';
import ContentMiddleware from '../middleware/Content.js';
import ContentControllers from '../controllers/ContentControllers.js';

dotenv.config({ path: 'routes/.env' });

const ContentRouter = new Router();
const { existsUser, existsContent, errorHandler } = ContentMiddleware;
const {
    listAllContent, readContent, createContent, updateContent, deleteContent, bulkInsert,
} = ContentControllers;

ContentRouter.put('/content', fileUpload(), asyncHandler(bulkInsert));
ContentRouter.get('/content', asyncHandler(listAllContent));
ContentRouter.post('/content', asyncHandler(existsUser), asyncHandler(createContent));
ContentRouter.get('/content/:contentId', asyncHandler(existsContent), asyncHandler(readContent));
ContentRouter.put('/content/:contentId', asyncHandler(existsContent), asyncHandler(updateContent));
ContentRouter.delete('/content/:contentId', asyncHandler(existsContent), asyncHandler(deleteContent));

ContentRouter.use(errorHandler);

export default ContentRouter;

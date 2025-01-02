import express, { RequestHandler, Request, Response } from 'express';
import { register, login } from '../controllers/auth';
import { 
    getApplications, 
    createApplication, 
    updateApplication, 
    deleteApplication 
} from '../controllers/jobapplication';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Auth routes
router.post('/auth/register', (register as unknown) as RequestHandler);
router.post('/auth/login', (login as unknown) as RequestHandler);

// Job application routes (protected)
router.get('/applications', (authMiddleware as unknown) as RequestHandler, (getApplications as unknown) as RequestHandler);
router.post('/applications', (authMiddleware as unknown) as RequestHandler, (createApplication as unknown) as RequestHandler);
router.put('/applications/:id', (authMiddleware as unknown) as RequestHandler, (updateApplication as unknown) as RequestHandler);
router.delete('/applications/:id', (authMiddleware as unknown) as RequestHandler, (deleteApplication as unknown) as RequestHandler);

export default router;
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import pool from '../db';

export const getApplications = async (req: AuthRequest, res: Response) => {
    try {
        const result = await pool.query(
            `SELECT * FROM job_applications 
             WHERE user_id = $1 
             ORDER BY created_at DESC`,
            [req.user?.id]
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createApplication = async (req: AuthRequest, res: Response) => {
    try {
        const { jobTitle, company, salary, applied, interview, offer } = req.body;
        
        const result = await pool.query(
            `INSERT INTO job_applications 
             (user_id, job_title, company, salary, applied, interview, offer)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [req.user?.id, jobTitle, company, salary, applied, interview, offer]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateApplication = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { jobTitle, company, salary, applied, interview, offer } = req.body;
        
        const result = await pool.query(
            `UPDATE job_applications 
             SET job_title = $1, company = $2, salary = $3, 
                 applied = $4, interview = $5, offer = $6,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $7 AND user_id = $8
             RETURNING *`,
            [jobTitle, company, salary, applied, interview, offer, id, req.user?.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteApplication = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(
            'DELETE FROM job_applications WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, req.user?.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.json({ message: 'Application deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
    import jwt from 'jsonwebtoken';
    import { Request, Response, NextFunction } from 'express';
    import keys from '../config/keys.ts';
    import db from '../db.ts';
    import { User } from '../controllers/auth.ts'
   
    export interface AuthRequest extends Request {
        user?: User;
      }

    export default async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;

            if(!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ massage: 'Unauthorized: No token provided'});
            }

            const token: string = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, keys.jwt);

            const [rows] = await db.query(`SELECT * FROM users WHERE id = ?`, [decoded.userId])

            if(rows.length === 0) {
                return res.status(401).json({ message: 'User not found'})
            }

            const userFromDb: User = rows[0];

            if(userFromDb.is_blocked) {
                return res.status(403).json({ message: 'Your account is blocked' })
            }

            req.user = userFromDb;
            next()
        } catch (error) {
                console.log('JWT auth Error:', error.massage);
                return res.status(401).json({ message: 'Unauthorized: Invalid token'})
        }
    }
           
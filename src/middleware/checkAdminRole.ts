import { Response, NextFunction } from "express";
import { AuthRequest } from '../middleware/authMiddleware'
    
export default function checkRole(role: string) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if(!req.user) {
            return res.status(401).json({
            message: 'User acquisition error'
            })
        }
        if(req.user.role !== role) {
            return res.status(403).json({
            message: 'This feature is available only to the administrator'
            })
        } 
        next()
    }
}
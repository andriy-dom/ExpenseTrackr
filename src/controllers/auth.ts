    import bcrypt from 'bcrypt';
    import jwt from 'jsonwebtoken';
    import { ResultSetHeader } from 'mysql2';
    import db from '../db.ts';
    import keys from '../config/keys.ts';
    import { Request, Response } from 'express';
    import errorHandler from '../utils/errorHandler.ts';
    
    export interface User {
        id: number,
        username: string,
        email: string,
        role: string,
        password: string,
        is_blocked: boolean,
        created_at: Date
    }

    const register = async (req: Request, res: Response): Promise<void> => {
        const { username, email, password, role }: User = req.body;

        try {
            const [resultEmail] = await db.query(`SELECT id FROM Users WHERE email = ?`, [email]);

            if (resultEmail.length > 0) {
                res.status(409).json({ message: 'This email is busy, try another one' }) 
                return;
            }
            
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password, salt);

            const [user]: [ResultSetHeader, unknown] = await db.query(`INSERT INTO  Users (username, email, password_hash, role) 
                VALUES (?, ?, ?, ?)`, 
                [username, email, hashPassword, role]);
            
            res.status(201).json({
                message: 'User succsessfully created!',
                userId: user.insertId
            });
        } catch (error) {
            errorHandler(res, error);
        }
    } 

    
    const login = async (req: Request, res: Response): Promise<void> => {
        const { email, password }: User = req.body;
        try {
            const [resultCheckUser]: [User[]] = await db.query(`SELECT id, password_hash, is_blocked FROM Users WHERE email = ?`, [email])

            if (resultCheckUser.length === 0) {
                res.status(404).json({message: 'No user with this email was found'});
                return;
            }    

            const user = resultCheckUser[0]
            const passwordResult = bcrypt.compareSync(password, user.password_hash);
                
            if (!passwordResult) {
                res.status(401).json({message: 'Passwords do not match, try again'});
                return;
            };

            if(user.is_blocked){
                res.status(403).json({ message: 'Your account is blocked' });
                return;
            }
            
            const token = jwt.sign({
                email: email,
                userId: user.id
            }, keys.jwt, {expiresIn: 60 * 60});
            res.status(200).json({
                token: `Bearer ${token}`
            })
        } catch (error) {
            errorHandler(res, error);
        } 
    };

  export {
    register,
    login
  }
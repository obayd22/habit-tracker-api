import type { Request, Response } from "express";
import bcrypt from 'bcrypt'; 
import { db } from '../db/connection.ts';
import {users, type newUser} from '../db/schema.ts'
import { generateToken } from "../utils/jwt.ts";
import { comparePasswords, hashPassword } from "../utils/passwords.ts";
import {eq} from 'drizzle-orm'

export const register = async (req: Request<any, any, newUser>, res: Response) => {
    try {
        const {email, username, password, firstName, lastName} = req.body;
        const hashedPassword = await hashPassword(password);

        const [user] = await db
        .insert(users)
        .values({
            email,
            username,
            password: hashedPassword,
            firstName,
            lastName
        })
        .returning({
            id: users.id,
            email: users.email,
            username: users.username,
            firstName: users.firstName,
            Name: users.lastName,
            createdAt: users.createdAt
        })

        const token = await generateToken({
            id: user.id, 
            email: user.email, 
            username: user.username,
        })


        return res.status(201).json({
            message: "User Created", 
            user, 
            token,
        })

    } catch(e) {
        console.error("Registration error", e);
        res.status(500).json({error: "Failed to create user"}) // there is a problem with our server
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body
        const user = await db.query.users.findFirst({
            where: eq(users.email, email), 
        })

        // if we don't have email
        if(!user) {
            return res.status(401).json({error: "Invalid credentials"});
        }
        // comparing passwords
        const isValidatedPassword = await comparePasswords(password, user.password)

        if(!isValidatedPassword) {
            return res.status(401).json({error: "Invalid credentials"});
        }

        const token = await generateToken({
            id: user.id,
            email: user.email,
            username: user.username
        })

         
        return res.status(201).json({
            message: "Login success", 
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                Name: user.lastName,
                createdAt: user.createdAt
            }
        }).status(201)
          
    } catch (e) {
        console.error("Loging error", e)
        res.status(500).json({message: "Failed to login"});
    }
}
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken';
import { prismaClient } from '../database/prisma'

type JwtPayload = {
    id: number
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers

    if(!authorization) { 
        return res.status(401).send('Unauthorized.')
    }

    const token = authorization.split(' ')[1]

    const { id } = jwt.verify(token, process.env.JWT_PASS ?? '') as JwtPayload

    const user = await prismaClient.user.findUnique({
        where: {
            id
        }
    })

    if(!user) {
        return res.status(401).send('Unauthorized.')
    }

    req.user = user

    next()  
}
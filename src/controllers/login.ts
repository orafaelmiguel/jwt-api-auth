import { prismaClient } from '../database/prisma'
import { Request, Response } from 'express'
import 'dotenv/config'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

export async function login(req: Request, res: Response) {
    const { email, password } = req.body

    // Verificando se o e-mail informado existe na database

    const user = await prismaClient.user.findUnique({
        where: {
            email
        }
    })

    if(!user) {
        return res.status(400).send('Invalid e-mail or password.')
    }

    // Verificando se a senha corresponde ao e-mail informado

    const verifyPass = await bcrypt.compare(password, user.password)

    if(!verifyPass) {
        return res.status(400).send('Invalid e-mail or password.')
    }

    // Criando token de autenticação usando JWT

    const token = jwt.sign({ id: user.id }, process.env.JWT_PASS ?? '', { expiresIn: '8h' })

    const { password: _, ...userLogin } = user

    return res.status(200).send({
        user: userLogin,
        token: token
    })
}

export async function getProfile(req: Request, res: Response) {

    return res.status(200).send(req.user)
}
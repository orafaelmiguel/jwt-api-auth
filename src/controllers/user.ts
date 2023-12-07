import { prismaClient } from '../database/prisma'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'


export async function createUser(req: Request, res: Response) {
    const {
        name,
        email,
        password
    } = req.body

    // Checando se já existe um e-mail igual cadastrado

    const userExists = await prismaClient.user.findUnique({
        where: {
            email
        }
    })

    if(userExists) {
        return res.status(400).send('User already exists.')
    }

    // Criptografando senha e criando usuário

    const hashPass = await bcrypt.hash(password, 10)

    const createdUser = await prismaClient.user.create({
        data: {
            name,
            email,
            password: hashPass
        }
    })

    return res.status(200).send('User created successfully.')
}

export async function listUsers(req: Request, res: Response) {
    const allUsers = await prismaClient.user.findMany()

    return res.status(200).send(allUsers)
}

export async function updateUser(req: Request, res: Response) {
    const { id } = req.params
    const { email } = req.body

    const updateUser = await prismaClient.user.update({
        where: {
            id
        },

        data: {
            email
        }
    })

    return res.status(200).send("User updated successfully.")
}

export async function deleteUser(req: Request, res: Response) {
    const { id } = req.params

    const deletedUser = await prismaClient.user.deleteMany({
        where: {
            id
        }
    })

    return res.status(200).send('User deleted successfully.')
}
import { Router } from "express";
import { createUser, listUsers, updateUser, deleteUser } from "../controllers/user";
import { login, getProfile } from "../controllers/login";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router()

// Rotas de usuário

router.post('/users', createUser)
router.get('/users', listUsers)
router.get('/users/:id', updateUser)
router.delete('/users/:id',deleteUser)

// Rotas de autenticação

router.post('/login', login)
router.get('/profile', authMiddleware, getProfile)

export { router }
import { Router } from "express";
import { register, login, logout, refreshToken } from "../controller/authController.js";

const router = Router();

// Registro
router.post("/register", register);

// Login
router.post("/login", login);

// Logout
router.post("/logout", logout);

// Refrescar el token
router.post('/refresh', refreshToken)

export default router;
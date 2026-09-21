import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

import { verifyToken } from './middlewares/verifyToken.js'

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js"
import dashboardRoutes from "./routes/dashboard.js"
import transactionRoutes from "./routes/transaction.js"
import categorieRoutes from "./routes/categorie.js"

const PORT = process.env.PORT || 3001
const isProd = process.env.NODE_ENV === 'production'
const app = express()

app.set('trust proxy', process.env.TRUST_PROXY === 'true')

const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean)

const corsOptions = {
    origin(origin, callback) {
        if (!origin || corsOrigins.includes(origin)) {
            return callback(null, true)
        }
        return callback(null, false)
    }
}

app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json())

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: Number(process.env.AUTH_RATE_LIMIT_MAX) || 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Demasiados intentos. Inténtalo más tarde.' }
})

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: Number(process.env.API_RATE_LIMIT_MAX) || 120,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Demasiadas peticiones. Inténtalo más tarde.' }
})

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
})

if (!isProd) {
    app.get('/test', (req, res) => {
        res.send('Api funcionando!')
    })
}

// Rutas
app.use("/api/v1/auth", authLimiter, authRoutes); 
app.use("/api/v1/", apiLimiter, verifyToken, categorieRoutes); 
app.use("/api/v1/", apiLimiter, verifyToken, transactionRoutes); 
app.use("/api/v1/dashboard/", apiLimiter, verifyToken, dashboardRoutes); 
app.use("/api/v1/user/", apiLimiter, verifyToken, userRoutes); 

app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' })
})

app.use((err, req, res, next) => {
    console.error(err)

    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ message: 'JSON inválido' })
    }

    const status = err.status || err.statusCode || 500
    if (status >= 500) {
        return res.status(500).json({ message: 'Internal server error' })
    }

    res.status(status).json({ message: err.message || 'Error' })
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
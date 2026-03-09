import express from 'express'
import cors from 'cors'

import authRoutes from "./routes/auth.js";

const PORT = process.env.PORT || 3001
const app = express()

app.use(cors())
app.use(express.json())

// Rutas
app.use("/api/v1/auth", authRoutes); 

app.listen(PORT, () => {
    console.log(`Servidor corriendo en https://localhost:${PORT}`)
})
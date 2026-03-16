import { Router } from "express";
import { createTransaction, getTransactions } from "../controller/transactionController.js";

const router = Router();

// Crear transacciones
router.post("/transactions", createTransaction);
// Cargar transacciones
router.get("/transactions", getTransactions);

export default router;
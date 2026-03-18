import { Router } from "express";
import { createTransaction, getTransactions, deleteTransaction } from "../controller/transactionController.js";

const router = Router();

// Crear transacciones
router.post("/transactions", createTransaction);
// Cargar transacciones
router.get("/transactions", getTransactions);
// Eliminar transacciones (soft)
router.patch("/transactions/:id", deleteTransaction);

export default router;
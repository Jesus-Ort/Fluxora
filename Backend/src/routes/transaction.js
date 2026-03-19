import { Router } from "express";
import { createTransaction, getTransactions, updateTransaction, deleteTransaction } from "../controller/transactionController.js";

const router = Router();

// Crear transacciones
router.post("/transactions", createTransaction);
// Cargar transacciones
router.get("/transactions", getTransactions);
// Actualizar transacciones
router.patch("/transactions/:id/update", updateTransaction);
// Eliminar transacciones (soft)
router.patch("/transactions/:id/delete", deleteTransaction);

export default router;
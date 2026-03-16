import { Router } from "express";
import { createTransaction, getTransactions } from "../controller/transactionController.js";

const router = Router();

// Crear categorias
router.post("/transactions", createTransaction);
// Cargar caegorias
router.get("/transactions", getTransactions);

export default router;
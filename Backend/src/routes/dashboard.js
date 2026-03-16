import { Router } from "express";
import { getMonthlyRisk, getCategoryExpenses } from "../controller/dashboardController.js";

const router = Router();

// Cargar riesgo mensual
router.get("/monthly-risk", getMonthlyRisk);
// Cargar gastos por categorias
router.get("/category-expenses", getCategoryExpenses);

export default router;
import { Router } from "express";
import { createCategorie, getCategories } from "../controller/categorieController.js";

const router = Router();

// Crear categorias
router.post("/categories", createCategorie);
// Cargar caegorias
router.get("/categories", getCategories);

export default router;
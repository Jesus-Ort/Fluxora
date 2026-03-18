import { Router } from "express";
import { createCategorie, getCategories, deleteCategorie } from "../controller/categorieController.js";

const router = Router();

// Crear categorias
router.post("/categories", createCategorie);
// Cargar categorias
router.get("/categories", getCategories);
// Eliminar categorias (soft)
router.patch("/categories/:id", deleteCategorie);

export default router;
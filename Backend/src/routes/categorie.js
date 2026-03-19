import { Router } from "express";
import { createCategorie, getCategories, updateCategorie, deleteCategorie } from "../controller/categorieController.js";

const router = Router();

// Crear categorias
router.post("/categories", createCategorie);
// Cargar categorias
router.get("/categories", getCategories);
// Actualizar categorias
router.patch("/categories/:id/update", updateCategorie);
// Eliminar categorias (soft)
router.patch("/categories/:id/delete", deleteCategorie);

export default router;
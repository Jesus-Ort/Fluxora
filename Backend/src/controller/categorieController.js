import { supabase } from '../config/supabase.js'
import { isValidUUID, isStringBetween, isIn, VALID_TRANSACTION_TYPES } from '../utils/validators.js'

// Crear categoria
export const createCategorie = async (req, res) => {
    try {
        const user_id = req.user.id

        if(!user_id){
            return res.status(401).json({
                message: "No se ha encontrado el usuario."
            });
        }

        const { name, type } = req.body

        if (!name || !type) {
            return res.status(400).json({
                message: "El nombre y el tipo de categoría es obligatorio."
            });
        }

        if (!isStringBetween(name, 1, 100)) {
            return res.status(400).json({
                message: "El nombre debe tener entre 1 y 100 caracteres."
            });
        }

        if (!isIn(type, VALID_TRANSACTION_TYPES)) {
            return res.status(400).json({
                message: "El tipo de categoría es inválido."
            });
        }

        const {data, error} = await supabase
        .from("categories")
        .insert([
            {
                user_id: user_id,
                name: name.trim(),
                type,
            }
        ])
        .select()
        .single();

        if (error) {
        console.error(error)

        return res.status(500).json({
            message: "Internal server error"
        })
        }

        res.json({
            message: 'Categoría creada.',
            category: data
        })
    } catch (err) {
        console.error(err)

        res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Cargar categorias
export const getCategories = async (req, res) => {
    try {
        
        if(!req.user){
            return res.status(401).json({
                message: "Usuario no autenticado"
            });
        }
        
        const user_id = req.user.id

        const {data, error} = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", user_id)
        .eq("isactive", true)


        if (error) {
        console.error(error)

        return res.status(500).json({
            message: "Internal server error"
        })
        }

        res.json({
            categories: data
        })
    } catch (err) {
        console.error(err)

        res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Editar categoria
export const updateCategorie = async (req, res) => {
    try {
        const user_id = req.user.id
        
        if(!req.user){
            return res.status(401).json({
                message: "Usuario no autenticado"
            });
        }
        
        const { id } = req.params
        if (!id) return res.status(400).json({ message: "Se necesita el ID de la categoría." })
        if (!isValidUUID(id)) return res.status(400).json({ message: "ID inválido." })

        const { name, type } = req.body

        if (!name || !type) {
            return res.status(400).json({
                message: "El nombre y el tipo de categoría es obligatorio."
            });
        }

        if (!isStringBetween(name, 1, 100)) {
            return res.status(400).json({
                message: "El nombre debe tener entre 1 y 100 caracteres."
            });
        }

        if (!isIn(type, VALID_TRANSACTION_TYPES)) {
            return res.status(400).json({
                message: "El tipo de categoría es inválido."
            });
        }

        const {data, error} = await supabase
        .from("categories")
        .update({
            user_id: user_id,
            name: name.trim(),
            type,
        })
        .eq("id", id)
        .eq("user_id", req.user.id)
        .select()
        .single();

        if (error) {
        console.error(error)

        return res.status(500).json({
            message: "Internal server error"
        })
        }

        res.json({
            message: 'Categoría actualizada.',
            category: data
        })
    } catch (err) {
        console.error(err)

        res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Eliminar categoria
export const deleteCategorie = async (req, res) => {
    try {
        
        if(!req.user){
            return res.status(401).json({
                message: "Usuario no autenticado"
            });
        }
        
        const { id } = req.params
        if (!id) return res.status(400).json({ message: "Se necesita el ID de la categoría." })
        if (!isValidUUID(id)) return res.status(400).json({ message: "ID inválido." })

        const {data, error} = await supabase
        .from("categories")
        .update({ isactive: false })
        .eq("id", id)
        .eq("user_id", req.user.id)
        .select()
        .single()

        if (error) {
        console.error(error)

        return res.status(500).json({
            message: "Internal server error"
        })
        }

        res.json({
            message: "La categoría ha sido eliminada."
        })
    } catch (err) {
        console.error(err)

        res.status(500).json({
            message: "Internal server error"
        })
    }
}
import { supabase } from '../config/supabase.js'
import {
    isValidUUID,
    isValidAmount,
    isStringBetween,
    isIn,
    VALID_TRANSACTION_TYPES
} from '../utils/validators.js'

const categoryBelongsToUser = async (category_id, user_id) => {
    const { data, error } = await supabase
        .from("categories")
        .select("id")
        .eq("id", category_id)
        .eq("user_id", user_id)
        .maybeSingle()

    if (error) return false
    return !!data
}

// Crear transacción
export const createTransaction = async (req, res) => {
    try {
        const user_id = req.user.id

        if(!user_id){
            return res.status(401).json({
                message: "No se ha encontrado el usuario."
            });
        }

        const { type, category_id, amount, description } = req.body

        if (!type || !category_id || !amount || !description ) {
            return res.status(400).json({
                message: "Todos los campos son obligatorios."
            });
        }

        if (!isIn(type, VALID_TRANSACTION_TYPES)) {
            return res.status(400).json({
                message: "El tipo de transacción es inválido."
            });
        }

        if (!isValidUUID(category_id)) {
            return res.status(400).json({
                message: "El ID de la categoría es inválido."
            });
        }

        if (!isValidAmount(amount)) {
            return res.status(400).json({
                message: "El monto debe ser un número mayor a 0 con máximo 2 decimales."
            });
        }

        if (!isStringBetween(description, 3, 100)) {
            return res.status(400).json({
                message: "La descripción debe tener entre 3 y 100 caracteres."
            });
        }

        const ownCategory = await categoryBelongsToUser(category_id, user_id)
        if (!ownCategory) {
            return res.status(400).json({
                message: "La categoría no existe o no pertenece al usuario."
            });
        }

        const {data, error} = await supabase
        .from("transactions")
        .insert([
            {
                user_id: user_id,
                category_id,
                amount,
                description
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
            message: 'Transacción creada',
            transaction: data
        })
    } catch (err) {
        console.error(err)

        res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Cargar transacciones
export const getTransactions = async (req, res) => {
    try {
        
        if(!req.user){
            return res.status(401).json({
                message: "Usuario no autenticado"
            });
        }
        
        const user_id = req.user.id

        const {data, error} = await supabase
        .from("transactions")
        .select(`
        id,
        category_id,
        amount,
        description,
        transaction_date,
        categories!inner( name, type, isactive )
        `)
        .eq("user_id", user_id)
        .eq("isactive", true)
        .eq('categories.isactive', true)
        .eq('categories.user_id', user_id)
        .order("created_at", { ascending: false })


        if (error) {
        console.error(error)

        return res.status(500).json({
            message: "Internal server error"
        })
        }

        const formatted = data.map(t => ({
        ...t,
        type: t.categories?.type
        }));

        res.json({ transactions: formatted });

    } catch (err) {
        console.error(err)

        res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Editar Transaccion
export const updateTransaction = async (req, res) => {
    try {

        if (!req.user) {
        return res.status(401).json({
            message: "Usuario no autenticado"
        })
        }

        const { id } = req.params

        const { category_id, amount, description, type } = req.body

        if (!id) {
        return res.status(400).json({
            message: "ID requerido"
        })
        }

        if (!isValidUUID(id)) {
        return res.status(400).json({
            message: "ID inválido"
        })
        }

        if (!category_id || !amount || !description) {
        return res.status(400).json({
            message: "Datos incompletos"
        })
        }

        if (type !== undefined && !isIn(type, VALID_TRANSACTION_TYPES)) {
        return res.status(400).json({
            message: "El tipo de transacción es inválido."
        })
        }

        if (!isValidUUID(category_id)) {
        return res.status(400).json({
            message: "El ID de la categoría es inválido."
        })
        }

        if (!isValidAmount(amount)) {
        return res.status(400).json({
            message: "El monto debe ser un número mayor a 0 con máximo 2 decimales."
        })
        }

        if (!isStringBetween(description, 3, 100)) {
        return res.status(400).json({
            message: "La descripción debe tener entre 3 y 100 caracteres."
        })
        }

        const ownCategory = await categoryBelongsToUser(category_id, req.user.id)
        if (!ownCategory) {
        return res.status(400).json({
            message: "La categoría no existe o no pertenece al usuario."
        })
        }

        const { data, error } = await supabase
        .from("transactions")
        .update({
            category_id,
            amount,
            description
        })
        .eq("id", id)
        .eq("user_id", req.user.id)
        .select()
        .single()

        if (error) {
        console.error(error)

        return res.status(500).json({
            message: "Error al actualizar"
        })
        }

        res.json({
        message: "Transacción actualizada",
        transaction: data
        })

    } catch (err) {

        console.error(err)

        res.status(500).json({
        message: "Internal server error"
        })

    }
}

// Eliminar Transaccion
export const deleteTransaction = async (req, res) => {
    try {
        
        if(!req.user){
            return res.status(401).json({
                message: "Usuario no autenticado"
            });
        }
        
        const { id } = req.params
        if (!id) return res.status(400).json({ message: "Se necesita el ID de la transacción." })
        if (!isValidUUID(id)) return res.status(400).json({ message: "ID inválido." })

        const {data, error} = await supabase
        .from("transactions")
        .update({ isactive: false })
        .eq("id", id)
        .eq("user_id", req.user.id)
        .select()

        if (error) {
        console.error(error)

        return res.status(500).json({
            message: "Internal server error"
        })
        }

        res.json({
            message: "La transacción ha sido eliminada."
        })
    } catch (err) {
        console.error(err)

        res.status(500).json({
            message: "Internal server error"
        })
    }
}
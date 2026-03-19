import { supabase } from '../config/supabase.js'

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

        if (!category_id || !amount || !description) {
        return res.status(400).json({
            message: "Datos incompletos"
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
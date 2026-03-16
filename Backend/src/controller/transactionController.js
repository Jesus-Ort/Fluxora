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
        profiles ( full_name ),
        categories ( name ),
        amount,
        description,
        transaction_date
        `)
        .eq("user_id", user_id)
        .order("created_at", { ascending: false })


        if (error) {
        console.error(error)

        return res.status(500).json({
            message: "Internal server error"
        })
        }

        res.json({
            transactions: data
        })
    } catch (err) {
        console.error(err)

        res.status(500).json({
            message: "Internal server error"
        })
    }
}
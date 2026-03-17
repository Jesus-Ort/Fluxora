import { supabase } from '../config/supabase.js'

// Cargar Riesgo Mensual (Principal)
export const getMonthlyRisk = async (req, res) => {
    try {
        
        if(!req.user){
            return res.status(401).json({
                message: "Usuario no autenticado"
            });
        }
        
        const user_id = req.user.id

        const {data, error} = await supabase
        .from("v_user_monthly_risk_analysis")
        .select("*")
        .eq("user_id", user_id)
        .order("month", { ascending: false })
        .limit(1); // solo el último mes


        if (error) {
        console.error(error)

        return res.status(500).json({
            message: "Internal server error"
        })
        }

        res.json({
            monthly_risk_analysis: data[0] || null
        })

    } catch (err) {
        console.error(err)

        res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Cargar gastos por categoria
export const getCategoryExpenses = async (req, res) => {
    try {
        
        if(!req.user){
            return res.status(401).json({
                message: "Usuario no autenticado"
            });
        }
        
        const user_id = req.user.id

        const {data, error} = await supabase
        .from("v_user_category_expenses")
        .select("*")
        .eq("user_id", user_id)


        if (error) {
        console.error(error)

        return res.status(500).json({
            message: "Internal server error"
        })
        }

        res.json({
            category_expenses: data
        })
        
    } catch (err) {
        console.error(err)

        res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Cargar balance total del usuario
export const getUserBalance = async (req, res) => {
    try {
        
        if(!req.user){
            return res.status(401).json({
                message: "Usuario no autenticado"
            });
        }
        
        const user_id = req.user.id

        const {data, error} = await supabase
        .from("v_user_balance")
        .select("*")
        .eq("user_id", user_id)


        if (error) {
        console.error(error)

        return res.status(500).json({
            message: "Internal server error"
        })
        }

        res.json({
            user_balance: data[0] || null
        })
        
    } catch (err) {
        console.error(err)

        res.status(500).json({
            message: "Internal server error"
        })
    }
}
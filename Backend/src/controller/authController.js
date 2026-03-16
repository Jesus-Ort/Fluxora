import { supabase } from '../config/supabase.js'

// REGISTRO
export const register = async (req, res) => {
    try {
        const {         
        full_name,
        email,
        password,
        saving_percentage
        } = req.body

        if (!email || !password){
            return res.status(400).json({message: 'Email y Contraseña son obligatorios'});
        }

        if (saving_percentage === undefined || saving_percentage === null){
            return res.status(400).json({message: 'El porcentaje es obligatorio'});
        }

        if (saving_percentage < 0 || saving_percentage > 100) {
            return res.status(400).json({
                message: 'El porcentaje debe estar entre 0 y 100'
            });
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password
        });

        if (authError) {
            return res.status(400).json({ message: authError.message, error: authError.message });
        }

        const user_id = authData.user?.id;
        if(!user_id){
            return res.status(500).json({ message: 'No se pudo obtener el ID del usuario' })
        }

        const {data:userTableData, error: userTableError} = await supabase
        .from("profiles")
        .insert([
            {
                id: user_id,
                full_name,
                saving_percentage,
            }
        ]);

        if (userTableError) {
            return res.status(400).json({message: 'Error al insertar el nuevo usuario', error: userTableError.message});
        }

        res.status(201).json({
        message: 'Registro exitoso. Revisa tu correo para confirmar la cuenta.',
        });
    } catch (err) {
        console.error(err)

        res.status(500).json({
            message: "Internal server error"
        })
    }
}

// LOGIN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: "Email y contraseña son obligatorios"
            });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })        

        if (error) {
        console.error(error)

        return res.status(500).json({
            message: "Internal server error"
        })
        }

        if (!data.session) {
            return res.status(400).json({ message: 'Usuario no tiene sesión activa o no ha confirmado correo' })
        }

        res.json({
            message: 'Inicio de sesión exitoso',
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
        })
    } catch (err) {
        console.error(err)

        res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Refresh token
export const refreshToken = async (req, res) => {
    try {
        const { refresh_token } = req.body

        if (!refresh_token) {
        return res.status(400).json({ error: "refresh_token requerido" })
        }

        // Refrescar usando SERVICE ROLE
        const { data, error } = await supabase.auth.refreshSession({
        refresh_token
        })

        if (error) {
        console.error(error)

        return res.status(500).json({
            message: "Internal server error"
        })
        }

        return res.json({
        message: "Token refrescado",
        session: data.session,
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        user: data.user
        })

    } catch (err) {
        console.error(err)

        res.status(500).json({
            message: "Internal server error"
        })
    }
}
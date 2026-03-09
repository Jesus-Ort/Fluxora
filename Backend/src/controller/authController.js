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
            return res.status(400).json({ message: 'Error al registrar en Supabase Auth', error: authError.message });
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
        res.status(500).json({ error: err.message })
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
                return res.status(401).json({message: 'Error al iniciar sesión', error: error.message });
        }

        if (!data.session) {
            return res.status(400).json({ message: 'Usuario no tiene sesión activa o no ha confirmado correo' })
        }

        const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();


        res.json({
            message: 'Inicio de sesión exitoso',
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            user: {
                id: data.user.id,
                email: data.user.email
            },
            profile
        })
    } catch (err) {
    res.status(500).json({ error: err.message })
    }
}

// LOGOUT
export const logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '')

        if (!token) return res.status(401).json({ error: 'Token requerido' })
        
        const {error} = await supabase.auth.signOut()

        if (error){
            return res.status(400).json({error: 'Error cerrando sesión', details: error.message })
        }

        res.json({ message: 'Sesión cerrada correctamente' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

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
        return res.status(401).json({ error: error.message })
        }

        return res.json({
        message: "Token refrescado",
        session: data.session,
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        user: data.user
        })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
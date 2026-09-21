import { supabase } from '../config/supabase.js'
import { isValidEmail, isValidPercentage } from '../utils/validators.js'

const verifyCurrentPassword = async (user, currentPassword) => {
    if (!currentPassword || !user?.email) return false

    const { error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
    })

    return !error
}

// Cambiar correo
export const updateEmail = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Usuario no autenticado" });

        const { email, current_password } = req.body;
        if (!email) return res.status(400).json({ message: "Correo es obligatorio" });

        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "Correo inválido" });
        }

        const verified = await verifyCurrentPassword(req.user, current_password);
        if (!verified) {
            return res.status(401).json({ message: "Contraseña actual incorrecta" });
        }

        const { data, error } = await supabase.auth.admin.updateUserById(req.user.id, {
        email,
        });

        if (error) {
        console.error(error);
        return res.status(500).json({ message: "Error interno del servidor" });
        }

        res.json({ message: "Correo actualizado correctamente", user: data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Cambiar contraseña
export const updatePassword = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Usuario no autenticado" });

        const { newPassword, current_password } = req.body;
        if (!newPassword || newPassword.length < 6)
        return res.status(400).json({ message: "Nueva contraseña inválida" });

        const verified = await verifyCurrentPassword(req.user, current_password);
        if (!verified) {
            return res.status(401).json({ message: "Contraseña actual incorrecta" });
        }

        const { data, error } = await supabase.auth.admin.updateUserById(req.user.id, {
        password: newPassword,
        });

        if (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
        }

        res.json({ message: "Contraseña actualizada correctamente", user: data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Cambiar nombre de usuario
export const updateUserName = async (req, res) => {
    try {
        if (!req.user) {
        return res.status(401).json({ message: "Usuario no autenticado" });
        }

        const { full_name } = req.body;
        if (!full_name) {
        return res.status(400).json({ message: "El nombre es obligatorio" });
        }

        if (typeof full_name !== "string" || full_name.trim().length < 5 || full_name.trim().length > 100) {
        return res.status(400).json({ message: "El nombre debe tener entre 5 y 100 caracteres" });
        }

        const { data, error } = await supabase
        .from('profiles')
        .update({ full_name: full_name.trim() })
        .eq('id', req.user.id);

        if (error) {
        console.error(error);
        return res.status(500).json({ message: "Error actualizando el nombre del usuario" });
        }

        res.json({ message: "Nombre del usuario actualizado correctamente"});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Cambiar porcenaje de ahorro
export const updateSavingPercentage = async (req, res) => {
    try {
        if (!req.user) {
        return res.status(401).json({ message: "Usuario no autenticado" });
        }

        const { saving_percentage } = req.body;

        if (saving_percentage === undefined || saving_percentage === null){
            return res.status(400).json({message: 'El porcentaje es obligatorio'});
        }

        if (!isValidPercentage(saving_percentage)) {
            return res.status(400).json({
                message: 'El porcentaje debe estar entre 0 y 100'
            });
        }

        const { data, error } = await supabase
        .from('profiles')
        .update({ saving_percentage })
        .eq('id', req.user.id);

        if (error) {
        console.error(error);
        return res.status(500).json({ message: "Error actualizando el porcentaje de ahorro" });
        }

        res.json({ message: "Porcentaje de ahorro actualizado correctamente"});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
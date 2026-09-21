import { supabase } from '../config/supabase.js'

export const verifyToken = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization || ''
        const [scheme, token] = authorization.split(' ')

        if (scheme !== 'Bearer' || !token) {
            return res.status(401).json({ error: 'Token requerido' })
        }

        const { data, error } = await supabase.auth.getUser(token)
        if (error) return res.status(401).json({ error: 'Token inválido o expirado' })
        if (!data.user) return res.status(401).json({ error: 'Token inválido o expirado' })
        
        req.user = data.user
        next()
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}
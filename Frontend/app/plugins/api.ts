import axios from 'axios'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    const api = axios.create({
        baseURL: config.public.apiUrl,
        headers: { 'Content-Type': 'application/json' }
    })

    api.interceptors.request.use(config => {
        const token = localStorage.getItem('access_token')
        if (token) config.headers.Authorization = `Bearer ${token}`
        return config
    })

    let isRefreshing = false
    let failedQueue: any[] = []

    const processQueue = (error: any, token: string | null = null) => {
        failedQueue.forEach(p => {
        if (error) p.reject(error)
        else p.resolve(token)
        })
        failedQueue = []
    }

    api.interceptors.response.use(
        res => res,
        async (error) => {
        const originalRequest = error.config

        if (error.response?.status !== 401) {
            return Promise.reject(error)
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
            }).then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
            })
        }

        isRefreshing = true

        const refreshToken = localStorage.getItem('refresh_token')

        if (!refreshToken) {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            return Promise.reject(error)
        }

        try {
            const res = await axios.post(
            `${config.public.apiUrl}/api/v1/auth/refresh`,
            { refresh_token: refreshToken }
            )

            const { access_token, refresh_token } = res.data

            localStorage.setItem('access_token', access_token)
            if (refresh_token) {
            localStorage.setItem('refresh_token', refresh_token)
            }

            processQueue(null, access_token)

            originalRequest.headers.Authorization = `Bearer ${access_token}`
            return api(originalRequest)

        } catch (err) {
            processQueue(err, null)

            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')

            return Promise.reject(err)

        } finally {
            isRefreshing = false
        }
        }
    )

    return {
        provide: {
        api
        }
    }
})
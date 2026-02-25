import axios from 'axios'

export default defineNuxtPlugin(() => {
  const api = axios.create({
    baseURL: 'https://localhost:3001/api'
  })
  
  return {
    provide: {
      api
    }
  }
})
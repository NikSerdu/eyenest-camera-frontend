import axios from 'axios'
import { refreshCameraToken } from '../requests/camera/camera'

export const authInstance = axios.create({
	baseURL: import.meta.env.VITE_SERVER_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
})

authInstance.interceptors.response.use(
	config => config,
	async error => {
		const originalRequest = error.config

		if (
			error.response.status === 401 &&
			error.config &&
			!error.config._isRetry
		) {
			originalRequest._isRetry = true

			try {
				await refreshCameraToken()
				return authInstance.request(originalRequest)
			} catch (e) {
				console.log(e)
			}
		}
		throw error
	},
)

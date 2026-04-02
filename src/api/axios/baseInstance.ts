import axios from 'axios'
import { getViteServerUrl } from '../../shared/runtimeEnv'

export const baseInstance = axios.create({
	baseURL: getViteServerUrl(),
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
})

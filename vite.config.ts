import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		allowedHosts: ['7680-216-173-68-192.ngrok-free.app'],
	},
})

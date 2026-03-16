import { defineConfig } from 'orval'

export default defineConfig({
	cameraApp: {
		input: {
			target: 'http://localhost:4000/openapi.yaml',
			filters: {
				mode: 'include',
				tags: ['Camera', 'LiveKit'],
			},
		},
		output: {
			schemas: './src/api/generated',
			target: './src/api/generated',
		},
	},
})

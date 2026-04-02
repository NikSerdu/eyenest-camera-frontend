import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LinkCameraPage } from './pages/LinkCameraPage'
import { StreamPage } from './pages/StreamPage'
import '@livekit/components-styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
	<QueryClientProvider client={queryClient}>
		<BrowserRouter
			basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}
		>
			<Routes>
				<Route path='/' element={<LinkCameraPage />} />
				<Route path='/:cameraID' element={<StreamPage />} />
			</Routes>
		</BrowserRouter>
	</QueryClientProvider>,
)

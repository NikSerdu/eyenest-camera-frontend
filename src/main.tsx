import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LinkCameraPage } from './pages/LinkCameraPage'
import { StreamPage } from './pages/StreamPage'

createRoot(document.getElementById('root')!).render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<LinkCameraPage />} />
			<Route path="/:cameraID" element={<StreamPage />} />
		</Routes>
	</BrowserRouter>
)

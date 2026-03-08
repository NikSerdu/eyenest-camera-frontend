import { useParams } from 'react-router-dom'
import { useWebRTC } from './useWebRTC'

function App() {
	const { cameraID } = useParams<{ cameraID: string }>()
	if (!cameraID) {
		return null
	}
	const { provideMediaRef } = useWebRTC({ roomID: cameraID })
	return (
		<div>
			<video
				width='100%'
				height='100%'
				ref={instance => {
					provideMediaRef(instance)
				}}
				autoPlay
				playsInline
				muted={true}
			/>
		</div>
	)
}

export default App

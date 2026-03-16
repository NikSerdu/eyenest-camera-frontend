import { useParams } from 'react-router-dom'
import { LiveKitRoom } from '@livekit/components-react'
import { useGetLiveKitCameraToken } from '../api/hooks'
import { RoomVideo } from '../components/stream/RoomVideo'
import { StreamStatusHeader } from '../components/stream/StreamStatusHeader'
import { StreamControlsBar } from '../components/stream/StreamControlsBar'

const LIVEKIT_URL = 'ws://localhost:7880'

export function StreamPage() {
	const { cameraID } = useParams<{ cameraID: string }>()
	if (!cameraID) {
		return null
	}
	const {
		data: tokenResponse,
		isLoading,
		isError,
	} = useGetLiveKitCameraToken(cameraID)
	const token = tokenResponse?.token

	const isStreaming = !!token && !isLoading && !isError

	return (
		<div className='fixed inset-0 bg-slate-900 flex flex-col'>
			<div className='absolute inset-0 w-full h-full'>
				{isLoading && (
					<div className='flex items-center justify-center w-full h-full bg-slate-900/80'>
						<p className='text-slate-300 text-sm px-4 text-center'>
							Загрузка...
						</p>
					</div>
				)}
				{isError && (
					<div className='flex items-center justify-center w-full h-full bg-slate-900/80'>
						<p className='text-red-300 text-sm px-4 text-center'>
							Ошибка получения токена камеры
						</p>
					</div>
				)}
				{isStreaming && (
					<LiveKitRoom
						serverUrl={LIVEKIT_URL}
						token={token}
						connect
						video
						audio
					>
						<RoomVideo />
					</LiveKitRoom>
				)}
			</div>

			<StreamStatusHeader isStreaming={isStreaming} />
			<StreamControlsBar isStreaming={isStreaming} isLoading={isLoading} />
		</div>
	)
}

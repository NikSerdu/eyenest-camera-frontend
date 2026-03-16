import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Radio, Square } from 'lucide-react'
import {
	LiveKitRoom,
	GridLayout,
	ParticipantTile,
	useTracks,
} from '@livekit/components-react'
import { Track } from 'livekit-client'
import { useGetLiveKitCameraToken } from '../api/hooks'

const LIVEKIT_URL = 'ws://localhost:7880'

function RoomVideo() {
	const tracks = useTracks(
		[
			{ source: Track.Source.Camera, withPlaceholder: false },
			{ source: Track.Source.Microphone, withPlaceholder: false },
			{ source: Track.Source.ScreenShare, withPlaceholder: false },
		],
		{ onlySubscribed: false },
	)

	return (
		<GridLayout tracks={tracks} className='w-full h-full'>
			<ParticipantTile />
		</GridLayout>
	)
}

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

			<header className='absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 safe-area-inset-top'>
				<Link
					to='/'
					className='flex items-center gap-1.5 sm:gap-2 text-white/90 hover:text-white transition-colors py-2 pr-2 -ml-2 rounded-lg hover:bg-white/10 min-touch-target'
					aria-label='Назад'
				>
					<ArrowLeft className='w-5 h-5 sm:w-5 sm:h-5 shrink-0' />
					<span className='text-sm font-medium hidden sm:inline'>Назад</span>
				</Link>
				<span
					className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium px-2 sm:px-2.5 py-1 rounded-full backdrop-blur-sm ${
						isStreaming
							? 'bg-success-500/25 text-white'
							: 'bg-black/30 text-white/80'
					}`}
				>
					<span
						className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 ${
							isStreaming ? 'bg-success-400 animate-pulse' : 'bg-white/60'
						}`}
					/>
					{isStreaming ? 'Камера транслирует' : 'Ожидание токена камеры'}
				</span>
			</header>

			{/* Нижняя панель (можно будет сделать кнопку Старт/Стоп позже) */}
			<div className='absolute bottom-0 left-0 right-0 z-10 flex justify-center pb-4 sm:pb-6 pt-8 bg-linear-to-t from-black/50 to-transparent safe-area-inset-bottom'>
				<button
					type='button'
					disabled={isLoading}
					className={`inline-flex items-center gap-2 px-5 py-3 sm:px-6 sm:py-3 rounded-xl font-medium transition-colors shadow-lg min-touch-target mb-8 ${
						isStreaming
							? 'bg-error-500 text-white hover:bg-error-600 active:bg-error-600'
							: 'bg-brand-blue-500 text-white hover:bg-brand-blue-600 active:bg-brand-blue-700'
					}`}
				>
					{isStreaming ? (
						<>
							<Square className='w-5 h-5 shrink-0' />
							<span className='text-sm sm:text-base'>Трансляция активна</span>
						</>
					) : (
						<>
							<Radio className='w-5 h-5 shrink-0' />
							<span className='text-sm sm:text-base'>
								{isLoading ? 'Подключение...' : 'Ожидание трансляции'}
							</span>
						</>
					)}
				</button>
			</div>
		</div>
	)
}

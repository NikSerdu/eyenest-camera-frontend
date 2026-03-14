import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { ArrowLeft, Radio, Square } from 'lucide-react'
import { useWebRTC } from '../useWebRTC'

export function StreamPage() {
	const { cameraID } = useParams<{ cameraID: string }>()
	const { provideMediaRef, isStreaming, startStream, stopStream } = useWebRTC({
		roomID: cameraID ?? '',
	})

	if (!cameraID) {
		return null
	}

	return (
		<div className='fixed inset-0 bg-slate-900 flex flex-col'>
			{/* Full-screen video */}
			<video
				width='100%'
				height='100%'
				ref={instance => provideMediaRef(instance)}
				autoPlay
				playsInline
				muted
				className='absolute inset-0 w-full h-full object-cover'
			/>
			{!isStreaming && (
				<div className='absolute inset-0 flex items-center justify-center bg-slate-900/80'>
					<p className='text-slate-300 text-sm px-4 text-center'>
						Нажмите «Начать трансляцию» для просмотра
					</p>
				</div>
			)}

			{/* Overlay: top bar (back + status) */}
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
					{isStreaming ? 'Трансляция' : 'Остановлено'}
				</span>
			</header>

			<div className='absolute bottom-0 left-0 right-0 z-10 flex justify-center pb-4 sm:pb-6 pt-8 bg-gradient-to-t from-black/50 to-transparent safe-area-inset-bottom'>
				{isStreaming ? (
					<button
						type='button'
						onClick={stopStream}
						className='inline-flex items-center gap-2 px-5 py-3 sm:px-6 sm:py-3 rounded-xl bg-error-500 text-white font-medium hover:bg-error-600 active:bg-error-600 transition-colors shadow-lg min-touch-target mb-8'
					>
						<Square className='w-5 h-5 shrink-0' />
						<span className='text-sm sm:text-base'>Остановить трансляцию</span>
					</button>
				) : (
					<button
						type='button'
						onClick={() => startStream()}
						className='inline-flex items-center gap-2 px-5 py-3 sm:px-6 sm:py-3 rounded-xl bg-brand-blue-500 text-white font-medium hover:bg-brand-blue-600 active:bg-brand-blue-700 transition-colors shadow-lg min-touch-target mb-8'
					>
						<Radio className='w-5 h-5 shrink-0' />
						<span className='text-sm sm:text-base'>Начать трансляцию</span>
					</button>
				)}
			</div>
		</div>
	)
}

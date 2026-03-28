import type { FC } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { ResetCameraLinkButton } from '../../features/resetCameraLink'

interface StreamStatusHeaderProps {
	isStreaming: boolean
}

export const StreamStatusHeader: FC<StreamStatusHeaderProps> = ({
	isStreaming,
}) => {
	return (
		<header className='absolute top-2 left-2 right-2 z-10 flex items-center gap-2 px-3 sm:px-4 bg-black/50 rounded-lg backdrop-blur-sm'>
			<div className='flex flex-1 justify-start min-w-0'>
				<Link
					to='/'
					className='flex items-center gap-1.5 sm:gap-2 text-white/90 hover:text-white transition-colors rounded-lg hover:bg-white/10 min-touch-target'
					aria-label='Назад'
				>
					<ArrowLeft className='w-5 h-5 sm:w-5 sm:h-5 shrink-0' />
					<span className='text-sm font-medium hidden sm:inline'>Назад</span>
				</Link>
			</div>
			<span
				className={`shrink-0 inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium px-2 sm:px-2.5 py-1 rounded-full backdrop-blur-sm ${
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
			<div className='flex flex-1 justify-end min-w-0'>
				<ResetCameraLinkButton />
			</div>
		</header>
	)
}

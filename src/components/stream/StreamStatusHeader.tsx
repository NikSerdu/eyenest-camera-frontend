import type { FC } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

interface StreamStatusHeaderProps {
	isStreaming: boolean
}

export const StreamStatusHeader: FC<StreamStatusHeaderProps> = ({
	isStreaming,
}) => {
	return (
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
	)
}


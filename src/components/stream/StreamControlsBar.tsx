import type { FC } from 'react'
import { Radio, Square } from 'lucide-react'

interface StreamControlsBarProps {
	isStreaming: boolean
	isLoading: boolean
}

export const StreamControlsBar: FC<StreamControlsBarProps> = ({
	isStreaming,
	isLoading,
}) => {
	return (
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
	)
}


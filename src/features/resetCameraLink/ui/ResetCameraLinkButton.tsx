import type { FC } from 'react'
import { Unlink } from 'lucide-react'

import { useResetCameraLinkFlow } from '../model/hooks/useResetCameraLinkFlow'

type ResetCameraLinkButtonProps = {
	className?: string
}

export const ResetCameraLinkButton: FC<ResetCameraLinkButtonProps> = ({
	className,
}) => {
	const { mutate, isPending } = useResetCameraLinkFlow()

	const handleClick = () => {
		if (
			!window.confirm(
				'Отвязать камеру? Cookies будут очищены — потребуется снова привязать устройство.',
			)
		) {
			return
		}
		mutate()
	}

	return (
		<button
			type='button'
			onClick={handleClick}
			disabled={isPending}
			className={
				className ??
				'inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs sm:text-sm font-medium text-white/90 hover:bg-white/20 hover:text-white transition-colors disabled:opacity-50 min-touch-target'
			}
			aria-label='Отвязать камеру'
		>
			<Unlink className='w-4 h-4 shrink-0' />
			<span className='hidden sm:inline'>
				{isPending ? 'Отвязка...' : 'Отвязать'}
			</span>
		</button>
	)
}

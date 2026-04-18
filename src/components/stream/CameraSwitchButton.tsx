import type { FC } from 'react'
import { SwitchCamera } from 'lucide-react'
import { useCameraSwitch } from './useCameraSwitch'

export const CameraSwitchButton: FC = () => {
	const { isSupported, switchCamera } = useCameraSwitch()

	if (!isSupported) return null

	return (
		<button
			type='button'
			onClick={() => void switchCamera()}
			className='absolute bottom-24 sm:bottom-28 right-4 sm:right-6 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm text-white border border-white/20 shadow-lg hover:bg-black/70 active:scale-95 transition-all'
			aria-label='Переключить камеру'
			title='Переключить камеру'
		>
			<SwitchCamera className='w-5 h-5' />
		</button>
	)
}

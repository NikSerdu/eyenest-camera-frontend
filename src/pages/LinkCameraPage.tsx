import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { QrCode } from 'lucide-react'
import { QrScanner } from '../components/QrScanner'
import {
	useGetCameraIdByAccessToken,
	useLinkCamera,
} from '../api/hooks/camera/camera.hooks'

function parseCodeFromQr(data: string): string | null {
	try {
		const parsed = JSON.parse(data) as { code?: string; type?: string }
		if (parsed.code && typeof parsed.code === 'string')
			return parsed.code.trim()
	} catch {
		// not JSON
	}
	if (data.trim().length > 0) return data.trim()
	return null
}

export function LinkCameraPage() {
	const navigate = useNavigate()
	const [code, setCode] = useState('')
	const [mode, setMode] = useState<'code' | 'qr'>('code')
	const [error, setError] = useState('')

	// Not enabled on mount — fires only after explicit refetch()
	const { refetch } = useGetCameraIdByAccessToken({ enabled: false })

	const { mutate: linkCamera } = useLinkCamera({
		onSuccess: async () => {
			// Token accepted — fetch cameraId once and navigate
			const result = await refetch()
			const cameraId = result.data?.cameraId
			if (cameraId) {
				navigate(`/${encodeURIComponent(cameraId)}`)
			}
		},
		onError: () => {
			setError('Не удалось привязать камеру. Возможно, код устарел.')
		},
	})

	const handleSubmit = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault()
			const trimmed = code.trim()
			if (!trimmed) {
				setError('Введите код привязки')
				return
			}
			setError('')
			linkCamera({ token: trimmed })
		},
		[code, linkCamera],
	)

	const handleQrSuccess = useCallback(
		(data: string) => {
			const extracted = parseCodeFromQr(data)
			if (extracted) {
				setError('')
				linkCamera({ token: extracted })
			} else {
				setError('Неверный формат QR-кода')
			}
		},
		[linkCamera],
	)

	return (
		<div className='min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-6'>
			<div className='w-full max-w-md'>
				<div className='text-center mb-8'>
					<h1 className='text-2xl font-semibold text-slate-900'>
						Привязка камеры
					</h1>
					<p className='text-slate-600 mt-1'>
						Введите код из приложения или отсканируйте QR
					</p>
				</div>

				<div className='bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden'>
					{/* Tabs */}
					<div className='flex border-b border-slate-200'>
						<button
							type='button'
							onClick={() => setMode('code')}
							className={`flex-1 py-3 text-sm font-medium transition-colors ${
								mode === 'code'
									? 'text-brand-blue-600 border-b-2 border-brand-blue-500 bg-brand-blue-50/50'
									: 'text-slate-600 hover:bg-slate-50'
							}`}
						>
							Ввести код
						</button>
						<button
							type='button'
							onClick={() => setMode('qr')}
							className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
								mode === 'qr'
									? 'text-brand-blue-600 border-b-2 border-brand-blue-500 bg-brand-blue-50/50'
									: 'text-slate-600 hover:bg-slate-50'
							}`}
						>
							<QrCode className='w-4 h-4' />
							Сканировать QR
						</button>
					</div>

					<div className='p-6'>
						{mode === 'code' && (
							<form onSubmit={handleSubmit} className='space-y-4'>
								<div>
									<label
										htmlFor='link-code'
										className='block text-sm font-medium text-slate-700 mb-2'
									>
										Код привязки
									</label>
									<input
										id='link-code'
										type='text'
										value={code}
										onChange={e => {
											setCode(e.target.value)
											setError('')
										}}
										placeholder=''
										className='w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent'
									/>
									{error && (
										<p className='mt-2 text-sm text-error-500'>{error}</p>
									)}
								</div>
								<button
									type='submit'
									className='w-full py-3 rounded-xl bg-brand-blue-500 text-white font-medium hover:bg-brand-blue-600 active:bg-brand-blue-700 transition-colors'
								>
									Подключить
								</button>
							</form>
						)}

						{mode === 'qr' && (
							<div className='space-y-4'>
								<QrScanner onSuccess={handleQrSuccess} />
								{error && (
									<p className='text-sm text-error-500 text-center'>{error}</p>
								)}
							</div>
						)}
					</div>
				</div>

				<p className='text-center text-sm text-slate-500 mt-6'>
					Код вы получаете в основном приложении при добавлении камеры
				</p>
			</div>
		</div>
	)
}

import { useEffect, useRef, useId, useCallback } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

interface QrScannerProps {
	onSuccess: (data: string) => void
}

export function QrScanner({ onSuccess }: QrScannerProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const scannerRef = useRef<Html5Qrcode | null>(null)
	const firedRef = useRef(false)
	const stoppingRef = useRef(false)
	const onSuccessRef = useRef(onSuccess)
	const id = useId().replace(/:/g, '-')

	useEffect(() => {
		onSuccessRef.current = onSuccess
	})

	const stopScanner = useCallback((scanner: Html5Qrcode) => {
		if (stoppingRef.current) return
		stoppingRef.current = true
		scanner
			.stop()
			.then(() => scanner.clear())
			.catch(() => {})
	}, [])

	const handleDecode = useCallback(
		(decodedText: string) => {
			if (firedRef.current) return
			firedRef.current = true

			const scanner = scannerRef.current
			if (scanner) stopScanner(scanner)

			onSuccessRef.current(decodedText)
		},
		[stopScanner],
	)

	useEffect(() => {
		const el = containerRef.current
		if (!el) return

		firedRef.current = false
		stoppingRef.current = false

		const scanner = new Html5Qrcode(id)
		scannerRef.current = scanner

		scanner
			.start(
				{ facingMode: 'environment' },
				{ fps: 10, qrbox: { width: 220, height: 220 } },
				handleDecode,
				() => {},
			)
			.catch(err => {
				console.warn('QR scanner start error:', err)
			})

		return () => {
			if (scannerRef.current) {
				stopScanner(scannerRef.current)
				scannerRef.current = null
			}
		}
	}, [id, handleDecode, stopScanner])

	return (
		<div className='rounded-2xl overflow-hidden bg-slate-100 border border-slate-200'>
			<div ref={containerRef} id={id} className='min-h-[240px]' />
		</div>
	)
}

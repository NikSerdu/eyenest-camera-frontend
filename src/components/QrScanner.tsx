import { useEffect, useRef, useId } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

interface QrScannerProps {
	onSuccess: (data: string) => void
}

export function QrScanner({ onSuccess }: QrScannerProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const scannerRef = useRef<Html5Qrcode | null>(null)
	const id = useId().replace(/:/g, '-')

	useEffect(() => {
		const el = containerRef.current
		if (!el) return

		const scanner = new Html5Qrcode(id)
		scannerRef.current = scanner

		scanner
			.start(
				{ facingMode: 'environment' },
				{ fps: 10, qrbox: { width: 220, height: 220 } },
				(decodedText) => {
					onSuccess(decodedText)
				},
				() => {}
			)
			.catch((err) => {
				console.warn('QR scanner start error:', err)
			})

		return () => {
			scanner
				.stop()
				.then(() => {
					scanner.clear()
				})
				.catch(() => {})
			scannerRef.current = null
		}
	}, [id, onSuccess])

	return (
		<div className="rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
			<div ref={containerRef} id={id} className="min-h-[240px]" />
		</div>
	)
}

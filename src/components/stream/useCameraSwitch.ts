import { useCallback, useEffect, useState } from 'react'
import { useRoomContext } from '@livekit/components-react'

export const useCameraSwitch = () => {
	const room = useRoomContext()
	const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
	const [isSupported, setIsSupported] = useState(false)

	useEffect(() => {
		navigator.mediaDevices.enumerateDevices().then(devices => {
			const videoDevices = devices.filter(d => d.kind === 'videoinput')
			setIsSupported(videoDevices.length > 1)
		}).catch(() => {
			// fallback: assume multi-camera on mobile
			const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
			setIsSupported(isMobile)
		})
	}, [])

	const switchCamera = useCallback(async () => {
		const next: 'environment' | 'user' = facingMode === 'environment' ? 'user' : 'environment'

		try {
			// Get new stream with requested facingMode
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: { exact: next } },
			})

			const [videoTrack] = stream.getVideoTracks()
			if (!videoTrack) return

			// Replace track on the existing LiveKit local publication
			const localParticipant = room.localParticipant
			const publication = localParticipant.getTrackPublication('camera' as any)
			if (publication?.track) {
				await publication.track.replaceTrack(videoTrack)
			}

			setFacingMode(next)
		} catch {
			// If exact constraint fails, try without exact
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: { facingMode: next },
				})
				const [videoTrack] = stream.getVideoTracks()
				if (!videoTrack) return

				const localParticipant = room.localParticipant
				const publication = localParticipant.getTrackPublication('camera' as any)
				if (publication?.track) {
					await publication.track.replaceTrack(videoTrack)
					setFacingMode(next)
				}
			} catch (e) {
				console.warn('Camera switch failed:', e)
			}
		}
	}, [facingMode, room])

	return { facingMode, isSupported, switchCamera }
}

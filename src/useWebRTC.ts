import { useCallback, useEffect, useRef, useState } from 'react'
import { EVENTS } from './events'
import { io, type ManagerOptions, type SocketOptions } from 'socket.io-client'

const ICE_SERVERS = [
	{ urls: 'stun:85.193.91.142:3478' },
	{
		urls: 'turn:85.193.91.142:3478',
		username: 'testuser',
		credential: 'testpassword',
	},
]
const options: Partial<ManagerOptions & SocketOptions> = {
	transports: ['websocket'],
}

export const socketWebRTC = io('http://localhost:3000', options)

interface IUseWebRTC {
	roomID: string
}

export const useWebRTC = ({ roomID }: IUseWebRTC) => {
	const viewerPeerConnections = useRef<Record<string, RTCPeerConnection>>({})
	const cameraMediaStream = useRef<MediaStream | null>(null)
	const cameraMediaElement = useRef<HTMLVideoElement | null>(null)
	const [isStreaming, setIsStreaming] = useState(false)
	const handleAddViewerPeer = async ({ peerID }: { peerID: string }) => {
		const pc = new RTCPeerConnection({
			iceServers: ICE_SERVERS,
			iceCandidatePoolSize: 10, // Больше кандидатов
			iceTransportPolicy: 'all', // Пробовать все типы
		})
		viewerPeerConnections.current[peerID] = pc
		pc.oniceconnectionstatechange = async () => {
			console.log('ICE state:')
			await (
				await pc.getStats()
			).forEach(i => {
				if (i.type.includes('candi')) {
					console.log(i)
				}
			})
			if (
				pc.iceConnectionState === 'connected' ||
				pc.iceConnectionState === 'completed'
			) {
				const stats = await pc.getStats()

				stats.forEach(report => {
					if (
						report.type === 'candidate-pair' &&
						report.state === 'succeeded'
					) {
						const local = stats.get(report.localCandidateId)
						const remote = stats.get(report.remoteCandidateId)

						console.log('Selected ICE pair')
						console.log('Local candidate:', local)
						console.log('Remote candidate:', remote)

						console.log('Connection type:', local?.candidateType)
					}
				})
			}
		}
		if (cameraMediaStream.current) {
			cameraMediaStream.current.getTracks().forEach(track => {
				viewerPeerConnections.current[peerID].addTrack(
					track,
					cameraMediaStream.current!
				)
			})
		}

		viewerPeerConnections.current[peerID].onicecandidate = event => {
			if (event.candidate) {
				socketWebRTC.emit(EVENTS.RELAY_ICE, {
					peerID,
					iceCandidate: event.candidate,
				})
			}
		}
	}

	const handleRelaySDP = async ({
		peerID,
		sessionDescription,
	}: {
		peerID: string
		sessionDescription: RTCSessionDescriptionInit
	}) => {
		if (viewerPeerConnections.current[peerID]) {
			viewerPeerConnections.current[peerID].setRemoteDescription(
				new RTCSessionDescription(sessionDescription)
			)

			const answer = await viewerPeerConnections.current[peerID].createAnswer()
			viewerPeerConnections.current[peerID].setLocalDescription(answer)
			socketWebRTC.emit(EVENTS.RELAY_SDP, {
				peerID,
				sessionDescription: answer,
			})
		}
	}

	const handleRelayICE = ({
		peerID,
		iceCandidate,
	}: {
		peerID: string
		iceCandidate: RTCLocalIceCandidateInit
	}) => {
		if (viewerPeerConnections.current) {
			viewerPeerConnections.current[peerID].addIceCandidate(
				new RTCIceCandidate(iceCandidate)
			)
		}
	}

	const handleDeleteViewer = () => {}

	useEffect(() => {
		socketWebRTC.on(EVENTS.ADD_VIEWER_PEER, handleAddViewerPeer)
		return () => {
			socketWebRTC.off(EVENTS.ADD_VIEWER_PEER)
		}
	}, [])

	useEffect(() => {
		socketWebRTC.on(EVENTS.RELAY_SDP, handleRelaySDP)
		return () => {
			socketWebRTC.off(EVENTS.RELAY_SDP)
		}
	}, [])

	useEffect(() => {
		socketWebRTC.on(EVENTS.RELAY_ICE, handleRelayICE)
		return () => {
			socketWebRTC.off(EVENTS.RELAY_ICE)
		}
	}, [])

	useEffect(() => {
		socketWebRTC.on(EVENTS.DELETE_VIEWER, handleDeleteViewer)
		return () => {
			socketWebRTC.off(EVENTS.DELETE_VIEWER)
		}
	}, [])

	useEffect(() => {
		return () => {
			socketWebRTC.emit(EVENTS.LEAVE, { roomID })
		}
	}, [roomID])

	const startStream = useCallback(async () => {
		try {
			cameraMediaStream.current = await navigator.mediaDevices.getUserMedia({
				video: {
					width: 1280,
					height: 720,
				},
			})
			if (cameraMediaElement.current) {
				cameraMediaElement.current.srcObject = cameraMediaStream.current
			}
			socketWebRTC.emit(EVENTS.JOIN, { roomID, isCamera: true })
			setIsStreaming(true)
		} catch (e) {
			console.error('Error getting userMedia:', e)
		}
	}, [roomID])

	const stopStream = useCallback(() => {
		cameraMediaStream.current?.getTracks().forEach(track => track.stop())
		cameraMediaStream.current = null
		if (cameraMediaElement.current) {
			cameraMediaElement.current.srcObject = null
		}
		Object.values(viewerPeerConnections.current).forEach(pc => pc.close())
		viewerPeerConnections.current = {}
		socketWebRTC.emit(EVENTS.LEAVE, { roomID })
		setIsStreaming(false)
	}, [roomID])

	useEffect(() => {
		async function startCapture() {
			cameraMediaStream.current = await navigator.mediaDevices.getUserMedia({
				video: { width: 1280, height: 720 },
			})
			if (cameraMediaElement.current) {
				cameraMediaElement.current.srcObject = cameraMediaStream.current
			}
			socketWebRTC.emit(EVENTS.JOIN, { roomID, isCamera: true })
			setIsStreaming(true)
		}
		startCapture().catch(e => console.error('Error getting userMedia:', e))
		return () => {
			cameraMediaStream.current?.getTracks().forEach(track => track.stop())
			cameraMediaStream.current = null
			socketWebRTC.emit(EVENTS.LEAVE, { roomID })
		}
	}, [roomID])

	const provideMediaRef = useCallback((node: HTMLVideoElement | null) => {
		cameraMediaElement.current = node
	}, [])
	return {
		provideMediaRef,
		isStreaming,
		startStream,
		stopStream,
	}
}

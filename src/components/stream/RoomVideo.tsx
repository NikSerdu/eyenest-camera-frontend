import {
	useTracks,
	VideoTrack,
	type TrackReference,
} from '@livekit/components-react'
import { Track } from 'livekit-client'
import type { FC } from 'react'

export const RoomVideo: FC = () => {
	const tracks = useTracks(
		[
			{ source: Track.Source.Camera, withPlaceholder: false },
			{ source: Track.Source.ScreenShare, withPlaceholder: false },
		],
		{ onlySubscribed: false },
	)

	const trackRef = tracks
		.filter((t): t is TrackReference => !!t.publication)
		.sort(t => (t.publication.source === Track.Source.ScreenShare ? -1 : 1))[0]

	if (!trackRef) {
		return (
			<div className='flex items-center justify-center w-full h-full min-h-[240px] bg-slate-900 rounded-lg text-slate-400 text-sm'>
				Ожидание трансляции с камеры…
			</div>
		)
	}

	return (
		<div className='w-full h-full min-h-[240px] bg-black'>
			<VideoTrack
				trackRef={trackRef}
				className='h-full w-full object-contain'
			/>
		</div>
	)
}

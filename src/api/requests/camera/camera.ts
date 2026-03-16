import { authInstance } from '../../axios/authInstance'
import { baseInstance } from '../../axios/baseInstance'
import type {
	GetCameraIdByAccessTokenResponse,
	GetLiveKitCameraTokenResponse,
	LinkCameraRequest,
	LinkCameraResponse,
} from '../../generated'

export const linkCamera = (data: LinkCameraRequest) =>
	baseInstance
		.post<LinkCameraResponse>('/camera/linkCamera', data)
		.then(response => response.data)

export const getLiveKitCameraToken = (roomId: string) =>
	authInstance
		.get<GetLiveKitCameraTokenResponse>('/live_kit/getLiveKitCameraToken', {
			params: { roomId },
		})
		.then(response => response.data)

export const refreshCameraToken = () =>
	baseInstance
		.post<LinkCameraResponse>('/camera/refresh')
		.then(response => response.data)

export const getCameraIdByAccessToken = () =>
	authInstance
		.get<GetCameraIdByAccessTokenResponse>('/camera/getCameraIdByAccessToken')
		.then(response => response.data)

import {
	useMutation,
	useQuery,
	type UseMutationOptions,
	type UseQueryOptions,
} from '@tanstack/react-query'
import type {
	LinkCameraResponse,
	LinkCameraRequest,
	GetLiveKitCameraTokenResponse,
	GetCameraIdByAccessTokenResponse,
} from '../../generated'
import {
	getCameraIdByAccessToken,
	getLiveKitCameraToken,
	linkCamera,
} from '../../requests'

export const useLinkCamera = (
	options?: Omit<
		UseMutationOptions<LinkCameraResponse, unknown, LinkCameraRequest>,
		'mutationKey' | 'mutationFn'
	>,
) =>
	useMutation({
		mutationKey: ['link camera'],
		mutationFn: linkCamera,
		...options,
	})
export const useGetLiveKitCameraToken = (
	roomId: string,
	options?: Omit<
		UseQueryOptions<GetLiveKitCameraTokenResponse, unknown>,
		'queryKey' | 'queryFn'
	>,
) =>
	useQuery({
		queryKey: ['get live kit camera token'],
		queryFn: () => getLiveKitCameraToken(roomId),
		...options,
	})

export const useGetCameraIdByAccessToken = (
	options?: Omit<
		UseQueryOptions<GetCameraIdByAccessTokenResponse, unknown>,
		'queryKey' | 'queryFn'
	>,
) =>
	useQuery({
		queryKey: ['get camera id by access token'],
		queryFn: getCameraIdByAccessToken,
		...options,
	})

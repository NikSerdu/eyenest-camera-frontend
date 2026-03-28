import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useResetCameraLink } from '../../../../api/hooks'

export const useResetCameraLinkFlow = () => {
	const queryClient = useQueryClient()
	const navigate = useNavigate()

	return useResetCameraLink({
		onSuccess: () => {
			queryClient.removeQueries({ queryKey: ['get live kit camera token'] })
			queryClient.removeQueries({ queryKey: ['get camera id by access token'] })
			navigate('/', { replace: true })
		},
	})
}

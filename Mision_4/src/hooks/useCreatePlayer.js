import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPlayer } from '../services/playerService.js'
import { queryKeys } from './queryKeys.js'

export function useCreatePlayer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPlayer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.players }),
  })
}
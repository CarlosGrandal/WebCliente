import { useQuery } from '@tanstack/react-query'
import { getPlayers } from '../services/playerService.js'
import { queryKeys } from './queryKeys.js'

export function usePlayers() {
  return useQuery({
    queryKey: queryKeys.players,
    queryFn: getPlayers,
  })
}
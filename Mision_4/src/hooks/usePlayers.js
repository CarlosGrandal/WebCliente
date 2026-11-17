import { useQuery } from '@tanstack/react-query'
import { getPlayers } from '../services/playerService.js'
import { queryKeys } from './queryKeys.js'

export function usePlayers() {
  const simulateCorruptResponse = import.meta.env.DEV
    && new URLSearchParams(window.location.search).get('demo') === 'corrupt'

  return useQuery({
    queryKey: queryKeys.players,
    queryFn: () => getPlayers({ simulateCorruptResponse }),
  })
}
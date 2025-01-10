import { User } from '../types';
import { useGuestSummaries } from './useGuestSummaries';
import { useUserSummaries } from './useUserSummaries';

export function useSummaries(user: User | null) {
  const guestSummaries = useGuestSummaries();
  const userSummaries = useUserSummaries(user?.id);

  // Return guest or user summaries based on authentication status
  return user ? userSummaries : guestSummaries;
}
import { useContext } from 'react';
import { UserPreferencesContext } from '../context/UserPreferencesContext';

export function useUserPreferences() {
  return useContext(UserPreferencesContext);
}

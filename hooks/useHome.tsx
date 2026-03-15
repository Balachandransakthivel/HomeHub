import { useContext } from 'react';
import { HomeContext } from '@/contexts/HomeContext';

export function useHome() {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHome must be used within HomeProvider');
  }
  return context;
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workersAPI } from '../services/api';

export function useWorkers() {
  return useQuery({
    queryKey: ['workers'],
    queryFn: async () => {
      const response = await workersAPI.getAll();
      return response.data;
    }
  });
}

export function useCreateWorker() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: workersAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['workers']);
    }
  });
}

export function useDeleteWorker() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: workersAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['workers']);
    }
  });
}

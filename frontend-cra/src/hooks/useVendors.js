import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vendorsAPI } from '../services/api';

export function useVendors() {
  return useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const response = await vendorsAPI.getAll();
      return response.data;
    }
  });
}

export function useCreateVendor() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: vendorsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['vendors']);
    }
  });
}

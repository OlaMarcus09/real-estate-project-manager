import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsAPI } from '../services/api';

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await projectsAPI.getAll();
      return data;
    }
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: projectsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
    }
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...project }) => projectsAPI.update(id, project),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
    }
  });
}
import { useQuery } from "@tanstack/react-query";
import { getPhotos } from "../api/photos";

export const usePhotos = () => {
  return useQuery({
    queryKey: ["photos"],
    queryFn: getPhotos, // Axois response interceptor already extracted .data
    staleTime: 1000 * 60 * 5,
  });
};

// Mutation hook for creating data
/* export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    // When successful, force a background refresh on the 'users' query list
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}; */

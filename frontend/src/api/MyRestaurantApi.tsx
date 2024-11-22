import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useCreateMyRestaurant = () => {
    const { getAccessTokenSilently } = useAuth0();

    const createMyRestaurantRequest = async (restaurantFormData: FormData)=>{
        const accessToken = await getAccessTokenSilently();
        
        const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: restaurantFormData,
          });

          if (!response.ok) {
            throw new Error("Không tìm được nhà hàng");
          }
          return response.json();

    };

    const {
        mutate: createRestaurant,
        isLoading,
        isSuccess,
        error,
      } = useMutation(createMyRestaurantRequest);

    if (isSuccess) {
        toast.success("Đã tạo nhà hàng!");
    }
    if (error) {
        toast.error("Không thể cập nhật nhà hàng");
    }
    return { createRestaurant, isLoading };
};
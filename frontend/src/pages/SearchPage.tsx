
import { useSearchRestaurants } from "@/api/RestaurantApi";
import { useParams } from "react-router-dom";

const SearchPage = () => {
  const { city } = useParams();
  const {results} = useSearchRestaurants(city)

  return (
  <span> 
    Người dùng đã tìm kiếm thành phố {city}{""}
    {results?.data.map((restaurant) =>(
        <span>
            Đã tìm thấy - {restaurant.restaurantName}, {restaurant.city}
        </span>
    ))}
    </span>
    )
}
export default SearchPage;
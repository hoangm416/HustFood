
import { useParams } from "react-router-dom";

const SearchPage = () => {
  const { city } = useParams();
  return <span> Người dùng đã tìm kiếm thành phố {city}</span>
}
export default SearchPage;
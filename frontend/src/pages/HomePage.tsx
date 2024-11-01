import landingImage from "../assets/landing.png";
import appDownloadImage from "../assets/appDownload.png";
import SearchBar, {SearchForm} from "@/components/SearchBar";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleSearchSubmit = (searchFormValues: SearchForm) => {
    navigate({
      pathname: `/search/${searchFormValues.searchQuery}`,
    });
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="md:px-32 bg-white rounded-lg shadow-md py-8 flex flex-col gap-5 text-center -mt-16">
        <h1 className="text-5xl font-bold tracking-tight text-orange-600">
          Thưởng thức đồ mang về ngay hôm nay
        </h1>
        <span className="text-xl">Chỉ một cú nhấp chuột có ngay món bạn muốn</span>
        <SearchBar 
        placeHolder="Nhập tên thành phố hoặc thị trấn" 
        onSubmit={handleSearchSubmit}
        />

      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <img src={landingImage} />
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <span className="font-bold text-3xl tracking-tighter">
            Đặt đồ ăn mang về còn nhanh hơn nữa
          </span>
          <span>
            Tải ứng dụng HustFood để đặt hàng nhanh hơn và nhận được nhiều đề xuất hơn
          </span>
          <img src={appDownloadImage} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
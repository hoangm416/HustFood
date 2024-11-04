
import { useSearchRestaurants } from "@/api/RestaurantApi";
import SearchBar, { SearchForm } from "@/components/SearchBar";
import SearchResultCard from "@/components/SearchResultCard";
import SearchResultInfo from "@/components/SearchResultInfo";
import { useState } from "react";
import { useParams } from "react-router-dom";

export type SearchState = {
  searchQuery: string;
};


const SearchPage = () => {
  const { city } = useParams();
  const [searchState, setSearchState] = useState<SearchState>({
    searchQuery: "",
  });
  
  const {results, isLoading} = useSearchRestaurants(searchState, city)

  const setSearchQuery = (searchFormData: SearchForm) => {
    setSearchState((prevState) => ({
      ...prevState,
      searchQuery: searchFormData.searchQuery,
    }));
  };
  
  const resetSearch = () => {
    setSearchState((prevState) => ({
      ...prevState,
      searchQuery: "",
    }));
  };

  if (isLoading) {
    <span>Đang tải.....</span>;
  }

  if (!results?.data || !city) {
    return <span>Không tìm thấy kết quả</span>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
        <div id="cuisines-list">Thêm các món ăn ở đây</div>
        <div id="main-content" className="flex flex-col gap-5"></div>
        <SearchBar 
        searchQuery={searchState.searchQuery}
        placeHolder="Tìm kiếm món ăn hoặc tên cửa hàng"
        onReset={resetSearch}
        onSubmit={setSearchQuery}
        />
        <SearchResultInfo total={results.pagination.total} city={city} />
        {results.data.map((restaurant) => (
          <SearchResultCard restaurant={restaurant} />
        ))}
    </div>
    )
}
export default SearchPage;
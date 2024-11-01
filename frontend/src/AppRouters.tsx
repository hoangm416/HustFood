
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/layout";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={ <Layout><HomePage/></Layout>} />
      <Route path="/user-profile" element={<span>USER PROFILE PAGE</span>} />
      <Route path="*" element={<Navigate to="/" />} />
      <Route path="/search/:city" element={
        <Layout showHero={false}>
          <SearchPage />
        </Layout>}
        />
    </Routes>
  );
};

export default AppRoutes;

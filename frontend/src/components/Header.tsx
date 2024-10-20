import { Link } from "lucide-react";
import MobileNav from "./MobileNav";

const Header = () => {
  return (
    <div className="border-b-2 border-b-orange-500 py-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-3xl font-bold tracking-tight text-orange-500"
        >
          HustFood.com
        </Link>
        <div className="md:hidden">
            <MobileNav />
        </div>
        <dis className="hidden md:block">
          <MainNav />
        </dis>
        </div>
      </div>
  );
};

export default Header;
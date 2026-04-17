import "./App.css";
import React, { createContext, useContext, useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Header from "./Components/Header";
import SideBar from "./Components/SideBar";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Products from "./Pages/Products";
import HomeSliderBanners from "./Pages/HomeSliderBanners";
import AddHomeSlide from "./Pages/HomeSliderBanners/addHomeSlide";
import Categegory from "./Pages/Categegory";
import SubCatList from "./Pages/Categegory/subCatList";
import Users from "./Pages/Users";
import Orders from "./Pages/Orders";
import ForgotPassword from "./Pages/ForgotPassword";
import VerifyAccount from "./Pages/VerifyAccount";
import ChangePassword from "./Pages/ChangePassword";
import toast, { Toaster } from "react-hot-toast";
import { fetchDataFromApi } from "./utils/api";
import Profile from "./Pages/Profile";
import ProductDetails from "./Pages/Products/productDetails";
import AddRams from "./Pages/Products/addRams";
import AddWeight from "./Pages/Products/addWeight";
import AddSize from "./Pages/Products/addSize";
import BannersV1List from "./Pages/Banners";
import BlogList from "./Pages/Blog";
import ProtectedRoute from "./Components/ProtectedRoute";

// ✅ Khai báo context ở ngoài hàm App
const MyContext = createContext();

// ✅ Layout dùng chung cho các route có sidebar
const MainLayout = ({ children }) => {
  const context = useContext(MyContext);

  return (
    <section className="main">
      <Header />
      <div className="contentMain flex min-h-screen pt-[72px]">
        <SideBar />

        {context.isSiderOpen === true && (
          <button
            type="button"
            aria-label="Close sidebar overlay"
            className="fixed inset-0 top-[72px] z-30 bg-slate-950/35 xl:hidden"
            onClick={() => context.setIsSiderOpen(false)}
          />
        )}

        <div
          className={`sidebarWrapper hidden shrink-0 transition-all duration-300 xl:block ${
            context.isSiderOpen === true ? "xl:w-[250px]" : "xl:w-0"
          }`}
        />

        <div className="contentRight min-w-0 flex-1 px-3 py-4 sm:px-4 lg:px-5">
          <ProtectedRoute>{children}</ProtectedRoute>
        </div>
      </div>
    </section>
  );
};

function App() {
  const [isSiderOpen, setIsSiderOpen] = useState(true);
  const [islogin, setIsLogin] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // ✅ thêm loading auth
  const [userData, setUserData] = useState(null);
  const [address, setAddress] = useState([]);
  const [catData, setCatData] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [isOpenFullScreenPanel, setIsOpenFullScreenPanel] = useState({
    open: false,
    id: "",
  });

  const alertBox = (type, msg) => {
    if (type === "success") toast.success(msg);
    if (type === "error") toast.error(msg);
  };

  // ✅ Check auth khi mount — fix race condition
  useEffect(() => {
    const token = localStorage.getItem("accesstoken");

    if (token !== undefined && token !== null && token !== "") {
      fetchDataFromApi(`/api/user/user-details`).then((res) => {
        if (res?.error === true) {
          setUserData(null);
          alertBox(
            "error",
            res?.message || "Your session is closed please login again",
          );
          setIsLogin(false);
        } else {
          setUserData(res?.data);
          setIsLogin(true);
        }
        setIsCheckingAuth(false); // ✅ xong mới cho render
      });
    } else {
      setIsLogin(false);
      setIsCheckingAuth(false); // ✅ không có token cũng phải set false
    }
  }, []); // ✅ chỉ chạy 1 lần khi mount

  useEffect(() => {
    getCat();
  }, []);

  useEffect(() => {
    const syncSidebarWithViewport = () => {
      if (window.innerWidth < 1280) {
        setIsSiderOpen(false);
      }
    };

    syncSidebarWithViewport();
    window.addEventListener("resize", syncSidebarWithViewport);

    return () => window.removeEventListener("resize", syncSidebarWithViewport);
  }, []);

  const getCat = () => {
    fetchDataFromApi(`/api/category`).then((res) => {
      if (res?.error === false || Array.isArray(res?.data)) {
        setCatData(res?.data);
      }
    });
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <MainLayout>
          <Dashboard />
        </MainLayout>
      ),
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/sign-up",
      element: <SignUp />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/verify-account",
      element: <VerifyAccount />,
    },
    {
      path: "/change-password",
      element: <ChangePassword />,
    },
    {
      path: "/products",
      element: (
        <MainLayout>
          <Products />
        </MainLayout>
      ),
    },
    {
      path: "/homeSlider/list",
      element: (
        <MainLayout>
          <HomeSliderBanners />
        </MainLayout>
      ),
    },
    {
      path: "/homeSlider/add",
      element: (
        <MainLayout>
          <AddHomeSlide />
        </MainLayout>
      ),
    },
    {
      path: "/category/list",
      element: (
        <MainLayout>
          <Categegory />
        </MainLayout>
      ),
    },
    {
      path: "/subCategory/list",
      element: (
        <MainLayout>
          <SubCatList />
        </MainLayout>
      ),
    },
    {
      path: "/user",
      element: (
        <MainLayout>
          <Users />
        </MainLayout>
      ),
    },
    {
      path: "/orders",
      element: (
        <MainLayout>
          <Orders />
        </MainLayout>
      ),
    },
    {
      path: "/profile",
      element: (
        <MainLayout>
          <Profile />
        </MainLayout>
      ),
    },
    {
      path: "/product/:id",
      element: (
        <MainLayout>
          <ProductDetails />
        </MainLayout>
      ),
    },
    {
      path: "/product/addRams",
      element: (
        <MainLayout>
          <AddRams />
        </MainLayout>
      ),
    },
    {
      path: "/product/addWeight",
      element: (
        <MainLayout>
          <AddWeight />
        </MainLayout>
      ),
    },
    {
      path: "/product/addSize",
      element: (
        <MainLayout>
          <AddSize />
        </MainLayout>
      ),
    },
    {
      path: "/bannerV1/list",
      element: (
        <MainLayout>
          <BannersV1List />
        </MainLayout>
      ),
    },
    {
      path: "/blog/list",
      element: (
        <MainLayout>
          <BlogList />
        </MainLayout>
      ),
    },
  ]);

  const values = {
    isSiderOpen,
    setIsSiderOpen,
    islogin,
    setIsLogin,
    isCheckingAuth, // ✅ thêm
    isOpenFullScreenPanel,
    setIsOpenFullScreenPanel,
    alertBox,
    userData,
    setUserData,
    address,
    setAddress,
    catData,
    setCatData,
    getCat,
    refreshData,
    setRefreshData,
  };

  return (
    <MyContext.Provider value={values}>
      <RouterProvider router={router} />
      <Toaster />
    </MyContext.Provider>
  );
}

export default App;
export { MyContext }; // ✅ export hợp lệ

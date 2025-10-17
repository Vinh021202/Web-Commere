import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Header from "./Components/Header";
import SideBar from "./Components/SideBar";
import { createContext, useState } from "react";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";

// ✅ Khai báo context ở ngoài hàm App
const MyContext = createContext();

function App() {
  const [isSiderOpen, setIsSiderOpen] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${
                  isSiderOpen === true ? "w-[18%]" : "w-[0px] opacity-0"
                } transition-all`}
              >
                <SideBar />
              </div>
              <div
                className={`contentRight py-4 px-5  ${
                  isSiderOpen === false ? "w-[100%]" : "w-[82%]"
                } transition-all`}
              >
                <Dashboard />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/Login",
      element: (
        <>
          <Login />
        </>
      ),
    },
    {
      path: "/sign-up",
      element: (
        <>
          <SignUp />
        </>
      ),
    },
  ]);

  const values = { isSiderOpen, setIsSiderOpen, isLogin, setIsLogin };

  return (
    <MyContext.Provider value={values}>
      <RouterProvider router={router} />
    </MyContext.Provider>
  );
}

export default App;
export { MyContext }; // ✅ Bây giờ hợp lệ

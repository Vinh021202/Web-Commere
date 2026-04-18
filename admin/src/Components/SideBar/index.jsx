import Button from "@mui/material/Button";
import React, { useContext, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { FaRegImage, FaBlog } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { RiProductHuntLine } from "react-icons/ri";
import { TbCategory } from "react-icons/tb";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";
import { Collapse } from "react-collapse";
import { MyContext } from "../../App";
import { fetchDataFromApi } from "../../utils/api";

const SideBar = () => {
  const [submenuIndex, setSubMenuIndex] = useState(null);
  const context = useContext(MyContext);
  const location = useLocation();
  const navigate = useNavigate();

  const Logout = () => {
    fetchDataFromApi(
      `/api/user/logout?token=${localStorage.getItem("accesstoken")}`,
      {
        withCredentials: true,
      },
    ).then((res) => {
      if (res?.error === false) {
        context.setIsLogin(false);
        localStorage.removeItem("accesstoken", res?.accesstoken);
        localStorage.removeItem("refreshToken", res?.refreshToken);
        navigate("/login");
      }
    });
  };

  const isOpenSubMenu = (index) => {
    setSubMenuIndex((prev) => (prev === index ? null : index));
  };

  const menuItems = useMemo(
    () => [
      {
        type: "link",
        label: context.t("dashboard", "Dashboard"),
        icon: <RxDashboard className="text-[18px]" />,
        to: "/",
      },
      {
        type: "group",
        index: 1,
        label: context.t("homeSliders", "Home Sliders"),
        icon: <FaRegImage className="text-[18px]" />,
        children: [
          { label: context.t("homeBannerList", "Home Banner List"), to: "/homeSlider/list" },
          {
            label: context.t("addHomeBannerSlide", "Add Home Banner Slide"),
            action: () =>
              context.setIsOpenFullScreenPanel({
                open: true,
                model: "Add HomeSlide",
              }),
          },
        ],
      },
      {
        type: "link",
        label: context.t("users", "Users"),
        icon: <FiUsers className="text-[18px]" />,
        to: "/user",
      },
      {
        type: "group",
        index: 3,
        label: context.t("products", "Products"),
        icon: <RiProductHuntLine className="text-[20px]" />,
        children: [
          { label: context.t("productsList", "Products List"), to: "/products" },
          {
            label: context.t("productsUpload", "Products Upload"),
            action: () =>
              context.setIsOpenFullScreenPanel({
                open: true,
                model: "Add Product",
              }),
          },
          { label: context.t("addProductsRams", "Add Products Rams"), to: "/product/addRams" },
          { label: context.t("addProductsWeight", "Add Products Weight"), to: "/product/addWeight" },
          { label: context.t("addProductsSize", "Add Products Size"), to: "/product/addSize" },
        ],
      },
      {
        type: "group",
        index: 4,
        label: context.t("category", "Category"),
        icon: <TbCategory className="text-[20px]" />,
        children: [
          { label: context.t("categoryList", "Category List"), to: "/category/list" },
          {
            label: context.t("addNewCategory", "Add New Category"),
            action: () =>
              context.setIsOpenFullScreenPanel({
                open: true,
                model: "Add New Category",
              }),
          },
          { label: context.t("subCategoryList", "Sub Category List"), to: "/subCategory/list" },
          {
            label: context.t("addNewSubCategory", "Add New Sub Category"),
            action: () =>
              context.setIsOpenFullScreenPanel({
                open: true,
                model: "Add New Sub Category",
              }),
          },
        ],
      },
      {
        type: "link",
        label: context.t("orders", "Orders"),
        icon: <IoBagCheckOutline className="text-[20px]" />,
        to: "/orders",
      },
      {
        type: "group",
        index: 5,
        label: context.t("banners", "Banners"),
        icon: <TbCategory className="text-[20px]" />,
        children: [
          { label: context.t("bannerV1List", "Banner V1 List"), to: "/bannerV1/list" },
          {
            label: context.t("addBannerV1", "Add Banner V1"),
            action: () =>
              context.setIsOpenFullScreenPanel({
                open: true,
                model: "Add BannerV1",
              }),
          },
        ],
      },
      {
        type: "group",
        index: 6,
        label: context.t("blog", "Blog"),
        icon: <FaBlog className="text-[18px]" />,
        children: [
          { label: context.t("blogList", "Blog List"), to: "/blog/list" },
          {
            label: context.t("addBlog", "Add Blog"),
            action: () =>
              context.setIsOpenFullScreenPanel({
                open: true,
                model: "Add Blog",
              }),
          },
        ],
      },
      {
        type: "button",
        label: context.t("logout", "Logout"),
        icon: <IoMdLogOut className="text-[20px]" />,
        action: Logout,
      },
    ],
    [context, navigate],
  );

  const isActiveLink = (to) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  const isActiveGroup = (children = []) =>
    children.some((child) => child.to && isActiveLink(child.to));

  return (
    <div
      className={`sidebar fixed left-0 top-[72px] z-40 h-[calc(100vh-72px)] w-[280px] max-w-[86vw] overflow-y-auto border-r border-[#ebe5d9] bg-[linear-gradient(180deg,_#f8f6f1_0%,_#f4efe5_100%)] px-3 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.14)] transition-transform duration-300 xl:w-[250px] xl:max-w-[250px] ${
        context.isSiderOpen === true
          ? "translate-x-0"
          : "-translate-x-full xl:-translate-x-full"
      }`}
    >
      <div className="rounded-[20px] border border-white/75 bg-white/72 p-3.5 shadow-[0_12px_26px_rgba(15,23,42,0.05)] backdrop-blur">
        <p className="text-[11px] font-[700] uppercase tracking-[0.22em] text-slate-400">
          {context.t("navigation", "Navigation")}
        </p>
        <h3 className="mt-1.5 text-[16px] font-[800] leading-5 text-[#14213d]">
          {context.t("manageWorkspace", "Manage your workspace")}
        </h3>
      </div>

      <ul className="mt-4 space-y-1.5">
        {menuItems.map((item) => {
          if (item.type === "link") {
            const active = isActiveLink(item.to);

            return (
              <li key={item.label}>
                <Link to={item.to}>
                  <Button
                    className={`!flex !w-full !items-center !justify-start !gap-2.5 !rounded-[16px] !px-3 !py-2.5 !text-[13px] !font-[800] !capitalize !transition-all ${
                      active
                        ? "!bg-[linear-gradient(135deg,_#14213d,_#3872fa)] !text-white shadow-[0_14px_30px_rgba(56,114,250,0.22)]"
                        : "!bg-white/70 !text-[#24324d] hover:!bg-white"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-[12px] ${
                        active
                          ? "bg-white/14 text-white"
                          : "bg-[#eef3ff] text-[#3872fa]"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Button>
                </Link>
              </li>
            );
          }

          if (item.type === "group") {
            const active = isActiveGroup(item.children);
            const opened = submenuIndex === item.index;

            return (
              <li key={item.label}>
                <Button
                  className={`!flex !w-full !items-center !justify-start !gap-2.5 !rounded-[16px] !px-3 !py-2.5 !text-[13px] !font-[800] !capitalize !transition-all ${
                    active || opened
                      ? "!bg-white !text-[#14213d] shadow-[0_12px_28px_rgba(15,23,42,0.06)]"
                      : "!bg-transparent !text-[#24324d] hover:!bg-white/80"
                  }`}
                  onClick={() => isOpenSubMenu(item.index)}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-[12px] ${
                      active || opened
                        ? "bg-[#eef3ff] text-[#3872fa]"
                        : "bg-white/70 text-[#4b5563]"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                  <span className="ml-auto flex h-7 w-7 items-center justify-center rounded-[10px] bg-[#f6f8ff]">
                    <FaAngleDown
                      className={`text-[13px] text-[#3872fa] transition-all ${
                        opened ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                </Button>

                <Collapse isOpened={opened}>
                  <ul className="mt-1.5 space-y-1 pl-2.5">
                    {item.children.map((child) => {
                      const activeChild = child.to ? isActiveLink(child.to) : false;

                      if (child.to) {
                        return (
                          <li key={child.label}>
                            <Link to={child.to}>
                              <Button
                                className={`!flex !w-full !items-center !justify-start !gap-2.5 !rounded-[14px] !px-3 !py-2 !text-[12px] !font-[700] !capitalize ${
                                  activeChild
                                    ? "!bg-[#e9f0ff] !text-[#1d4ed8]"
                                    : "!bg-transparent !text-slate-500 hover:!bg-white/70"
                                }`}
                              >
                                <span
                                  className={`block h-[6px] w-[6px] rounded-full ${
                                    activeChild ? "bg-[#3872fa]" : "bg-slate-300"
                                  }`}
                                />
                                {child.label}
                              </Button>
                            </Link>
                          </li>
                        );
                      }

                      return (
                        <li key={child.label}>
                          <Button
                            className="!flex !w-full !items-center !justify-start !gap-2.5 !rounded-[14px] !px-3 !py-2 !text-[12px] !font-[700] !capitalize !text-slate-500 hover:!bg-white/70"
                            onClick={child.action}
                          >
                            <span className="block h-[6px] w-[6px] rounded-full bg-slate-300" />
                            {child.label}
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                </Collapse>
              </li>
            );
          }

          return (
            <li key={item.label} className="pt-1.5">
              <Button
                onClick={item.action}
                className="!flex !w-full !items-center !justify-start !gap-2.5 !rounded-[16px] !border !border-[#ffd9d9] !bg-[#fff5f5] !px-3 !py-2.5 !text-[13px] !font-[800] !capitalize !text-[#dc2626] hover:!bg-[#ffe9e9]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-[12px] bg-white text-[#ef4444]">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SideBar;

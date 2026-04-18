import React, { useContext, useMemo, useState, forwardRef } from "react";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { FaRegBell, FaRegUser } from "react-icons/fa";
import { IoMdClose, IoMdLogOut } from "react-icons/io";
import { HiOutlineSparkles } from "react-icons/hi2";
import { RiMenu2Line } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import { fetchDataFromApi } from "../../utils/api";
import AddProduct from "../../Pages/Products/addProduct";
import AddHomeSlide from "../../Pages/HomeSliderBanners/addHomeSlide";
import AddCategory from "../../Pages/Categegory/addCategory";
import AddSubCategory from "../../Pages/Categegory/addSubCategory";
import AddAddress from "../../Pages/Address";
import EditCategory from "../../Pages/Categegory/editCategory";
import EditProduct from "../../Pages/Products/editProduct";
import AddBannerV1 from "../../Pages/Banners/addBannerV1";
import EditBannerV1 from "../../Pages/Banners/editBannerV1";
import AddBlog from "../../Pages/Blog/addBlog";
import EditBlog from "../../Pages/Blog/editBlog";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 2,
    top: 8,
    minWidth: 18,
    height: 18,
    borderRadius: 999,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
    fontWeight: 700,
  },
}));

const Header = () => {
  const [anchorElMyAcc, setAnchorElMyAcc] = useState(null);
  const openMyAcc = Boolean(anchorElMyAcc);
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClickMyAcc = (event) => {
    setAnchorElMyAcc(event.currentTarget);
  };

  const handleCloseMyAcc = () => {
    setAnchorElMyAcc(null);
  };

  const Logout = () => {
    setAnchorElMyAcc(null);

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

  const pageMeta = useMemo(() => {
    if (location.pathname.startsWith("/category")) {
      return {
        eyebrow: context.t("catalog", "Catalog"),
        title: context.t("categoryWorkspace", "Category Workspace"),
      };
    }

    if (location.pathname.startsWith("/subCategory")) {
      return {
        eyebrow: context.t("catalog", "Catalog"),
        title: context.t("subCategoryWorkspace", "Sub Category Workspace"),
      };
    }

    if (location.pathname.startsWith("/products")) {
      return {
        eyebrow: context.t("commerce", "Commerce"),
        title: context.t("productManager", "Product Manager"),
      };
    }

    if (location.pathname.startsWith("/orders")) {
      return {
        eyebrow: context.t("commerce", "Commerce"),
        title: context.t("orderTracking", "Order Tracking"),
      };
    }

    if (location.pathname.startsWith("/blog")) {
      return {
        eyebrow: context.t("content", "Content"),
        title: context.t("blogPublisher", "Blog Publisher"),
      };
    }

    return {
      eyebrow: context.t("dashboard", "Dashboard"),
      title: context.t("adminControlCenter", "Admin Control Center"),
    };
  }, [context, location.pathname]);

  const currentPanelTitle =
    context?.isOpenFullScreenPanel?.model || context.t("workspace", "Workspace");

  return (
    <>
      <header className="fixed left-0 top-0 z-50 w-full border-b border-white/60 bg-[linear-gradient(180deg,_rgba(248,250,252,0.96),_rgba(255,255,255,0.92))] px-3 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur xl:px-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              className="!min-w-[46px] !rounded-[16px] !bg-white !p-0 !text-[#14213d] shadow-[0_10px_24px_rgba(15,23,42,0.06)] hover:!bg-[#f8fbff]"
              onClick={() => context.setIsSiderOpen(!context.isSiderOpen)}
            >
              <span className="flex h-[46px] w-[46px] items-center justify-center">
                <RiMenu2Line className="text-[20px]" />
              </span>
            </Button>

            <Link
              to="/"
              className="hidden items-center rounded-[20px] border border-white/70 bg-white px-3 py-2 shadow-[0_12px_26px_rgba(15,23,42,0.06)] sm:flex"
            >
              <img
                src="/logo.png"
                alt="logo"
                className="h-[50px] w-auto object-contain"
              />
            </Link>

            <div className="min-w-0 rounded-[22px] border border-white/70 bg-[linear-gradient(135deg,_#ffffff,_#f4f8ff)] px-4 py-2.5 shadow-[0_12px_26px_rgba(15,23,42,0.05)]">
              <p className="truncate text-[11px] font-[800] uppercase tracking-[0.18em] text-[#3872fa]">
                {pageMeta.eyebrow}
              </p>
              <h2 className="truncate text-[15px] font-[900] text-[#14213d] sm:text-[17px]">
                {pageMeta.title}
              </h2>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden items-center rounded-[18px] border border-white/70 bg-white p-1 shadow-[0_10px_24px_rgba(15,23,42,0.05)] md:flex">
              {["VN", "EU"].map((lang) => {
                const active = context.language === lang;

                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => context.setLanguage(lang)}
                    className={`rounded-[14px] px-3 py-2 text-[12px] font-[900] transition-all ${
                      active
                        ? "bg-[linear-gradient(135deg,_#14213d,_#3872fa)] text-white shadow-[0_10px_24px_rgba(56,114,250,0.18)]"
                        : "text-slate-500 hover:bg-[#f4f8ff]"
                    }`}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>

            <div className="hidden items-center gap-2 rounded-[18px] border border-white/70 bg-white px-3 py-2 shadow-[0_10px_24px_rgba(15,23,42,0.05)] lg:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,_#14213d,_#3872fa)] text-white">
                <HiOutlineSparkles className="text-[18px]" />
              </div>
              <div>
                <p className="text-[11px] font-[800] uppercase tracking-[0.12em] text-slate-400">
                  {context.t("workspace", "Workspace")}
                </p>
                <p className="text-[13px] font-[700] text-[#14213d]">
                  {context.t("everythingLooksSynced", "Everything looks synced")}
                </p>
              </div>
            </div>

            <IconButton
              aria-label="notifications"
              className="!h-[46px] !w-[46px] !rounded-[16px] !border !border-white/70 !bg-white !text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
            >
              <StyledBadge badgeContent={4} color="secondary">
                <FaRegBell className="text-[18px]" />
              </StyledBadge>
            </IconButton>

            {context.islogin === true ? (
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center gap-3 rounded-[20px] border border-white/70 bg-white py-1.5 pl-1.5 pr-3 shadow-[0_12px_26px_rgba(15,23,42,0.06)] transition-all hover:shadow-[0_14px_28px_rgba(15,23,42,0.08)]"
                  onClick={handleClickMyAcc}
                >
                  <div className="h-[42px] w-[42px] overflow-hidden rounded-[15px] ring-2 ring-[#eef4ff]">
                    <img
                      src={context?.userData?.avatar || "/user.jpg"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="hidden text-left md:block">
                    <h3 className="max-w-[180px] truncate text-[14px] font-[800] leading-4 text-[#14213d]">
                      {context?.userData?.name || "Admin User"}
                    </h3>
                    <p className="mt-1 max-w-[180px] truncate text-[11px] font-[600] text-slate-400">
                      {context?.userData?.email || "Account"}
                    </p>
                  </div>
                </button>

                <Menu
                  anchorEl={anchorElMyAcc}
                  id="account-menu"
                  open={openMyAcc}
                  onClose={handleCloseMyAcc}
                  onClick={handleCloseMyAcc}
                  slotProps={{
                    paper: {
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        borderRadius: "22px",
                        border: "1px solid #e8edf5",
                        backgroundColor: "rgba(255,255,255,0.98)",
                        backdropFilter: "blur(18px)",
                        boxShadow: "0 24px 50px rgba(15,23,42,0.14)",
                        mt: 1.8,
                        minWidth: 320,
                        p: 0.8,
                        "&::before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 24,
                          width: 14,
                          height: 14,
                          bgcolor: "#ffffff",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                          borderLeft: "1px solid #e8edf5",
                          borderTop: "1px solid #e8edf5",
                        },
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem className="!rounded-[18px] !bg-[linear-gradient(135deg,_#ffffff,_#f8fbff)] !px-3 !py-3">
                    <div className="flex w-full items-center gap-3">
                      <div className="h-[48px] w-[48px] overflow-hidden rounded-[16px] ring-2 ring-[#eef4ff]">
                        <img
                          src={context?.userData?.avatar || "/user.jpg"}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-[16px] font-[800] leading-5 text-[#14213d]">
                          {context?.userData?.name || "Admin User"}
                        </h3>
                        <p className="mt-1 truncate text-[13px] font-[500] text-slate-500">
                          {context?.userData?.email || "No email"}
                        </p>
                      </div>
                    </div>
                  </MenuItem>

                  <Divider sx={{ my: 1, borderColor: "#edf2f7" }} />

                  <Link to="/profile">
                    <MenuItem className="!mx-1 !mb-1 !flex !items-center !gap-3 !rounded-[16px] !px-3 !py-2.5 hover:!bg-[#f4f8ff]">
                      <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#eef4ff] text-[#3872fa]">
                        <FaRegUser className="text-[16px]" />
                      </div>
                      <div>
                        <span className="block text-[14px] font-[700] text-[#14213d]">
                          {context.t("profile", "Profile")}
                        </span>
                        <span className="block text-[12px] text-slate-400">
                          {context.t("manageYourAccount", "Manage your account")}
                        </span>
                      </div>
                    </MenuItem>
                  </Link>

                  <MenuItem
                    onClick={Logout}
                    className="!mx-1 !flex !items-center !gap-3 !rounded-[16px] !px-3 !py-2.5 hover:!bg-[#fff5f5]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#fff1f1] text-[#ef4444]">
                      <IoMdLogOut className="text-[16px]" />
                    </div>
                    <div>
                      <span className="block text-[14px] font-[700] text-[#14213d]">
                        {context.t("signOut", "Sign Out")}
                      </span>
                      <span className="block text-[12px] text-slate-400">
                        {context.t("endCurrentSession", "End current session")}
                      </span>
                    </div>
                  </MenuItem>
                </Menu>
              </div>
            ) : (
              <Link to="/login">
                <Button className="!rounded-[16px] !bg-[linear-gradient(135deg,_#14213d,_#3872fa)] !px-4 !py-2.5 !text-[13px] !font-[800] !capitalize !text-white shadow-[0_12px_26px_rgba(56,114,250,0.20)]">
                  {context.t("signIn", "Sign In")}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <Dialog
        fullScreen
        open={context?.isOpenFullScreenPanel.open}
        onClose={() =>
          context?.setIsOpenFullScreenPanel({
            open: false,
          })
        }
        slots={{
          transition: Transition,
        }}
      >
        <AppBar
          sx={{
            position: "relative",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(244,248,255,0.96))",
            color: "#14213d",
            boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
            borderBottom: "1px solid #e8edf5",
          }}
        >
          <Toolbar sx={{ minHeight: 72, gap: 1.5 }}>
            <IconButton
              edge="start"
              onClick={() =>
                context?.setIsOpenFullScreenPanel({
                  open: false,
                })
              }
              aria-label="close"
              sx={{
                width: 44,
                height: 44,
                borderRadius: "14px",
                backgroundColor: "#ffffff",
                border: "1px solid #e8edf5",
                color: "#14213d",
              }}
            >
              <IoMdClose />
            </IconButton>

            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="hidden h-11 w-11 items-center justify-center rounded-[14px] bg-[#eef4ff] text-[#3872fa] sm:flex">
                <HiOutlineSparkles className="text-[20px]" />
              </div>
              <Typography
                sx={{ flex: 1, minWidth: 0 }}
                variant="h6"
                component="div"
              >
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-[800] uppercase tracking-[0.16em] text-[#3872fa]">
                    {context.t("workspacePanel", "Workspace Panel")}
                  </p>
                  <span className="block truncate text-[16px] font-[900] text-[#14213d] sm:text-[18px]">
                    {currentPanelTitle}
                  </span>
                </div>
              </Typography>
            </div>
          </Toolbar>
        </AppBar>

        {context?.isOpenFullScreenPanel.model === "Add Product" && (
          <AddProduct />
        )}
        {context?.isOpenFullScreenPanel.model === "Add Home Slide" && (
          <AddHomeSlide />
        )}
        {context?.isOpenFullScreenPanel.model === "Add New Category" && (
          <AddCategory />
        )}
        {context?.isOpenFullScreenPanel.model === "Add New Sub Category" && (
          <AddSubCategory />
        )}
        {context?.isOpenFullScreenPanel.model === "Add New Address" && (
          <AddAddress />
        )}
        {context?.isOpenFullScreenPanel.model === "Edit Category" && (
          <EditCategory />
        )}
        {context?.isOpenFullScreenPanel.model === "Edit Product" && (
          <EditProduct />
        )}
        {context?.isOpenFullScreenPanel.model === "Add HomeSlide" && (
          <AddHomeSlide />
        )}
        {context?.isOpenFullScreenPanel.model === "Add BannerV1" && (
          <AddBannerV1 />
        )}
        {context?.isOpenFullScreenPanel.model === "Edit BannerV1" && (
          <EditBannerV1 />
        )}
        {context?.isOpenFullScreenPanel.model === "Add Blog" && <AddBlog />}
        {context?.isOpenFullScreenPanel.model === "Edit Blog" && <EditBlog />}
      </Dialog>
    </>
  );
};

export default Header;

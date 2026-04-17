import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Radio from "@mui/material/Radio";
import { Collapse } from "react-collapse";
import { useNavigate } from "react-router-dom";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import {
  HiOutlineLocationMarker,
  HiOutlineLockClosed,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineSparkles,
  HiOutlineUser,
} from "react-icons/hi";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { IoMdCloudUpload } from "react-icons/io";
import { MyContext } from "../../App";
import {
  editData,
  fetchDataFromApi,
  postData,
  uploadImage,
} from "../../utils/api";

const label = { inputProps: { "aria-label": "Address" } };

const inputClassName =
  "h-[42px] w-full rounded-[14px] border border-slate-200 bg-white px-3.5 text-[12px] text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#3872fa] focus:shadow-[0_0_0_4px_rgba(56,114,250,0.12)] disabled:cursor-not-allowed disabled:bg-slate-100 sm:h-[44px] sm:rounded-[16px] sm:px-4 sm:text-[13px]";

const passwordInputClassName =
  "h-[42px] w-full rounded-[14px] border border-slate-200 bg-white px-3.5 text-[12px] text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#3872fa] focus:shadow-[0_0_0_4px_rgba(56,114,250,0.12)] disabled:cursor-not-allowed disabled:bg-slate-100 sm:h-[44px] sm:rounded-[16px] sm:px-4 sm:text-[13px]";

const Profile = () => {
  const [previews, setPreviews] = useState([]);
  const [phone, setPhone] = useState("");
  const [uploading, setUploading] = useState(false);
  const [address, setAddress] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isChangePasswordFromShow, setIsChangePasswordFromShow] =
    useState(false);
  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [changePassword, setChangePassword] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [selectedValue, setSelectedValue] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const history = useNavigate();
  const context = useContext(MyContext);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  useEffect(() => {
    const token = localStorage.getItem("accesstoken");

    if (token === null) {
      history("/login");
    }
  }, [context?.islogin, history]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;

    setFormFields((prev) => ({
      ...prev,
      [name]: value,
    }));

    setChangePassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const currentUserId = context?.userData?._id;

    if (currentUserId !== "" && currentUserId !== undefined) {
      fetchDataFromApi(`/api/address/get?userId=${currentUserId}`).then(
        (res) => {
          if (res?.error === false) {
            setAddress(res?.data || []);
            context?.setAddress(res?.data || []);
          }
        },
      );

      setUserId(currentUserId);
      setFormFields({
        email: context?.userData?.email || "",
        mobile: context?.userData?.mobile || "",
        name: context?.userData?.name || "",
      });

      const currentPhone = `${context?.userData?.mobile || ""}`;
      setPhone(currentPhone);

      setChangePassword((prev) => ({
        ...prev,
        email: context?.userData?.email || "",
      }));
    }
  }, [
    context?.setAddress,
    context?.userData?._id,
    context?.userData?.email,
    context?.userData?.mobile,
    context?.userData?.name,
  ]);

  useEffect(() => {
    const userAvatar = [];

    if (
      context?.userData?.avatar !== "" &&
      context?.userData?.avatar !== undefined
    ) {
      userAvatar.push(context?.userData?.avatar);
      setPreviews(userAvatar);
    }
  }, [context?.userData]);

  const validValue = Object.values(formFields).every((el) => el);
  const isGoogleAccount = context?.userData?.signUpWithGoogle === true;
  const validValue2 = isGoogleAccount
    ? Boolean(changePassword.newPassword && changePassword.confirmPassword)
    : Boolean(
        changePassword.oldPassword &&
          changePassword.newPassword &&
          changePassword.confirmPassword,
      );

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formFields.name === "") {
      context.alertBox("error", "Please enter full name");
      setIsLoading(false);
      return false;
    }

    if (formFields.email === "") {
      context.alertBox("error", "Please enter email id");
      setIsLoading(false);
      return false;
    }

    if (formFields.mobile === "") {
      context.alertBox("error", "Please enter mobile number");
      setIsLoading(false);
      return false;
    }

    editData(`/api/user/${userId}`, formFields, { withCredentials: true }).then(
      (res) => {
        if (res?.error !== true) {
          setIsLoading(false);
          context.alertBox("success", res?.data?.message);
          context.setIsLogin(true);
        } else {
          context.alertBox(
            "error",
            res?.data?.message || "Something went wrong",
          );
          setIsLoading(false);
        }
      },
    );
  };

  const handleSubmitChangePassword = (e) => {
    e.preventDefault();
    setIsLoading2(true);

    if (!isGoogleAccount && changePassword.oldPassword === "") {
      context.alertBox("error", "Please enter old password");
      setIsLoading2(false);
      return false;
    }

    if (changePassword.newPassword === "") {
      context.alertBox("error", "Please enter new password");
      setIsLoading2(false);
      return false;
    }

    if (changePassword.confirmPassword === "") {
      context.alertBox("error", "Please confirm new password");
      setIsLoading2(false);
      return false;
    }

    if (changePassword.confirmPassword !== changePassword.newPassword) {
      context.alertBox(
        "error",
        "New password and confirm password do not match",
      );
      setIsLoading2(false);
      return false;
    }

    postData(`/api/user/reset-password`, changePassword)
      .then((res) => {
        if (res?.error !== true) {
          setIsLoading2(false);
          context.alertBox("success", res?.message);
          setChangePassword((prev) => ({
            ...prev,
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          }));
        } else {
          context.alertBox("error", res?.message || "Something went wrong");
          setIsLoading2(false);
        }
      })
      .catch(() => {
        setIsLoading2(false);
        context.alertBox("error", "Something went wrong");
      });
  };

  const onChangeFile = async (e) => {
    try {
      setPreviews([]);
      const files = e.target.files;
      setUploading(true);

      const formData = new FormData();

      for (let i = 0; i < files.length; i += 1) {
        if (
          files[i] &&
          (files[i].type === "image/jpeg" ||
            files[i].type === "image/jpg" ||
            files[i].type === "image/png" ||
            files[i].type === "image/webp")
        ) {
          formData.append("images", files[i]);
        } else {
          context.alertBox(
            "error",
            "Please select a valid JPG, PNG or WEBP image file",
          );
          setUploading(false);
          return false;
        }
      }

      uploadImage("/api/user/user-avatar", formData)
        .then((res) => {
          setUploading(false);

          if (res?.data?.avatar) {
            setPreviews([res.data.avatar]);
          }
        })
        .catch(() => {
          setUploading(false);
          context.alertBox("error", "Upload failed");
        });
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  return (
    <section className="relative my-2 overflow-hidden rounded-[20px] bg-[linear-gradient(135deg,_#f8f4ea_0%,_#eef4ff_45%,_#ffffff_100%)] p-2.5 shadow-[0_16px_45px_rgba(15,23,42,0.07)] sm:my-3 sm:rounded-[26px] sm:p-4 lg:p-5">
      <div className="absolute left-[-90px] top-[-100px] h-[150px] w-[150px] rounded-full bg-[#3872fa]/12 blur-3xl sm:left-[-60px] sm:top-[-80px] sm:h-[180px] sm:w-[180px]" />
      <div className="absolute bottom-[-90px] right-[-60px] h-[150px] w-[150px] rounded-full bg-[#f59e0b]/12 blur-3xl sm:right-[-30px] sm:h-[190px] sm:w-[190px]" />

      <div className="relative z-10 flex flex-col gap-3 sm:gap-4">
        <div className="grid gap-3 xl:grid-cols-[1.02fr_0.98fr] xl:gap-4">
          <div className="rounded-[18px] border border-white/70 bg-[#14213d] p-3.5 text-white shadow-[0_18px_45px_rgba(20,33,61,0.2)] sm:rounded-[22px] sm:p-4.5">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-2.5 py-1.5 text-[9px] font-[700] uppercase tracking-[0.18em] text-white/85 sm:px-3 sm:py-2 sm:text-[10px]">
              <HiOutlineSparkles className="text-[15px]" />
              Account Center
            </div>

            <div className="mt-4 flex flex-col items-center gap-3 text-center md:flex-row md:items-center md:gap-4 md:text-left">
              <div className="relative h-[88px] w-[88px] overflow-hidden rounded-[22px] border border-white/15 bg-white/10 shadow-[0_14px_30px_rgba(0,0,0,0.18)] sm:h-[96px] sm:w-[96px] sm:rounded-[24px]">
                {uploading ? (
                  <div className="flex h-full items-center justify-center">
                    <CircularProgress color="inherit" />
                  </div>
                ) : previews?.length !== 0 ? (
                  previews?.map((img, index) => (
                    <img
                      src={img}
                      key={index}
                      alt="User avatar"
                      className="h-full w-full object-cover"
                    />
                  ))
                ) : (
                  <img
                    src="/user.jpg"
                    alt="Default user avatar"
                    className="h-full w-full object-cover"
                  />
                )}

                <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-[rgba(8,15,32,0.58)] opacity-0 transition-all hover:opacity-100">
                  <div className="flex flex-col items-center gap-1 text-white">
                    <IoMdCloudUpload className="text-[20px]" />
                    <span className="text-[10px] font-[700] uppercase tracking-[0.16em]">
                      Update
                    </span>
                  </div>
                  <input
                    type="file"
                    className="absolute inset-0 h-full w-full opacity-0"
                    accept="image/*"
                    onChange={onChangeFile}
                    name="avatar"
                  />
                </label>
              </div>

              <div className="flex-1">
                <h1 className="text-[19px] font-[800] leading-tight sm:text-[24px]">
                  {formFields.name || "Your profile"}
                </h1>
                <p className="mt-1.5 max-w-[430px] text-[12px] leading-5 text-white/72 sm:text-[13px] sm:leading-6">
                  Keep your account details updated so orders, notifications and
                  contact information stay accurate across the admin dashboard.
                </p>

                <div className="mt-3 grid gap-2.5 sm:flex sm:flex-wrap">
                  <div className="rounded-[16px] border border-white/12 bg-white/10 px-3 py-2.5 backdrop-blur-sm sm:rounded-[18px]">
                    <p className="text-[10px] font-[700] uppercase tracking-[0.16em] text-white/55">
                      Email
                    </p>
                    <p className="mt-1 break-all text-[12px] font-[700] text-white sm:text-[13px]">
                      {formFields.email || "No email"}
                    </p>
                  </div>
                  <div className="rounded-[16px] border border-white/12 bg-[#f59e0b] px-3 py-2.5 text-[#1f2937] sm:rounded-[18px]">
                    <p className="text-[10px] font-[700] uppercase tracking-[0.16em] text-[#1f2937]/70">
                      Addresses
                    </p>
                    <p className="mt-1 text-[16px] font-[800] sm:text-[18px]">
                      {address?.length || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[18px] border border-white/80 bg-white/82 p-3.5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:rounded-[22px] sm:p-4.5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[10px] font-[800] uppercase tracking-[0.18em] text-[#3872fa] sm:text-[11px]">
                  Profile Overview
                </p>
                <h2 className="mt-1.5 text-[17px] font-[800] leading-tight text-[#14213d] sm:text-[20px]">
                  Manage your personal details
                </h2>
                <p className="mt-1.5 text-[12px] leading-5 text-slate-500 sm:text-[13px]">
                  Update the essentials below and keep your admin account ready
                  for daily work.
                </p>
              </div>

              <Button
                onClick={() =>
                  setIsChangePasswordFromShow(!isChangePasswordFromShow)
                }
                className="!w-full !rounded-full !border !border-slate-200 !bg-white !px-3.5 !py-1.5 !text-[11px] !font-[700] !capitalize !text-slate-700 sm:!w-auto sm:!min-w-fit"
              >
                {isChangePasswordFromShow ? "Hide password" : "Change password"}
              </Button>
            </div>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
              <div className="rounded-[16px] bg-[#f8fafc] p-3 sm:rounded-[18px]">
                <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#e8f0ff] text-[#3872fa]">
                  <HiOutlineUser className="text-[17px]" />
                </div>
                <p className="mt-3 text-[10px] font-[700] uppercase tracking-[0.14em] text-slate-400">
                  Full name
                </p>
                <p className="mt-1 text-[13px] font-[700] text-slate-800">
                  {formFields.name || "Not updated"}
                </p>
              </div>

              <div className="rounded-[16px] bg-[#f8fafc] p-3 sm:rounded-[18px]">
                <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#ebf9ef] text-[#16a34a]">
                  <HiOutlineMail className="text-[17px]" />
                </div>
                <p className="mt-3 text-[10px] font-[700] uppercase tracking-[0.14em] text-slate-400">
                  Email address
                </p>
                <p className="mt-1 break-all text-[13px] font-[700] text-slate-800">
                  {formFields.email || "Not updated"}
                </p>
              </div>

              <div className="rounded-[16px] bg-[#f8fafc] p-3 sm:rounded-[18px]">
                <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#fff3df] text-[#ea580c]">
                  <HiOutlinePhone className="text-[17px]" />
                </div>
                <p className="mt-3 text-[10px] font-[700] uppercase tracking-[0.14em] text-slate-400">
                  Phone number
                </p>
                <p className="mt-1 text-[13px] font-[700] text-slate-800">
                  {formFields.mobile || "Not updated"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 xl:grid-cols-[1.08fr_0.92fr] xl:gap-4">
          <div className="rounded-[18px] border border-white/80 bg-white/86 p-3.5 shadow-[0_18px_42px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:rounded-[22px] sm:p-4.5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-[800] uppercase tracking-[0.18em] text-[#3872fa] sm:text-[11px]">
                  Personal Info
                </p>
                <h2 className="mt-1.5 text-[17px] font-[800] text-[#14213d] sm:text-[20px]">
                  Update profile
                </h2>
              </div>

              <p className="text-[12px] text-slate-500">
                Changes are saved directly to your account.
              </p>
            </div>

            <form className="mt-4 space-y-3.5 sm:space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[12px] font-[700] text-slate-700">
                    Full name
                  </label>
                  <input
                    type="text"
                    className={inputClassName}
                    name="name"
                    placeholder="Enter your name"
                    value={formFields.name}
                    onChange={onChangeInput}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[12px] font-[700] text-slate-700">
                    Email address
                  </label>
                  <input
                    type="text"
                    className={inputClassName}
                    name="email"
                    value={formFields.email}
                    onChange={onChangeInput}
                    disabled
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[12px] font-[700] text-slate-700">
                  Mobile number
                </label>
                <div className="overflow-hidden rounded-[14px] border border-slate-200 bg-white p-1 shadow-[0_1px_0_rgba(15,23,42,0.02)] sm:rounded-[16px]">
                  <PhoneInput
                    defaultCountry="vn"
                    value={phone}
                    disabled={isLoading}
                    onChange={(value) => {
                      setPhone(value);
                      setFormFields((prev) => ({
                        ...prev,
                        mobile: value,
                      }));
                    }}
                    inputClassName="!h-[38px] !w-full !min-w-0 !border-0 !bg-transparent !text-[12px] !text-slate-800 focus:!shadow-none sm:!h-[40px] sm:!text-[13px]"
                    className="!flex !w-full !items-center"
                    countrySelectorStyleProps={{
                      buttonClassName:
                        "!h-[38px] !shrink-0 !rounded-[10px] !border-0 !bg-[#f8fafc] !px-2 sm:!h-[40px] sm:!rounded-[12px] sm:!px-2.5",
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  type="submit"
                  disabled={!validValue || isLoading}
                  className="!h-[42px] !w-full !rounded-[14px] !bg-[linear-gradient(135deg,_#14213d,_#3872fa)] !px-5 !text-[12px] !font-[700] !capitalize !text-white !shadow-[0_14px_28px_rgba(56,114,250,0.26)] disabled:!bg-slate-300 disabled:!text-slate-500 sm:!h-[44px] sm:!w-auto sm:!rounded-[16px] sm:!text-[13px]"
                >
                  {isLoading ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </div>
            </form>
          </div>

          <div className="rounded-[18px] border border-white/80 bg-white/86 p-3.5 shadow-[0_18px_42px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:rounded-[22px] sm:p-4.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-[800] uppercase tracking-[0.18em] text-[#3872fa] sm:text-[11px]">
                  Saved Addresses
                </p>
                <h2 className="mt-1.5 text-[17px] font-[800] text-[#14213d] sm:text-[20px]">
                  Delivery locations
                </h2>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-[#eef4ff] text-[#3872fa]">
                <HiOutlineLocationMarker className="text-[18px]" />
              </div>
            </div>

            <button
              type="button"
              className="mt-4 flex w-full items-center justify-center rounded-[14px] border border-dashed border-[#bfd2ff] bg-[#f5f8ff] px-4 py-3 text-[12px] font-[700] text-[#3872fa] transition-all hover:bg-[#edf3ff] sm:rounded-[16px] sm:text-[13px]"
              onClick={() =>
                context.setIsOpenFullScreenPanel({
                  open: true,
                  model: "Add New Address",
                })
              }
            >
              Add Address
            </button>

            <div className="mt-3.5 flex max-h-[320px] flex-col gap-2.5 overflow-auto pr-0 sm:pr-1">
              {address?.length > 0 ? (
                address?.map((item) => (
                  <label
                    key={item?._id}
                    className={`flex cursor-pointer flex-col items-start gap-2 rounded-[16px] border p-3 transition-all sm:flex-row sm:gap-3 sm:rounded-[18px] sm:p-3.5 ${
                      selectedValue === item?._id
                        ? "border-[#3872fa] bg-[#f4f8ff] shadow-[0_12px_30px_rgba(56,114,250,0.12)]"
                        : "border-slate-200 bg-white hover:border-[#bfd2ff] hover:bg-[#fbfdff]"
                    }`}
                  >
                    <Radio
                      {...label}
                      name="address"
                      value={item?._id}
                      checked={selectedValue === item?._id}
                      onChange={handleChange}
                      sx={{
                        color: "#94a3b8",
                        "&.Mui-checked": {
                          color: "#3872fa",
                        },
                      }}
                    />

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#eef4ff] px-2.5 py-1 text-[10px] font-[700] uppercase tracking-[0.12em] text-[#3872fa]">
                          Address
                        </span>
                        {selectedValue === item?._id && (
                          <span className="rounded-full bg-[#14213d] px-2.5 py-1 text-[10px] font-[700] uppercase tracking-[0.12em] text-white">
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-[12px] leading-5 text-slate-600 sm:text-[13px] sm:leading-6">
                        {[
                          item?.address_line1,
                          item?.city,
                          item?.state,
                          item?.country,
                          item?.pincode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </label>
                ))
              ) : (
                <div className="rounded-[16px] border border-dashed border-slate-200 bg-[#fafafa] px-4 py-7 text-center sm:rounded-[18px] sm:py-8">
                  <p className="text-[13px] font-[700] text-slate-700">
                    No saved address yet
                  </p>
                  <p className="mt-2 text-[12px] leading-5 text-slate-500">
                    Add a delivery address to make order handling faster.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Collapse isOpened={isChangePasswordFromShow}>
          <div className="rounded-[18px] border border-white/80 bg-white/86 p-3.5 shadow-[0_18px_42px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:rounded-[22px] sm:p-4.5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-[800] uppercase tracking-[0.18em] text-[#3872fa] sm:text-[11px]">
                  Security
                </p>
                <h2 className="mt-1.5 text-[17px] font-[800] text-[#14213d] sm:text-[20px]">
                  Change password
                </h2>
                <p className="mt-1.5 text-[12px] leading-5 text-slate-500 sm:text-[13px]">
                  Use a strong password that is different from old credentials.
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#14213d] text-white shadow-[0_14px_26px_rgba(20,33,61,0.18)]">
                <HiOutlineLockClosed className="text-[17px]" />
              </div>
            </div>

            <form
              className="mt-4 grid gap-3.5 md:grid-cols-2"
              onSubmit={handleSubmitChangePassword}
            >
              {!isGoogleAccount && (
                <div>
                  <label className="mb-1.5 block text-[12px] font-[700] text-slate-700">
                    Old password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.oldPassword ? "text" : "password"}
                      name="oldPassword"
                      value={changePassword.oldPassword}
                      onChange={onChangeInput}
                      disabled={isLoading2}
                      placeholder="Enter current password"
                      className={`${passwordInputClassName} pr-11`}
                    />
                    <button
                      type="button"
                      aria-label="Toggle old password visibility"
                      className="absolute right-1 top-1 flex h-[34px] w-[34px] items-center justify-center rounded-[10px] text-slate-500 transition-all hover:bg-slate-100 sm:h-[36px] sm:w-[36px]"
                      onClick={() => togglePasswordVisibility("oldPassword")}
                    >
                      {showPasswords.oldPassword ? (
                        <FaEyeSlash className="text-[15px]" />
                      ) : (
                        <FaRegEye className="text-[15px]" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-[12px] font-[700] text-slate-700">
                  New password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.newPassword ? "text" : "password"}
                    name="newPassword"
                    value={changePassword.newPassword}
                    onChange={onChangeInput}
                    disabled={isLoading2}
                    placeholder="Enter new password"
                    className={`${passwordInputClassName} pr-11`}
                  />
                  <button
                    type="button"
                    aria-label="Toggle new password visibility"
                    className="absolute right-1 top-1 flex h-[34px] w-[34px] items-center justify-center rounded-[10px] text-slate-500 transition-all hover:bg-slate-100 sm:h-[36px] sm:w-[36px]"
                    onClick={() => togglePasswordVisibility("newPassword")}
                  >
                    {showPasswords.newPassword ? (
                      <FaEyeSlash className="text-[15px]" />
                    ) : (
                      <FaRegEye className="text-[15px]" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[12px] font-[700] text-slate-700">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={changePassword.confirmPassword}
                    onChange={onChangeInput}
                    disabled={isLoading2}
                    placeholder="Re-enter new password"
                    className={`${passwordInputClassName} pr-11`}
                  />
                  <button
                    type="button"
                    aria-label="Toggle confirm password visibility"
                    className="absolute right-1 top-1 flex h-[34px] w-[34px] items-center justify-center rounded-[10px] text-slate-500 transition-all hover:bg-slate-100 sm:h-[36px] sm:w-[36px]"
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                  >
                    {showPasswords.confirmPassword ? (
                      <FaEyeSlash className="text-[15px]" />
                    ) : (
                      <FaRegEye className="text-[15px]" />
                    )}
                  </button>
                </div>
              </div>

              {!isGoogleAccount && <div className="hidden md:block" />}

              <div className="md:col-span-2">
                <Button
                  type="submit"
                  disabled={!validValue2 || isLoading2}
                  className="!h-[42px] !w-full !rounded-[14px] !bg-[#14213d] !px-5 !text-[12px] !font-[700] !capitalize !text-white !shadow-[0_14px_28px_rgba(20,33,61,0.18)] disabled:!bg-slate-300 disabled:!text-slate-500 sm:!h-[44px] sm:!rounded-[16px] sm:!text-[13px]"
                >
                  {isLoading2 ? (
                    <span className="flex items-center justify-center gap-2">
                      <CircularProgress size={18} color="inherit" />
                      Changing...
                    </span>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Collapse>
      </div>
    </section>
  );
};

export default Profile;

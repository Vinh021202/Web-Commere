import React, { useContext, useEffect, useMemo, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaRegImages } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { MyContext } from "../../App";
import { deleteImages, editData, fetchDataFromApi } from "../../utils/api";
import UploadBox from "../../Components/UploadBox";

const initialFormFields = {
  catId: "",
  catName: "",
  bannerTitle: "",
  subCatId: "",
  subCat: "",
  thirdsubCatId: "",
  thirdsubCat: "",
  price: "",
  images: [],
  alignInfo: "",
};

const EditBannerV1 = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [productCat, setProductCat] = useState("");
  const [productSubCat, setProductSubCat] = useState("");
  const [productThirLaveldCat, setProductThirLaveldCat] = useState("");
  const [alignInfo, setAlignInfo] = useState("");
  const [previews, setPreviews] = useState([]);
  const [formFields, setFormFields] = useState(initialFormFields);

  const context = useContext(MyContext);
  const navigate = useNavigate();

  const subCategories = useMemo(() => {
    const selectedCat = context?.catData?.find((cat) => cat._id === productCat);
    return selectedCat?.children || [];
  }, [context?.catData, productCat]);

  const thirdLevelCategories = useMemo(() => {
    const selectedSubCat = subCategories.find(
      (subCat) => subCat._id === productSubCat,
    );
    return selectedSubCat?.children || [];
  }, [productSubCat, subCategories]);

  useEffect(() => {
    const id = context?.isOpenFullScreenPanel?.id;

    if (!id) {
      setIsFetching(false);
      return;
    }

    fetchDataFromApi(`/api/bannerV1/${id}`).then((res) => {
      const banner = res?.banner || {};

      setFormFields({
        bannerTitle: banner?.bannerTitle || "",
        price: banner?.price || "",
        images: banner?.images || [],
        catId: banner?.catId || "",
        catName: banner?.catName || "",
        subCatId: banner?.subCatId || "",
        subCat: banner?.subCat || "",
        thirdsubCatId: banner?.thirdsubCatId || "",
        thirdsubCat: banner?.thirdsubCat || "",
        alignInfo: banner?.alignInfo || "",
      });

      setPreviews(banner?.images || []);
      setProductCat(banner?.catId || "");
      setProductSubCat(banner?.subCatId || "");
      setProductThirLaveldCat(banner?.thirdsubCatId || "");
      setAlignInfo(banner?.alignInfo || "");
      setIsFetching(false);
    });
  }, [context?.isOpenFullScreenPanel?.id]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const setPreviewsFun = (previewArr) => {
    setPreviews((prev) => [...prev, ...previewArr]);
    setFormFields((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...previewArr],
    }));
  };

  const removeImg = (image, index) => {
    deleteImages(`/api/bannerV1/deteleImage?img=${image}`).then(() => {
      const imageArr = previews.filter((_, i) => i !== index);
      setPreviews(imageArr);
      setFormFields((prev) => ({ ...prev, images: imageArr }));
    });
  };

  const handleChangeProductCat = (event) => {
    const value = event.target.value;
    const selectedCat = context?.catData?.find((cat) => cat._id === value);

    setProductCat(value);
    setProductSubCat("");
    setProductThirLaveldCat("");

    setFormFields((prev) => ({
      ...prev,
      catId: value,
      catName: selectedCat?.name || "",
      subCatId: "",
      subCat: "",
      thirdsubCatId: "",
      thirdsubCat: "",
    }));
  };

  const handleChangeProductSudCat = (event) => {
    const value = event.target.value;
    const selectedSubCat = subCategories.find((subCat) => subCat._id === value);

    setProductSubCat(value);
    setProductThirLaveldCat("");

    setFormFields((prev) => ({
      ...prev,
      subCatId: value,
      subCat: selectedSubCat?.name || "",
      thirdsubCatId: "",
      thirdsubCat: "",
    }));
  };

  const handleChangeProductThirLavelCat = (event) => {
    const value = event.target.value;
    const selectedThirdCat = thirdLevelCategories.find(
      (thirdCat) => thirdCat._id === value,
    );

    setProductThirLaveldCat(value);
    setFormFields((prev) => ({
      ...prev,
      thirdsubCatId: value,
      thirdsubCat: selectedThirdCat?.name || "",
    }));
  };

  const handleChangeAlignInfo = (event) => {
    const value = event.target.value;
    setAlignInfo(value);
    setFormFields((prev) => ({ ...prev, alignInfo: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (formFields.bannerTitle.trim() === "") {
      context.alertBox("error", "Please enter banner title");
      setIsLoading(false);
      return;
    }

    if (formFields.price === "") {
      context.alertBox("error", "Please enter price");
      setIsLoading(false);
      return;
    }

    if (previews?.length === 0) {
      context.alertBox("error", "Please upload banner image");
      setIsLoading(false);
      return;
    }

    editData(`/api/bannerV1/${context?.isOpenFullScreenPanel?.id}`, formFields).then(
      () => {
        setTimeout(() => {
          setIsLoading(false);
          context.setIsOpenFullScreenPanel({
            open: false,
          });
          navigate("/bannerV1/list");
        }, 2500);
      },
    );
  };

  return (
    <section className="min-h-full bg-[linear-gradient(180deg,_#f8fafc_0%,_#f3f6fb_100%)] p-4 sm:p-5">
      <form
        className="overflow-hidden rounded-[30px] border border-white/70 bg-white/88 shadow-[0_22px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl"
        onSubmit={handleSubmit}
      >
        <div className="border-b border-[#edf2f7] bg-[linear-gradient(135deg,_rgba(255,255,255,0.96),_rgba(244,247,255,0.96))] px-5 py-5 sm:px-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,_#14213d,_#3872fa)] text-white shadow-[0_16px_35px_rgba(56,114,250,0.22)]">
                <FaRegImages className="text-[24px]" />
              </div>
              <div>
                <p className="text-[11px] font-[800] uppercase tracking-[0.18em] text-slate-400">
                  Update Banner
                </p>
                <h2 className="mt-2 text-[26px] font-[900] leading-none text-[#14213d]">
                  Edit Banner V1
                </h2>
                <p className="mt-2 text-[14px] text-slate-500">
                  Update banner details, category mapping and uploaded media.
                </p>
              </div>
            </div>

            <div className="rounded-[18px] border border-[#e6edfb] bg-[#f8faff] px-4 py-3 text-right">
              <p className="text-[11px] font-[800] uppercase tracking-[0.14em] text-slate-400">
                Current Images
              </p>
              <p className="mt-1 text-[18px] font-[900] text-[#3872fa]">
                {previews?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="scroll max-h-[72vh] overflow-y-auto px-5 py-5 sm:px-7">
          {isFetching ? (
            <div className="flex min-h-[320px] items-center justify-center">
              <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-[0_10px_25px_rgba(15,23,42,0.06)]">
                <CircularProgress size={22} color="inherit" />
                <span className="text-[13px] font-[700] text-slate-600">
                  Loading banner...
                </span>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 xl:grid-cols-[1.3fr_0.9fr]">
              <div className="rounded-[24px] border border-[#edf2f8] bg-[#fbfcff] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                <div className="mb-5">
                  <p className="text-[11px] font-[800] uppercase tracking-[0.18em] text-[#3872fa]">
                    Banner Details
                  </p>
                  <h3 className="mt-2 text-[22px] font-[900] text-[#14213d]">
                    Content Settings
                  </h3>
                  <p className="mt-2 text-[13px] text-slate-500">
                    Refine banner text, price, placement and category mapping.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="mb-2 text-[13px] font-[700] text-[#14213d]">
                      Banner Title
                    </h3>
                    <input
                      type="text"
                      className="h-[48px] w-full rounded-[16px] border border-[#dbe4f0] bg-white px-4 text-sm text-slate-700 outline-none transition-all focus:border-[#3872fa] focus:shadow-[0_0_0_4px_rgba(56,114,250,0.12)]"
                      name="bannerTitle"
                      value={formFields.bannerTitle}
                      onChange={onChangeInput}
                      placeholder="Summer Sale Banner"
                    />
                  </div>

                  <div>
                    <h3 className="mb-2 text-[13px] font-[700] text-[#14213d]">
                      Price
                    </h3>
                    <input
                      type="number"
                      className="h-[48px] w-full rounded-[16px] border border-[#dbe4f0] bg-white px-4 text-sm text-slate-700 outline-none transition-all focus:border-[#3872fa] focus:shadow-[0_0_0_4px_rgba(56,114,250,0.12)]"
                      name="price"
                      value={formFields.price}
                      onChange={onChangeInput}
                      placeholder="199"
                    />
                  </div>

                  <div>
                    <h3 className="mb-2 text-[13px] font-[700] text-[#14213d]">
                      Banner Category
                    </h3>
                    <Select
                      size="small"
                      className="w-full"
                      displayEmpty
                      value={productCat}
                      onChange={handleChangeProductCat}
                      sx={{
                        borderRadius: "16px",
                        backgroundColor: "#fff",
                        "& .MuiSelect-select": { py: "12px" },
                      }}
                    >
                      <MenuItem value="">
                        <em>Select category</em>
                      </MenuItem>
                      {context?.catData?.map((cat) => (
                        <MenuItem value={cat?._id} key={cat?._id}>
                          {cat?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <h3 className="mb-2 text-[13px] font-[700] text-[#14213d]">
                      Product Sub Category
                    </h3>
                    <Select
                      size="small"
                      className="w-full"
                      displayEmpty
                      value={productSubCat}
                      onChange={handleChangeProductSudCat}
                      disabled={!productCat}
                      sx={{
                        borderRadius: "16px",
                        backgroundColor: "#fff",
                        "& .MuiSelect-select": { py: "12px" },
                      }}
                    >
                      <MenuItem value="">
                        <em>Select sub category</em>
                      </MenuItem>
                      {subCategories.map((subCat) => (
                        <MenuItem value={subCat?._id} key={subCat?._id}>
                          {subCat?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <h3 className="mb-2 text-[13px] font-[700] text-[#14213d]">
                      Product Third Level
                    </h3>
                    <Select
                      size="small"
                      className="w-full"
                      displayEmpty
                      value={productThirLaveldCat}
                      onChange={handleChangeProductThirLavelCat}
                      disabled={!productSubCat}
                      sx={{
                        borderRadius: "16px",
                        backgroundColor: "#fff",
                        "& .MuiSelect-select": { py: "12px" },
                      }}
                    >
                      <MenuItem value="">
                        <em>Select third level</em>
                      </MenuItem>
                      {thirdLevelCategories.map((thirdLavelCat) => (
                        <MenuItem
                          value={thirdLavelCat?._id}
                          key={thirdLavelCat?._id}
                        >
                          {thirdLavelCat?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <h3 className="mb-2 text-[13px] font-[700] text-[#14213d]">
                      Align Info
                    </h3>
                    <Select
                      size="small"
                      className="w-full"
                      displayEmpty
                      value={alignInfo}
                      onChange={handleChangeAlignInfo}
                      sx={{
                        borderRadius: "16px",
                        backgroundColor: "#fff",
                        "& .MuiSelect-select": { py: "12px" },
                      }}
                    >
                      <MenuItem value="">
                        <em>Select alignment</em>
                      </MenuItem>
                      <MenuItem value="left">Left</MenuItem>
                      <MenuItem value="right">Right</MenuItem>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-[#edf2f8] bg-[#fbfcff] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                <div className="mb-4">
                  <p className="text-[11px] font-[800] uppercase tracking-[0.18em] text-[#3872fa]">
                    Banner Preview
                  </p>
                  <h3 className="mt-2 text-[22px] font-[900] text-[#14213d]">
                    Media Upload
                  </h3>
                  <p className="mt-2 text-[13px] text-slate-500">
                    Review existing images and upload replacements if needed.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {previews?.map((image, index) => (
                    <div className="uploadBoxWrapper relative" key={image + index}>
                      <span
                        className="absolute -right-[6px] -top-[6px] z-50 flex h-[22px] w-[22px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-red-600 shadow-[0_8px_18px_rgba(239,68,68,0.35)]"
                        onClick={() => removeImg(image, index)}
                      >
                        <IoMdClose className="text-[17px] text-white" />
                      </span>
                      <div className="uploadBox relative flex h-[170px] w-full items-center justify-center overflow-hidden rounded-[20px] border border-dashed border-[#cfd8e7] bg-white p-1.5 shadow-[0_10px_20px_rgba(15,23,42,0.04)]">
                        <img
                          src={image}
                          alt="Banner preview"
                          className="h-full w-full rounded-[16px] object-cover"
                        />
                      </div>
                    </div>
                  ))}

                  <UploadBox
                    multiple={true}
                    name="images"
                    url="/api/bannerV1/uploadImages"
                    setPreviewsFun={setPreviewsFun}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-[#edf2f7] bg-white/90 px-5 py-5 sm:px-7">
          <div className="w-full sm:w-[260px]">
            <Button
              type="submit"
              disabled={isFetching}
              className="!flex !h-[52px] !w-full !items-center !justify-center !gap-2 !rounded-[18px] !bg-[linear-gradient(135deg,_#14213d,_#3872fa)] !text-[14px] !font-[800] !capitalize !text-white shadow-[0_18px_35px_rgba(56,114,250,0.24)] disabled:!bg-slate-300"
            >
              {isLoading === true ? (
                <CircularProgress color="inherit" size={24} />
              ) : (
                <>
                  <FaCloudUploadAlt className="text-[22px] text-white" />
                  Update and View
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default EditBannerV1;

import React, { useContext, useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Rating from "@mui/material/Rating";
import UploadBox from "../../Components/UploadBox";
import { IoMdClose } from "react-icons/io";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { FaCloudUploadAlt } from "react-icons/fa";
import { HiOutlinePhotograph, HiOutlineSparkles } from "react-icons/hi";
import { MyContext } from "../../App";
import { deleteImages, fetchDataFromApi, postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import Switch from "@mui/material/Switch";

const label = { inputProps: { "aria-label": "Switch demo" } };

const inputClassName =
  "h-[48px] w-full rounded-[18px] border border-slate-200 bg-[#fcfcfd] px-4 text-[13px] text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#3872fa] focus:bg-white focus:shadow-[0_0_0_4px_rgba(56,114,250,0.12)]";

const textareaClassName =
  "min-h-[150px] w-full rounded-[18px] border border-slate-200 bg-[#fcfcfd] px-4 py-3 text-[13px] text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#3872fa] focus:bg-white focus:shadow-[0_0_0_4px_rgba(56,114,250,0.12)]";

const selectSx = {
  width: "100%",
  borderRadius: "18px",
  backgroundColor: "#fcfcfd",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#e2e8f0",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#cbd5e1",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#3872fa",
    boxShadow: "0 0 0 4px rgba(56,114,250,0.12)",
  },
  "& .MuiSelect-select": {
    padding: "13px 14px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#1e293b",
  },
};

const AddProduct = () => {
  const [productCat, setProductCat] = useState("");
  const [productSubCat, setProductSubCat] = useState("");
  const [productFeatured, setproductFeatured] = useState("");
  const [productRams, setproductRams] = useState([]);
  const [productRamsData, setproductRamsData] = useState([]);
  const [productWeight, setproductWeight] = useState([]);
  const [productWeightData, setproductWeightData] = useState([]);
  const [productSize, setproductSize] = useState([]);
  const [productSizeData, setproductSizeData] = useState([]);
  const [productThirLaveldCat, setProductThirLaveldCat] = useState("");
  const [previews, setPreviews] = useState([]);
  const [bannerPreviews, setBannerPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    name: "",
    description: "",
    images: [],
    brand: "",
    price: "",
    oldPrice: "",
    catName: "",
    catId: "",
    subCatId: "",
    subCat: "",
    thirdsubCat: "",
    thirdsubCatId: "",
    category: "",
    countInStock: "",
    rating: "",
    isFeatured: false,
    discount: "",
    productRam: [],
    size: [],
    productWeight: [],
    bannerTitleName: "",
    bannerimages: [],
    isDisplayOnHomeBanner:false,
  });

  const [checkedSwitch, setCheckedSwitch] = useState(false);


  const context = useContext(MyContext);
  const history = useNavigate();

  useEffect(() => {
    fetchDataFromApi(`/api/product/productRams/get`).then((res) => {
      if (res?.error === false) {
        setproductRamsData(res?.data);
      }
    });
    fetchDataFromApi(`/api/product/productWeight/get`).then((res) => {
      if (res?.error === false) {
        setproductWeightData(res?.data);
      }
    });
    fetchDataFromApi(`/api/product/productSize/get`).then((res) => {
      if (res?.error === false) {
        setproductSizeData(res?.data);
      }
    });
  }, []);

  const setPreviewsFun = (previewArr) => {
    setPreviews((prev) => [...prev, ...previewArr]);
    setFormFields((prev) => ({
      ...prev,
      images: [...prev.images, ...previewArr],
    }));
  };

  const setBannerImagesFun = (newBannerPreviews) => {
    setBannerPreviews((prev) => [...prev, ...newBannerPreviews]);
    setFormFields((prev) => ({
      ...prev,
      bannerimages: [...prev.bannerimages, ...newBannerPreviews], // ✅ không phải images
    }));
  };
  const removeImg = (image, index) => {
    deleteImages(`/api/category/deteleImage?img=${image}`).then(() => {
      const imageArr = previews.filter((_, i) => i !== index);
      setPreviews(imageArr);
      setFormFields((prev) => ({ ...prev, images: imageArr }));
    });
  };

  const removeBannerImg = (image, index) => {
    deleteImages(`/api/product/deteleImage?img=${image}`).then(() => {
      const imageArr = bannerPreviews.filter((_, i) => i !== index);
      setBannerPreviews(imageArr);
      setFormFields((prev) => ({ ...prev, bannerimages: imageArr }));
    });
  };

  // ✅ Category
  const handleChangeProductCat = (event) => {
    const value = event.target.value;
    setProductCat(value);
    const selectedCat = context?.catData?.find((cat) => cat._id === value);
    setFormFields((prev) => ({
      ...prev,
      catId: value,
      category: value,
      catName: selectedCat?.name || "",
    }));
  };

  // ✅ Sub Category
  const handleChangeProductSudCat = (event) => {
    const value = event.target.value;
    setProductSubCat(value);
    let subCatName = "";
    context?.catData?.forEach((cat) => {
      cat?.children?.forEach((sub) => {
        if (sub._id === value) subCatName = sub.name;
      });
    });
    setFormFields((prev) => ({
      ...prev,
      subCatId: value,
      subCat: subCatName,
    }));
  };

  // ✅ Third Level Category
  const handleChangeProductThirLavelCat = (event) => {
    const value = event.target.value;
    setProductThirLaveldCat(value);
    let thirdCatName = "";
    context?.catData?.forEach((cat) => {
      cat?.children?.forEach((sub) => {
        sub?.children?.forEach((third) => {
          if (third._id === value) thirdCatName = third.name;
        });
      });
    });
    setFormFields((prev) => ({
      ...prev,
      thirdsubCatId: value,
      thirdsubCat: thirdCatName,
    }));
  };

  // ✅ Featured
  const handleChangeProductFeatured = (event) => {
    const value = event.target.value;
    setproductFeatured(value);
    setFormFields((prev) => ({ ...prev, isFeatured: value }));
  };

  // ✅ Rams
  const handleChangeProductRams = (event) => {
    const {
      target: { value },
    } = event;
    const arr = typeof value === "string" ? value.split(",") : value;
    setproductRams(arr);
    setFormFields((prev) => ({ ...prev, productRam: arr }));
  };

  // ✅ Weight
  const handleChangeProductWeight = (event) => {
    const {
      target: { value },
    } = event;
    const arr = typeof value === "string" ? value.split(",") : value;
    setproductWeight(arr);
    setFormFields((prev) => ({ ...prev, productWeight: arr }));
  };

  // ✅ Size
  const handleChangeProductSize = (event) => {
    const {
      target: { value },
    } = event;
    const arr = typeof value === "string" ? value.split(",") : value;
    setproductSize(arr);
    setFormFields((prev) => ({ ...prev, size: arr }));
  };

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const onChangeRating = (e) => {
    setFormFields((prev) => ({ ...prev, rating: e.target.value }));
  };

  const handleSubmitg = (e) => {
    e.preventDefault();

    if (formFields.name === "")
      return context.alertBox("error", "Please enter product name");
    if (formFields.description === "")
      return context.alertBox("error", "Please enter product description");
    if (formFields.catId === "")
      return context.alertBox("error", "Please select product category");
    if (formFields.price === "")
      return context.alertBox("error", "Please enter product price");
    if (formFields.oldPrice === "")
      return context.alertBox("error", "Please enter product old price");
    if (formFields.countInStock === "")
      return context.alertBox("error", "Please enter product stock");
    if (formFields.brand === "")
      return context.alertBox("error", "Please enter product brand");
    if (formFields.discount === "")
      return context.alertBox("error", "Please enter product discount");
    if (previews?.length === 0)
      return context.alertBox("error", "Please select product image");
    if (formFields?.bannerTitleName === 0)
      return context.alertBox("error", "Please select product image");

    setIsLoading(true);

    postData(`/api/product/create`, formFields)
      .then((res) => {
        setIsLoading(false);
        if (res?.error === false) {
          context.alertBox(
            "success",
            res?.message || "Product created successfully",
          );
          context.setRefreshData((prev) => !prev);
          context.setIsOpenFullScreenPanel({ open: false });
          history("/products");
        } else {
          context.alertBox("error", res?.message || "Failed to create product");
        }
      })
      .catch(() => {
        setIsLoading(false);
        context.alertBox("error", "Failed to create product");
      });
  };

  const handleChangeSwitch = (event) => {
    setCheckedSwitch(event.target.checked);
    formFields.isDisplayOnHomeBanner = event.target.checked;
  };


  return (
    <section className="min-h-full bg-[linear-gradient(180deg,_#f8fafc_0%,_#f3f6fb_100%)] p-4 sm:p-5">
      <form
        className="overflow-hidden rounded-[30px] border border-white/70 bg-white/88 shadow-[0_22px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl"
        onSubmit={handleSubmitg}
      >
        <div className="border-b border-[#edf2f7] bg-[linear-gradient(135deg,_rgba(255,255,255,0.96),_rgba(244,247,255,0.96))] px-5 py-5 sm:px-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,_#14213d,_#3872fa)] text-white shadow-[0_16px_35px_rgba(56,114,250,0.22)]">
                <HiOutlineSparkles className="text-[26px]" />
              </div>
              <div>
                <p className="text-[11px] font-[800] uppercase tracking-[0.18em] text-slate-400">
                  New Product
                </p>
                <h2 className="mt-2 text-[26px] font-[900] leading-none text-[#14213d]">
                  Add Product
                </h2>
                <p className="mt-2 text-[14px] text-slate-500">
                  Fill in the product details, media and banner content before
                  publishing.
                </p>
              </div>
            </div>

            <div className="rounded-[18px] border border-[#e6edfb] bg-[#f8faff] px-4 py-3 text-right">
              <p className="text-[11px] font-[800] uppercase tracking-[0.14em] text-slate-400">
                Status
              </p>
              <p className="mt-1 text-[18px] font-[900] text-[#3872fa]">
                Draft
              </p>
            </div>
          </div>
        </div>

        <div className="scroll max-h-[72vh] overflow-y-auto px-5 py-5 sm:px-7">
          <div className="rounded-[24px] border border-[#edf2f8] bg-[#fbfcff] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <p className="text-[11px] font-[800] uppercase tracking-[0.18em] text-[#3872fa]">
              Basic Info
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4">
              <div className="col">
                <h3 className="mb-1.5 text-[13px] font-[700] text-slate-700">
                  Product Name
                </h3>
                <input
                  type="text"
                  className={inputClassName}
                  name="name"
                  value={formFields.name}
                  onChange={onChangeInput}
                  placeholder="Enter product name"
                />
              </div>

              <div className="col">
                <h3 className="mb-1.5 text-[13px] font-[700] text-slate-700">
                  Product Description
                </h3>
                <textarea
                  className={textareaClassName}
                  name="description"
                  value={formFields.description}
                  onChange={onChangeInput}
                  placeholder="Describe the product, benefits and key details"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-[24px] border border-[#edf2f8] bg-[#fbfcff] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <p className="text-[11px] font-[800] uppercase tracking-[0.18em] text-[#3872fa]">
              Catalog Setup
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {/* Category */}
            <div className="col">
              <h3 className="mb-1.5 text-[13px] font-[700] text-slate-700">
                Product Category
              </h3>
              {context?.catData?.length !== 0 && (
                <Select
                  size="small"
                  displayEmpty
                  sx={selectSx}
                  value={productCat}
                  onChange={handleChangeProductCat}
                >
                  {context?.catData.map((cat, index) => (
                    <MenuItem value={cat?._id} key={index}>
                      {cat?.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </div>

            {/* Sub Category */}
            <div className="col">
              <h3 className="mb-1.5 text-[13px] font-[700] text-slate-700">
                Product Sub Category
              </h3>
              {context?.catData?.length !== 0 && (
                <Select
                  size="small"
                  displayEmpty
                  sx={selectSx}
                  value={productSubCat}
                  onChange={handleChangeProductSudCat}
                >
                  {context?.catData.map((cat) =>
                    cat?.children?.map((subCat, index) => (
                      <MenuItem value={subCat?._id} key={index}>
                        {subCat?.name}
                      </MenuItem>
                    )),
                  )}
                </Select>
              )}
            </div>

            {/* Third Level */}
            <div className="col">
              <h3 className="mb-1.5 text-[13px] font-[700] text-slate-700">
                Product Third Level
              </h3>
              {context?.catData?.length !== 0 && (
                <Select
                  size="small"
                  displayEmpty
                  sx={selectSx}
                  value={productThirLaveldCat}
                  onChange={handleChangeProductThirLavelCat}
                >
                  {context?.catData.map((cat) =>
                    cat?.children?.map((subCat) =>
                      subCat?.children?.map((thirdLavelCat, index) => (
                        <MenuItem value={thirdLavelCat?._id} key={index}>
                          {thirdLavelCat?.name}
                        </MenuItem>
                      )),
                    ),
                  )}
                </Select>
              )}
            </div>

            {/* Price */}
            <div className="col">
              <h3 className="mb-1.5 text-[13px] font-[700] text-slate-700">
                Product Price
              </h3>
              <input
                type="number"
                className={inputClassName}
                name="price"
                value={formFields.price}
                onChange={onChangeInput}
                placeholder="0"
              />
            </div>

            {/* Old Price */}
            <div className="col">
              <h3 className="mb-1.5 text-[13px] font-[700] text-slate-700">
                Product Old Price
              </h3>
              <input
                type="number"
                className={inputClassName}
                name="oldPrice"
                value={formFields.oldPrice}
                onChange={onChangeInput}
                placeholder="0"
              />
            </div>

            {/* Featured */}
            <div className="col">
              <h3 className="mb-1.5 text-[13px] font-[700] text-slate-700">
                Is Featured?
              </h3>
              <Select
                size="small"
                sx={selectSx}
                value={productFeatured}
                onChange={handleChangeProductFeatured}
              >
                <MenuItem value={true}>True</MenuItem>
                <MenuItem value={false}>False</MenuItem>
              </Select>
            </div>

            {/* Stock */}
            <div className="col">
              <h3 className="mb-1.5 text-[13px] font-[700] text-slate-700">
                Product Stock
              </h3>
              <input
                type="number"
                className={inputClassName}
                name="countInStock"
                value={formFields.countInStock}
                onChange={onChangeInput}
                placeholder="0"
              />
            </div>

            {/* Brand */}
            <div className="col">
              <h3 className="mb-1.5 text-[13px] font-[700] text-slate-700">
                Product Brand
              </h3>
              <input
                type="text"
                className={inputClassName}
                name="brand"
                value={formFields.brand}
                onChange={onChangeInput}
                placeholder="Brand name"
              />
            </div>

            {/* Discount */}
            <div className="col">
              <h3 className="mb-1.5 text-[13px] font-[700] text-slate-700">
                Product Discount
              </h3>
              <input
                type="number"
                className={inputClassName}
                name="discount"
                value={formFields.discount}
                onChange={onChangeInput}
                placeholder="%"
              />
            </div>

            {/* Rams */}
            <div className="col">
              <h3 className="mb-1.5 text-[13px] font-[700] text-slate-700">
                Product Rams
              </h3>
              {productRamsData?.length !== 0 && (
                <Select
                  multiple
                  size="small"
                  sx={selectSx}
                  value={productRams}
                  onChange={handleChangeProductRams}
                >
                  {productRamsData?.map((item, index) => {
                    return (
                      <MenuItem key={index} value={item?.name}>
                        {item?.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              )}
            </div>

            {/* Weight */}
            <div className="col">
              <h3 className="mb-1.5 text-[13px] font-[700] text-slate-700">
                Product Weight
              </h3>
              {productWeightData?.length !== 0 && (
                <Select
                  multiple
                  size="small"
                  sx={selectSx}
                  value={productWeight}
                  onChange={handleChangeProductWeight}
                >
                  {productWeightData?.map((item, index) => {
                    return (
                      <MenuItem key={index} value={item?.name}>
                        {item?.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              )}
            </div>

            {/* Size */}
            <div className="col">
              <h3 className="mb-1.5 text-[13px] font-[700] text-slate-700">
                Product Size
              </h3>
              {productSizeData?.length !== 0 && (
                <Select
                  multiple
                  size="small"
                  sx={selectSx}
                  value={productSize}
                  onChange={handleChangeProductSize}
                >
                  {productSizeData?.map((item, index) => {
                    return (
                      <MenuItem key={index} value={item?.name}>
                        {item?.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              )}
            </div>
          </div>
          </div>

          {/* Rating */}
          <div className="mt-5 rounded-[24px] border border-[#edf2f8] bg-[#fbfcff] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="col">
                <h3 className="mb-1.5 text-[13px] font-[700] text-slate-700">
                Product Rating
                </h3>
                <div className="flex h-[48px] items-center rounded-[18px] border border-slate-200 bg-[#fcfcfd] px-4">
                  <Rating
                    name="half-rating"
                    defaultValue={1}
                    precision={0.5}
                    onChange={onChangeRating}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="mt-5 rounded-[24px] border border-[#edf2f8] bg-[#fbfcff] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#eef4ff] text-[#3872fa]">
                <HiOutlinePhotograph className="text-[22px]" />
              </div>
              <div>
                <h3 className="font-[800] text-[18px] text-[#14213d]">
                  Media & Images
                </h3>
                <p className="text-[13px] text-slate-500">
                  Upload product photos for listing and detail pages.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-8">
              {previews?.length !== 0 &&
                previews?.map((image, index) => {
                  return (
                    <div className="uploadBoxWrapper relative" key={index}>
                      <span
                        className="absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-700 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer"
                        onClick={() => removeImg(image, index)}
                      >
                        <IoMdClose className="text-white text-[17px]" />
                      </span>
                      <div className="uploadBox relative flex h-[150px] w-full items-center justify-center overflow-hidden rounded-[20px] border border-dashed border-[#cfd8e7] bg-white p-1.5 shadow-[0_10px_20px_rgba(15,23,42,0.04)]">
                        <img
                          src={image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  );
                })}
              <UploadBox
                multiple={true}
                name="images"
                url="/api/product/uploadImages"
                setPreviewsFun={setPreviewsFun}
              />
            </div>
          </div>
          <div className="mt-5 rounded-[24px] border border-[#edf2f8] bg-[#fbfcff] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="font-[800] text-[18px] text-[#14213d]">
                  Banner Content
                </h3>
                <p className="mt-1 text-[13px] text-slate-500">
                  Optional banner images and title for home page promotion.
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-[18px] border border-[#e6edfb] bg-white px-4 py-3">
                <span className="text-[13px] font-[700] text-slate-700">
                  Display on home banner
                </span>
                <Switch
                  {...label}
                  onChange={handleChangeSwitch}
                  checked={checkedSwitch}
                />
              </div>
            </div>
              <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-8">
                {bannerPreviews?.length !== 0 &&
                  bannerPreviews?.map((image, index) => {
                    return (
                      <div className="uploadBoxWrapper relative" key={index}>
                        <span
                          className="absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-700 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer"
                          onClick={() => removeBannerImg(image, index)}
                        >
                          <IoMdClose className="text-white text-[17px]" />
                        </span>
                        <div className="uploadBox relative flex h-[150px] w-full items-center justify-center overflow-hidden rounded-[20px] border border-dashed border-[#cfd8e7] bg-white p-1.5 shadow-[0_10px_20px_rgba(15,23,42,0.04)]">
                          <img
                            src={image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    );
                  })}
                <UploadBox
                  multiple={true}
                  name="images"
                  url="/api/product/uploadBannerImages"
                  setBannerImagesFun={setBannerImagesFun}
                />
              </div>

              <h3 className="mb-1.5 mt-5 text-[13px] font-[700] text-slate-700">
                Banner Title
              </h3>
              <input
                type="text"
                className={inputClassName}
                name="bannerTitleName"
                value={formFields.bannerTitleName}
                onChange={onChangeInput}
                placeholder="Enter banner title"
              />
          </div>
          </div>

        <div className="border-t border-[#edf2f7] bg-white/90 px-5 py-5 sm:px-7">
          <Button
            type="submit"
            className="!flex !h-[52px] !w-full !items-center !justify-center !gap-2 !rounded-[18px] !bg-[linear-gradient(135deg,_#14213d,_#3872fa)] !text-[14px] !font-[800] !capitalize !text-white shadow-[0_18px_35px_rgba(56,114,250,0.24)] hover:!opacity-95"
          >
            {isLoading === true ? (
              <CircularProgress color="inherit" size={24} />
            ) : (
              <>
                <FaCloudUploadAlt className="text-[22px] text-white" />
                Publish and View
              </>
            )}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default AddProduct;

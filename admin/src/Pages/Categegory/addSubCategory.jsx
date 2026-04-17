import React, { useContext, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { FaCloudUploadAlt } from "react-icons/fa";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";

const AddSubCategory = () => {
  const [productCat, setProductCat] = useState("");
  const [productCat2, setProductCat2] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [formFields, setFormFields] = useState({
    name: "",
    parentCatName: null,
    parentId: null,
  });
  const [formFields2, setFormFields2] = useState({
    name: "",
    parentCatName: null,
    parentId: null,
  });

  const context = useContext(MyContext);
  const history = useNavigate();
  const categoryData = context?.catData || [];

  const secondLevelOptions = useMemo(
    () =>
      categoryData.flatMap((item) =>
        (item?.children || []).map((child) => ({
          id: child?._id,
          name: child?.name,
          parentName: item?.name,
        })),
      ),
    [categoryData],
  );

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onChangeInput2 = (e) => {
    const { name, value } = e.target;
    setFormFields2((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeProductCat = (event) => {
    setProductCat(event.target.value);
    setFormFields((prev) => ({
      ...prev,
      parentId: event.target.value,
    }));
  };

  const handleChangeProductCat2 = (event) => {
    setProductCat2(event.target.value);
    setFormFields2((prev) => ({
      ...prev,
      parentId: event.target.value,
    }));
  };

  const selectedCatFun = (catName) => {
    setFormFields((prev) => ({
      ...prev,
      parentCatName: catName,
    }));
  };

  const selectedCatFun2 = (catName) => {
    setFormFields2((prev) => ({
      ...prev,
      parentCatName: catName,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formFields.name === "") {
      context.alertBox("error", "Please Category name");
      setIsLoading(false);
      return false;
    }

    if (!productCat) {
      context.alertBox("error", "Please Category");
      setIsLoading(false);
      return false;
    }

    postData(`/api/category/create`, formFields).then(() => {
      setTimeout(() => {
        setIsLoading(false);
        context.setIsOpenFullScreenPanel({
          open: false,
        });
        context?.getCat?.();
      }, 600);
    });
  };

  const handleSubmit2 = (e) => {
    e.preventDefault();
    setIsLoading2(true);

    if (formFields2.name === "") {
      context.alertBox("error", "Please Category name");
      setIsLoading2(false);
      return false;
    }

    if (!productCat2) {
      context.alertBox("error", "Please Category");
      setIsLoading2(false);
      return false;
    }

    postData(`/api/category/create`, formFields2).then(() => {
      setTimeout(() => {
        setIsLoading2(false);
        context.setIsOpenFullScreenPanel({
          open: false,
        });
        context?.getCat?.();
        history("/subCategory/list");
      }, 600);
    });
  };

  const formCardClass =
    "rounded-[22px] border border-[#edf1f7] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]";

  const labelClass = "mb-2 block text-[13px] font-[700] text-[#14213d]";
  const inputClass =
    "h-[44px] w-full rounded-[14px] border border-[#dbe4f0] bg-white px-4 text-[14px] font-[600] text-slate-700 outline-none transition-all focus:border-[#3872fa] focus:shadow-[0_0_0_4px_rgba(56,114,250,0.12)]";

  return (
    <section className="min-h-[calc(100vh-64px)] bg-[linear-gradient(180deg,_#f8fafc_0%,_#f3f7ff_100%)] px-4 py-5 lg:px-6">
      <div className="mx-auto max-w-[1120px]">
        <div className="overflow-hidden rounded-[26px] border border-white/60 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <div className="border-b border-[#edf1f7] bg-[linear-gradient(135deg,_#ffffff_0%,_#f4f8ff_55%,_#eefbf4_100%)] px-5 py-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="max-w-[680px]">
                <p className="text-[12px] font-[800] uppercase tracking-[0.2em] text-[#3872fa]">
                  Catalog Setup
                </p>
                <h2 className="mt-2 text-[24px] font-[900] text-[#14213d]">
                  Add Sub Categories
                </h2>
                <p className="mt-2 text-[13px] leading-6 text-slate-600">
                  Create second-level and third-level categories in a tighter
                  two-card layout that fits laptop screens better.
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#eef4ff] text-[#3872fa]">
                <HiOutlineSquares2X2 className="text-[26px]" />
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-5 xl:grid-cols-2">
            <form className={formCardClass} onSubmit={handleSubmit}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] font-[800] uppercase tracking-[0.14em] text-slate-400">
                    Level 2
                  </p>
                  <h3 className="mt-1 text-[18px] font-[900] text-[#14213d]">
                    Add Sub Category
                  </h3>
                </div>
                <div className="rounded-[14px] bg-[#f7f9fc] px-3 py-2 text-[12px] font-[800] text-slate-500">
                  Parent category
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <label className="block">
                  <span className={labelClass}>Product Category</span>
                  <Select
                    id="productCatDrop"
                    size="small"
                    className="w-full"
                    value={productCat}
                    displayEmpty
                    onChange={handleChangeProductCat}
                  >
                    <MenuItem value="">
                      <em>Select category</em>
                    </MenuItem>
                    {categoryData.map((item) => (
                      <MenuItem
                        key={item?._id}
                        value={item?._id}
                        onClick={() => selectedCatFun(item?.name)}
                      >
                        {item?.name}
                      </MenuItem>
                    ))}
                  </Select>
                </label>

                <label className="block">
                  <span className={labelClass}>Sub Category Name</span>
                  <input
                    type="text"
                    className={inputClass}
                    name="name"
                    onChange={onChangeInput}
                    value={formFields.name}
                    placeholder="Enter sub category name"
                  />
                </label>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  className="!min-w-[210px] !rounded-[16px] !bg-[linear-gradient(135deg,_#14213d,_#3872fa)] !px-5 !py-3 !text-[13px] !font-[800] !capitalize !text-white shadow-[0_14px_30px_rgba(56,114,250,0.22)]"
                >
                  {isLoading ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    <>
                      <FaCloudUploadAlt className="mr-2 text-[20px]" />
                      Publish and View
                    </>
                  )}
                </Button>
              </div>
            </form>

            <form className={formCardClass} onSubmit={handleSubmit2}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] font-[800] uppercase tracking-[0.14em] text-slate-400">
                    Level 3
                  </p>
                  <h3 className="mt-1 text-[18px] font-[900] text-[#14213d]">
                    Add Third Category
                  </h3>
                </div>
                <div className="rounded-[14px] bg-[#f7f9fc] px-3 py-2 text-[12px] font-[800] text-slate-500">
                  Child category
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <label className="block">
                  <span className={labelClass}>Sub Category Parent</span>
                  <Select
                    id="productCatDrop2"
                    size="small"
                    className="w-full"
                    value={productCat2}
                    displayEmpty
                    onChange={handleChangeProductCat2}
                  >
                    <MenuItem value="">
                      <em>Select sub category</em>
                    </MenuItem>
                    {secondLevelOptions.map((item) => (
                      <MenuItem
                        key={item.id}
                        value={item.id}
                        onClick={() => selectedCatFun2(item.name)}
                      >
                        {item.parentName} / {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </label>

                <label className="block">
                  <span className={labelClass}>Third Category Name</span>
                  <input
                    type="text"
                    className={inputClass}
                    name="name"
                    onChange={onChangeInput2}
                    value={formFields2.name}
                    placeholder="Enter third category name"
                  />
                </label>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  className="!min-w-[210px] !rounded-[16px] !bg-[linear-gradient(135deg,_#14213d,_#3872fa)] !px-5 !py-3 !text-[13px] !font-[800] !capitalize !text-white shadow-[0_14px_30px_rgba(56,114,250,0.22)]"
                >
                  {isLoading2 ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    <>
                      <FaCloudUploadAlt className="mr-2 text-[20px]" />
                      Publish and View
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddSubCategory;

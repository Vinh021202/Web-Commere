import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { FaCloudUploadAlt } from "react-icons/fa";
import { HiOutlineCollection } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import UploadBox from "../../Components/UploadBox";
import { MyContext } from "../../App";
import { deleteImages, editData, fetchDataFromApi } from "../../utils/api";

const EditCategory = () => {
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    name: "",
    images: [],
  });

  const context = useContext(MyContext);

  useEffect(() => {
    const id = context?.isOpenFullScreenPanel?.id;

    if (!id) return;

    fetchDataFromApi(`/api/category/${id}`).then((res) => {
      const images = res?.data?.images || [];

      setFormFields({
        name: res?.data?.name || "",
        images,
      });
      setPreviews(images);
    });
  }, [context?.isOpenFullScreenPanel?.id]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: value,
      images: previews,
    }));
  };

  const setPreviewsFun = (previewArr) => {
    setPreviews((prev) => [...prev, ...previewArr]);
    setFormFields((prev) => ({
      ...prev,
      images: [...prev.images, ...previewArr],
    }));
  };

  const removeImg = (image, index) => {
    const imageArr = [...previews];

    deleteImages(`/api/category/deteleImage?img=${image}`).then(() => {
      imageArr.splice(index, 1);
      setPreviews(imageArr);
      setFormFields((prev) => ({
        ...prev,
        images: imageArr,
      }));
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formFields.name === "") {
      context.alertBox("error", "Please Category name");
      setIsLoading(false);
      return false;
    }

    if (previews.length === 0) {
      context.alertBox("error", "Please Category image");
      setIsLoading(false);
      return false;
    }

    editData(`/api/category/${context?.isOpenFullScreenPanel?.id}`, formFields).then(
      () => {
        setTimeout(() => {
          setIsLoading(false);
          context?.getCat?.();
          context.setIsOpenFullScreenPanel({
            open: false,
          });
        }, 300);
      },
    );
  };

  return (
    <section className="min-h-[calc(100vh-64px)] bg-[linear-gradient(180deg,_#f8fafc_0%,_#f3f7ff_100%)] px-4 py-5 lg:px-6">
      <div className="mx-auto max-w-[980px]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="overflow-hidden rounded-[26px] border border-white/60 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
            <div className="border-b border-[#edf1f7] bg-[linear-gradient(135deg,_#ffffff_0%,_#f4f8ff_55%,_#eefbf4_100%)] px-5 py-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="max-w-[620px]">
                  <p className="text-[12px] font-[800] uppercase tracking-[0.2em] text-[#3872fa]">
                    Catalog Setup
                  </p>
                  <h2 className="mt-2 text-[24px] font-[900] text-[#14213d]">
                    Edit Category
                  </h2>
                  <p className="mt-2 text-[13px] leading-6 text-slate-600">
                    Update the category name and image set without leaving the
                    current workspace.
                  </p>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#eef4ff] text-[#3872fa]">
                  <HiOutlineCollection className="text-[26px]" />
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-5 xl:grid-cols-[320px_minmax(0,1fr)]">
              <div className="rounded-[22px] border border-[#edf1f7] bg-[#fbfcff] p-4">
                <p className="text-[12px] font-[800] uppercase tracking-[0.14em] text-slate-400">
                  Category Info
                </p>
                <label className="mt-4 block">
                  <span className="mb-2 block text-[13px] font-[700] text-[#14213d]">
                    Category Name
                  </span>
                  <input
                    type="text"
                    className="h-[44px] w-full rounded-[14px] border border-[#dbe4f0] bg-white px-4 text-[14px] font-[600] text-slate-700 outline-none transition-all focus:border-[#3872fa] focus:shadow-[0_0_0_4px_rgba(56,114,250,0.12)]"
                    name="name"
                    value={formFields.name}
                    onChange={onChangeInput}
                    placeholder="Update category name"
                  />
                </label>

                <div className="mt-4 rounded-[18px] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                  <p className="text-[12px] font-[800] uppercase tracking-[0.14em] text-slate-400">
                    Quick Notes
                  </p>
                  <ul className="mt-3 space-y-2 text-[13px] leading-6 text-slate-500">
                    <li>Keep the category title short and easy to scan.</li>
                    <li>You can remove old images and upload replacements here.</li>
                    <li>Saved changes will update the category list immediately.</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-[22px] border border-[#edf1f7] bg-white p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[12px] font-[800] uppercase tracking-[0.14em] text-slate-400">
                      Category Image
                    </p>
                    <h3 className="mt-1 text-[18px] font-[900] text-[#14213d]">
                      Manage preview images
                    </h3>
                  </div>

                  <div className="rounded-[14px] bg-[#f7f9fc] px-3 py-2 text-[12px] font-[800] text-slate-500">
                    {previews.length} uploaded
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {previews.map((image, index) => (
                    <div className="relative" key={index}>
                      <button
                        type="button"
                        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#0f172a]/75 text-white transition-all hover:bg-[#e11d48]"
                        onClick={() => removeImg(image, index)}
                        aria-label="Remove image"
                      >
                        <IoMdClose className="text-[18px]" />
                      </button>

                      <div className="h-[140px] overflow-hidden rounded-[18px] border border-[#edf1f7] bg-[#f8fafc]">
                        <img
                          src={image}
                          alt="Category preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  ))}

                  <UploadBox
                    multiple={true}
                    name="images"
                    url="/api/category/uploadImages"
                    setPreviewsFun={setPreviewsFun}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="!min-w-[220px] !rounded-[16px] !bg-[linear-gradient(135deg,_#14213d,_#3872fa)] !px-5 !py-3 !text-[13px] !font-[800] !capitalize !text-white shadow-[0_14px_30px_rgba(56,114,250,0.22)]"
            >
              {isLoading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                <>
                  <FaCloudUploadAlt className="mr-2 text-[20px]" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditCategory;

import React, { useContext, useEffect, useState } from "react";
import UploadBox from "../../Components/UploadBox";
import { IoMdClose } from "react-icons/io";
import Button from "@mui/material/Button";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaRegNewspaper } from "react-icons/fa6";
import { deleteImages, editData, fetchDataFromApi } from "../../utils/api";
import { MyContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import Editor from "react-simple-wysiwyg";

const EditBlog = () => {
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [html, setHtml] = useState("");
  const [formFields, setFormFields] = useState({
    title: "",
    images: [],
    description: "",
  });

  const context = useContext(MyContext);
  const navigate = useNavigate();

  useEffect(() => {
    const id = context?.isOpenFullScreenPanel?.id;

    if (!id) {
      setIsFetching(false);
      return;
    }

    fetchDataFromApi(`/api/blog/${id}`).then((res) => {
      setFormFields({
        title: res?.blog?.title || "",
        images: res?.blog?.images || [],
        description: res?.blog?.description || "",
      });
      setPreviews(res?.blog?.images || []);
      setHtml(res?.blog?.description || "");
      setIsFetching(false);
    });
  }, [context?.isOpenFullScreenPanel?.id]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const setPreviewsFun = (previewArr) => {
    setPreviews((prev) => [...prev, ...previewArr]);
    setFormFields((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...previewArr],
    }));
  };

  const removeImg = (image, index) => {
    deleteImages(`/api/blog/deteleImage?img=${image}`).then(() => {
      const imageArr = previews.filter((_, i) => i !== index);
      setPreviews(imageArr);
      setFormFields((prev) => ({
        ...prev,
        images: imageArr,
      }));
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = context?.isOpenFullScreenPanel?.id;
    setIsLoading(true);

    if (formFields.title.trim() === "") {
      context.alertBox("error", "Please enter title");
      setIsLoading(false);
      return;
    }

    if (formFields.description.trim() === "") {
      context.alertBox("error", "Please enter description");
      setIsLoading(false);
      return;
    }

    if (previews?.length === 0) {
      context.alertBox("error", "Please upload blog image");
      setIsLoading(false);
      return;
    }

    editData(`/api/blog/${id}`, formFields).then(() => {
      setTimeout(() => {
        setIsLoading(false);
        context.setIsOpenFullScreenPanel({
          open: false,
        });
        navigate("/blog/list");
      }, 2500);
    });
  };

  const onChangeDescription = (e) => {
    const value = e.target.value;
    setHtml(value);
    setFormFields((prev) => ({
      ...prev,
      description: value,
    }));
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
                <FaRegNewspaper className="text-[24px]" />
              </div>
              <div>
                <p className="text-[11px] font-[800] uppercase tracking-[0.18em] text-slate-400">
                  Update Post
                </p>
                <h2 className="mt-2 text-[26px] font-[900] leading-none text-[#14213d]">
                  Edit Blog Post
                </h2>
                <p className="mt-2 text-[14px] text-slate-500">
                  Update article title, content and uploaded media.
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
                  Loading blog post...
                </span>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 xl:grid-cols-[1.25fr_0.95fr]">
              <div className="rounded-[24px] border border-[#edf2f8] bg-[#fbfcff] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                <div className="mb-5">
                  <p className="text-[11px] font-[800] uppercase tracking-[0.18em] text-[#3872fa]">
                    Article Details
                  </p>
                  <h3 className="mt-2 text-[22px] font-[900] text-[#14213d]">
                    Blog Content
                  </h3>
                  <p className="mt-2 text-[13px] text-slate-500">
                    Update the post title and article content below.
                  </p>
                </div>

                <div className="grid gap-4">
                  <div>
                    <h3 className="mb-2 text-[13px] font-[700] text-[#14213d]">
                      Title
                    </h3>
                    <input
                      type="text"
                      className="h-[48px] w-full rounded-[16px] border border-[#dbe4f0] bg-white px-4 text-sm text-slate-700 outline-none transition-all focus:border-[#3872fa] focus:shadow-[0_0_0_4px_rgba(56,114,250,0.12)]"
                      name="title"
                      value={formFields.title}
                      onChange={onChangeInput}
                      placeholder="Top Accessories for Your Workspace"
                    />
                  </div>

                  <div>
                    <h3 className="mb-2 text-[13px] font-[700] text-[#14213d]">
                      Description
                    </h3>
                    <div className="overflow-hidden rounded-[18px] border border-[#dbe4f0] bg-white">
                      <Editor
                        value={html}
                        onChange={onChangeDescription}
                        containerProps={{ style: { minHeight: "340px" } }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-[#edf2f8] bg-[#fbfcff] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                <div className="mb-4">
                  <p className="text-[11px] font-[800] uppercase tracking-[0.18em] text-[#3872fa]">
                    Cover Preview
                  </p>
                  <h3 className="mt-2 text-[22px] font-[900] text-[#14213d]">
                    Blog Media
                  </h3>
                  <p className="mt-2 text-[13px] text-slate-500">
                    Review existing images and upload new ones when needed.
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
                          alt="Blog preview"
                          className="h-full w-full rounded-[16px] object-cover"
                        />
                      </div>
                    </div>
                  ))}

                  <UploadBox
                    multiple={true}
                    name="images"
                    url="/api/blog/uploadImages"
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

export default EditBlog;

import React, { useContext, useState } from "react";
import "react-lazy-load-image-component/src/effects/blur.css";
import UploadBox from "../../Components/UploadBox";
import { IoMdClose } from "react-icons/io";
import Button from "@mui/material/Button";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaImages } from "react-icons/fa6";
import { MyContext } from "../../App";
import { deleteImages, postData } from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

const normalizeImages = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === "string" && value.trim() !== "") {
    return [value];
  }

  return [];
};

const AddHomeSlide = () => {
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    images: [],
  });

  const context = useContext(MyContext);
  const navigate = useNavigate();

  const setPreviewsFun = (previewValue) => {
    const normalizedImages = normalizeImages(previewValue);

    if (normalizedImages.length === 0) {
      context.alertBox("error", "Upload image failed");
      return;
    }

    setPreviews(normalizedImages);
    setFormFields((prev) => ({
      ...prev,
      images: normalizedImages,
    }));
  };

  const removeImg = (image, index) => {
    deleteImages(`/api/homeSlider/deteleImage?img=${image}`).then(() => {
      const imageArr = normalizeImages(previews).filter((_, i) => i !== index);
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

    const normalizedPreviews = normalizeImages(previews);

    if (normalizedPreviews.length === 0) {
      context.alertBox("error", "Please select a banner image");
      setIsLoading(false);
      return false;
    }

    postData(`/api/homeSlider/add`, {
      ...formFields,
      images: normalizedPreviews,
    }).then(() => {
      setTimeout(() => {
        setIsLoading(false);
        context.setIsOpenFullScreenPanel({
          open: false,
        });
        navigate("/homeSlider/list");
      }, 2500);
    });
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
                <FaImages className="text-[24px]" />
              </div>
              <div>
                <p className="text-[11px] font-[800] uppercase tracking-[0.18em] text-slate-400">
                  New Slide
                </p>
                <h2 className="mt-2 text-[26px] font-[900] leading-none text-[#14213d]">
                  Add Home Banner
                </h2>
                <p className="mt-2 text-[14px] text-slate-500">
                  Upload a homepage hero banner and publish it to the slider.
                </p>
              </div>
            </div>

            <div className="rounded-[18px] border border-[#e6edfb] bg-[#f8faff] px-4 py-3 text-right">
              <p className="text-[11px] font-[800] uppercase tracking-[0.14em] text-slate-400">
                Upload Limit
              </p>
              <p className="mt-1 text-[18px] font-[900] text-[#3872fa]">
                1 Banner
              </p>
            </div>
          </div>
        </div>

        <div className="scroll max-h-[72vh] overflow-y-auto px-5 py-5 sm:px-7">
          <div className="rounded-[24px] border border-[#edf2f8] bg-[#fbfcff] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <div className="mb-4">
              <p className="text-[11px] font-[800] uppercase tracking-[0.18em] text-[#3872fa]">
                Banner Preview
              </p>
              <h3 className="mt-2 text-[22px] font-[900] text-[#14213d]">
                Slider Media
              </h3>
              <p className="mt-2 text-[13px] text-slate-500">
                Use a wide, high-quality image for the best homepage result.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
              {previews?.length !== 0 &&
                previews?.map((image, index) => {
                  return (
                    <div className="uploadBoxWrapper relative" key={index}>
                      <span
                        className="absolute -right-[6px] -top-[6px] z-50 flex h-[22px] w-[22px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-red-600 shadow-[0_8px_18px_rgba(239,68,68,0.35)]"
                        onClick={() => removeImg(image, index)}
                      >
                        <IoMdClose className="text-[17px] text-white" />
                      </span>
                      <div className="uploadBox relative flex h-[170px] w-full items-center justify-center overflow-hidden rounded-[20px] border border-dashed border-[#cfd8e7] bg-white p-1.5 shadow-[0_10px_20px_rgba(15,23,42,0.04)]">
                        <img
                          src={image}
                          alt=""
                          className="h-full w-full rounded-[16px] object-cover"
                        />
                      </div>
                    </div>
                  );
                })}

              {previews.length === 0 && (
                <UploadBox
                  multiple={false}
                  name="images"
                  url="/api/homeSlider/uploadImages"
                  setPreviewsFun={setPreviewsFun}
                />
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-[#edf2f7] bg-white/90 px-5 py-5 sm:px-7">
          <div className="w-full sm:w-[260px]">
            <Button
              type="submit"
              className="!flex !h-[52px] !w-full !items-center !justify-center !gap-2 !rounded-[18px] !bg-[linear-gradient(135deg,_#14213d,_#3872fa)] !text-[14px] !font-[800] !capitalize !text-white shadow-[0_18px_35px_rgba(56,114,250,0.24)]"
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
        </div>
      </form>
    </section>
  );
};

export default AddHomeSlide;

import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { FaCloudUploadAlt } from "react-icons/fa";
import { AiOutlineEdit } from "react-icons/ai";
import { GoTrash } from "react-icons/go";
import { HiOutlineScale } from "react-icons/hi";
import { MyContext } from "../../App";
import {
  deleteData,
  editData,
  fetchDataFromApi,
  postData,
} from "../../utils/api";

const inputClassName =
  "h-[48px] w-full rounded-[18px] border border-slate-200 bg-[#fcfcfd] px-4 text-[13px] text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#3872fa] focus:bg-white focus:shadow-[0_0_0_4px_rgba(56,114,250,0.12)]";

const AddWeight = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState("");

  const context = useContext(MyContext);

  const getWeights = () => {
    fetchDataFromApi(`/api/product/productWeight/get`).then((res) => {
      if (res?.error === false) {
        setData(res?.data);
      }
    });
  };

  useEffect(() => {
    getWeights();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || name === "") {
      context.alertBox("error", "Please enter product Weight name");
      return false;
    }

    setIsLoading(true);

    if (editId === "") {
      postData(`/api/product/productWeight/create`, { name }).then((res) => {
        if (res?.error === false) {
          context.alertBox("success", res?.message);
          setName("");
          setEditId("");
          getWeights();
        } else {
          context.alertBox("error", res?.message);
        }
        setIsLoading(false);
      });
    } else {
      editData(`/api/product/productWeight/${editId}`, { name }).then((res) => {
        if (res?.data?.error === false) {
          context.alertBox("success", res?.data?.message);
          setName("");
          setEditId("");
          getWeights();
        } else {
          context.alertBox("error", res?.data?.message);
        }
        setIsLoading(false);
      });
    }
  };

  const editItem = (id) => {
    fetchDataFromApi(`/api/product/productWeight/${id}`).then((res) => {
      setName(res?.data?.name);
      setEditId(res?.data?._id);
    });
  };

  const deleteItems = (id) => {
    deleteData(`/api/product/productWeight/${id}`).then(() => {
      getWeights();
      context.alertBox("success", "Item deleted");
    });
  };

  return (
    <section className="p-4 sm:p-5">
      <div className="mb-6 flex items-center justify-between gap-6 rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,_rgba(255,255,255,0.92),_rgba(245,247,255,0.96))] p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,_#14213d,_#3872fa)] text-white shadow-[0_16px_35px_rgba(56,114,250,0.20)]">
            <HiOutlineScale className="text-[26px]" />
          </div>
          <div>
            <p className="text-[11px] font-[800] uppercase tracking-[0.18em] text-slate-400">
              Product Option
            </p>
            <h2 className="mt-2 text-[28px] font-[900] leading-none text-[#14213d]">
              Product Weight
            </h2>
            <p className="mt-2 text-[14px] text-slate-500">
              Create and manage weight options used across your product catalog.
            </p>
          </div>
        </div>

        <div className="rounded-[18px] border border-[#e6edfb] bg-white/80 px-4 py-3 text-right shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
          <p className="text-[11px] font-[800] uppercase tracking-[0.14em] text-slate-400">
            Total Options
          </p>
          <p className="mt-1 text-[22px] font-[900] text-[#3872fa]">
            {data?.length || 0}
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
          <p className="text-[11px] font-[800] uppercase tracking-[0.18em] text-[#3872fa]">
            {editId ? "Update Weight" : "Add Weight"}
          </p>
          <h3 className="mt-2 text-[22px] font-[900] text-[#14213d]">
            {editId ? "Edit product weight option" : "Create new weight option"}
          </h3>

          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="mb-1.5 block text-[13px] font-[700] text-slate-700">
                Product Weight
              </label>
              <input
                type="text"
                className={inputClassName}
                name="name"
                value={name}
                placeholder="Example: 1kg"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="!flex !h-[50px] !w-full !items-center !justify-center !gap-2 !rounded-[18px] !bg-[linear-gradient(135deg,_#14213d,_#3872fa)] !text-[13px] !font-[800] !capitalize !text-white shadow-[0_18px_35px_rgba(56,114,250,0.24)]"
            >
              {isLoading ? (
                <CircularProgress color="inherit" size={22} />
              ) : (
                <>
                  <FaCloudUploadAlt className="text-[22px] text-white" />
                  {editId ? "Update Weight" : "Publish and View"}
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between border-b border-[#eef2f7] pb-4">
            <div>
              <p className="text-[11px] font-[800] uppercase tracking-[0.18em] text-slate-400">
                Existing Items
              </p>
              <h3 className="mt-2 text-[22px] font-[900] text-[#14213d]">
                Weight List
              </h3>
            </div>
          </div>

          {data?.length !== 0 ? (
            <div className="mt-5 overflow-hidden rounded-[22px] border border-[#edf2f8] bg-[#fcfdff]">
              <table className="w-full text-left text-sm text-gray-700">
                <thead className="bg-[#f8fbff] text-[11px] uppercase tracking-[0.14em] text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-[800]" width="60%">
                      Product Weight
                    </th>
                    <th className="px-5 py-4 font-[800]" width="30%">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, index) => (
                    <tr
                      className="border-t border-[#eef2f7] bg-white"
                      key={index}
                    >
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full border border-[#dbe6ff] bg-[#f5f8ff] px-3 py-1.5 text-[12px] font-[800] text-[#3872fa]">
                          {item?.name}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Button
                            className="!h-[40px] !min-w-[40px] !rounded-[14px] !border !border-[#e7ebf3] !bg-white !text-slate-600 hover:!bg-[#f8fbff]"
                            onClick={() => editItem(item?._id)}
                          >
                            <AiOutlineEdit className="text-[19px]" />
                          </Button>

                          <Button
                            className="!h-[40px] !min-w-[40px] !rounded-[14px] !border !border-[#ffe0e0] !bg-[#fff5f5] !text-[#ef4444]"
                            onClick={() => deleteItems(item?._id)}
                          >
                            <GoTrash className="text-[18px]" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-5 rounded-[22px] border border-dashed border-slate-200 bg-[#fafafa] px-4 py-12 text-center">
              <p className="text-[14px] font-[800] text-slate-700">
                No weight option yet
              </p>
              <p className="mt-2 text-[13px] text-slate-500">
                Create your first weight option to use it in products.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AddWeight;

import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import { AiOutlineEdit } from "react-icons/ai";
import { GoTrash } from "react-icons/go";
import { IoMdAdd } from "react-icons/io";
import { FaRegImages } from "react-icons/fa6";
import { MyContext } from "../../App";
import {
  deleteData,
  deleteMultipleData,
  fetchDataFromApi,
} from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const columns = [
  { id: "image", label: "IMAGE", minWidth: 150 },
  { id: "action", label: "ACTION", minWidth: 100 },
];

const BannersV1List = () => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [slidesData, setSlidesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortedIds, setSortedIds] = useState([]);

  const context = useContext(MyContext);

  useEffect(() => {
    getData();
  }, [context?.isOpenFullScreenPanel]);

  const getData = () => {
    setIsLoading(true);
    fetchDataFromApi(`/api/bannerV1`).then((res) => {
      const arr = [];
      if (res?.error === false) {
        for (let i = 0; i < res?.data?.length; i++) {
          arr[i] = res?.data[i];
          arr[i].checked = false;
        }
      }

      setTimeout(() => {
        setSlidesData(arr);
        setIsLoading(false);
      }, 300);
    });
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;

    const updateItems = slidesData.map((item) => ({
      ...item,
      checked: isChecked,
    }));
    setSlidesData(updateItems);

    if (isChecked) {
      const ids = updateItems
        .map((item) => item._id)
        .sort((a, b) => `${a}`.localeCompare(`${b}`));
      setSortedIds(ids);
    } else {
      setSortedIds([]);
    }
  };

  const handleCheckboxChange = (e, id) => {
    const updateItems = slidesData.map((item) =>
      item._id === id ? { ...item, checked: !item.checked } : item,
    );

    setSlidesData(updateItems);

    const selectedIds = updateItems
      .filter((item) => item.checked)
      .map((item) => item._id)
      .sort((a, b) => `${a}`.localeCompare(`${b}`));
    setSortedIds(selectedIds);
  };

  const deleteMultipleProduct = () => {
    if (sortedIds.length === 0) {
      context.alertBox("error", "please select items to delete");
      return;
    }

    try {
      deleteMultipleData(`/api/bannerV1/deleteMultiple`, sortedIds).then(() => {
        getData();
        context.alertBox("success", "Banners deleted");
      });
    } catch (error) {
      context.alertBox("error", "Error deleting item");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deleteSlide = (id) => {
    deleteData(`/api/bannerV1/${id}`).then(() => {
      context.alertBox("success", "Banner deleted");
      getData();
    });
  };

  const paginatedSlides = slidesData?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-6 rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,_rgba(255,255,255,0.92),_rgba(245,247,255,0.96))] p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,_#14213d,_#3872fa)] text-white shadow-[0_16px_35px_rgba(56,114,250,0.20)]">
            <FaRegImages className="text-[24px]" />
          </div>
          <div>
            <p className="text-[11px] font-[800] uppercase tracking-[0.18em] text-slate-400">
              Banner Manager
            </p>
            <h2 className="mt-2 text-[28px] font-[900] leading-none text-[#14213d]">
              Banners List
            </h2>
            <p className="mt-2 text-[14px] text-slate-500">
              Manage banner blocks displayed across the storefront.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-[18px] border border-[#e6edfb] bg-white/80 px-4 py-3 text-right shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
            <p className="text-[11px] font-[800] uppercase tracking-[0.14em] text-slate-400">
              Total Banners
            </p>
            <p className="mt-1 text-[22px] font-[900] text-[#3872fa]">
              {slidesData?.length || 0}
            </p>
          </div>

          {sortedIds?.length !== 0 && (
            <Button
              variant="contained"
              color="error"
              onClick={deleteMultipleProduct}
              className="!rounded-[16px] !px-4 !py-3 !text-[13px] !font-[800] !capitalize"
            >
              Delete Selected
            </Button>
          )}

          <Button
            className="!rounded-[16px] !bg-[linear-gradient(135deg,_#14213d,_#3872fa)] !px-4 !py-3 !text-[13px] !font-[800] !capitalize !text-white shadow-[0_16px_35px_rgba(56,114,250,0.22)]"
            onClick={() =>
              context.setIsOpenFullScreenPanel({
                open: true,
                model: "Add BannerV1",
              })
            }
          >
            <IoMdAdd className="mr-1 text-[18px]" />
            Add BannerV1
          </Button>
        </div>
      </div>

      <div className="card my-6 overflow-hidden rounded-[28px] border border-white/70 bg-white/90 pt-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between border-b border-[#eef2f7] px-6 pb-5">
          <div>
            <p className="text-[11px] font-[800] uppercase tracking-[0.18em] text-slate-400">
              Banner Assets
            </p>
            <h3 className="mt-2 text-[22px] font-[900] text-[#14213d]">
              Active Banners
            </h3>
          </div>
          <div className="rounded-[16px] border border-[#e6edfb] bg-[#f8faff] px-4 py-3 text-right">
            <p className="text-[11px] font-[800] uppercase tracking-[0.14em] text-slate-400">
              Selected
            </p>
            <p className="mt-1 text-[18px] font-[900] text-[#3872fa]">
              {sortedIds?.length || 0}
            </p>
          </div>
        </div>

        <div className="px-6 pb-4 pt-5">
          <div className="overflow-hidden rounded-[24px] border border-[#edf2f8] bg-[#fcfdff] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
            <TableContainer sx={{ maxHeight: 560 }}>
              <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell
                  width={60}
                  sx={{
                    backgroundColor: "#f8fbff",
                    borderBottom: "1px solid #e8eef7",
                    py: 1.8,
                  }}
                >
                  <Checkbox
                    {...label}
                    size="small"
                    onChange={handleSelectAll}
                    checked={
                      slidesData?.length > 0
                        ? slidesData.every((item) => item.checked)
                        : false
                    }
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    width={column.width}
                    key={column.id}
                    align={column.align}
                    sx={{
                      backgroundColor: "#f8fbff",
                      borderBottom: "1px solid #e8eef7",
                      py: 1.8,
                      color: "#64748b",
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "0.14em",
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <div className="flex min-h-[320px] w-full items-center justify-center">
                      <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-[0_10px_25px_rgba(15,23,42,0.06)]">
                        <CircularProgress size={22} color="inherit" />
                        <span className="text-[13px] font-[700] text-slate-600">
                          Loading banners...
                        </span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedSlides?.length !== 0 ? (
                paginatedSlides?.map((item, index) => (
                  <TableRow
                    key={item?._id || index}
                    hover
                    sx={{
                      "& td": {
                        borderBottom: "1px solid #eef3f9",
                        py: 2,
                        verticalAlign: "middle",
                      },
                      "&:last-child td": {
                        borderBottom: "none",
                      },
                    }}
                  >
                      <TableCell width={80}>
                        <Checkbox
                          {...label}
                          size="small"
                          checked={item.checked === true}
                          onChange={(e) => handleCheckboxChange(e, item._id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="w-[380px] overflow-hidden rounded-[20px] border border-[#e8eef7] bg-white p-2 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
                          <div className="overflow-hidden rounded-[16px]">
                            <img
                              src={item?.images?.[0]}
                              className="h-[150px] w-full object-cover transition-all duration-300 hover:scale-[1.03]"
                            />
                          </div>
                          <div className="flex items-center justify-between px-1 pb-1 pt-3">
                            <span className="text-[12px] font-[800] text-[#14213d]">
                              {item?.bannerTitle || "Banner V1"}
                            </span>
                            <span className="rounded-full bg-[#f4f8ff] px-2.5 py-1 text-[10px] font-[800] uppercase tracking-[0.12em] text-[#3872fa]">
                              {item?.alignInfo || "default"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell width={220}>
                        <div className="flex items-center gap-2">
                          <Button
                            className="!h-[40px] !min-w-[40px] !rounded-[14px] !border !border-[#e7ebf3] !bg-white !text-slate-600"
                            onClick={() =>
                              context.setIsOpenFullScreenPanel({
                                open: true,
                                model: "Edit BannerV1",
                                id: item._id,
                              })
                            }
                          >
                            <AiOutlineEdit className="text-[19px]" />
                          </Button>

                          <Button
                            className="!h-[40px] !min-w-[40px] !rounded-[14px] !border !border-[#ffe0e0] !bg-[#fff5f5] !text-[#ef4444]"
                            onClick={() => deleteSlide(item?._id)}
                          >
                            <GoTrash className="text-[18px]" />
                          </Button>
                        </div>
                      </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3}>
                    <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#f4f7ff] text-[#3872fa] shadow-[0_12px_30px_rgba(56,114,250,0.08)]">
                        <FaRegImages className="text-[28px]" />
                      </div>
                      <h4 className="mt-5 text-[18px] font-[900] text-[#14213d]">
                        No banners yet
                      </h4>
                      <p className="mt-2 max-w-[320px] text-[13px] leading-6 text-slate-500">
                        Add your first banner to start displaying promotional
                        blocks on the storefront.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
            </TableContainer>
          </div>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={slidesData?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </>
  );
};

export default BannersV1List;

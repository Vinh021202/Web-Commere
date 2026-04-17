import React, { useContext, useEffect, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { AiOutlineEdit } from "react-icons/ai";
import { GoTrash } from "react-icons/go";
import { HiOutlineCollection, HiOutlineFolderOpen } from "react-icons/hi";
import { IoMdAdd } from "react-icons/io";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import SearchBox from "../../Components/SearchBox";
import { MyContext } from "../../App";
import { deleteData, fetchDataFromApi } from "../../utils/api";

const columns = [
  { id: "image", label: "Category" },
  { id: "subCategories", label: "Sub Categories" },
  { id: "action", label: "Actions" },
];

const Category = () => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const context = useContext(MyContext);

  const loadCategories = () => {
    fetchDataFromApi(`/api/category`).then((res) => {
      context?.setCatData(res?.data || []);
    });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const categoryData = context?.catData || [];

  const filteredCategories = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) return categoryData;

    return categoryData.filter((item) => {
      const childNames =
        item?.children?.map((child) => child?.name?.toLowerCase()).join(" ") || "";

      return (
        item?.name?.toLowerCase().includes(normalizedQuery) ||
        childNames.includes(normalizedQuery)
      );
    });
  }, [categoryData, searchQuery]);

  const paginatedCategories = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredCategories.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredCategories, page, rowsPerPage]);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(filteredCategories.length / rowsPerPage) - 1);

    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [filteredCategories.length, page, rowsPerPage]);

  const stats = useMemo(
    () => [
      {
        label: "Total Categories",
        value: categoryData.length,
        icon: <HiOutlineCollection className="text-[20px]" />,
        tone: "from-[#14213d] to-[#3872fa]",
      },
      {
        label: "Visible Results",
        value: filteredCategories.length,
        icon: <HiOutlineFolderOpen className="text-[20px]" />,
        tone: "from-[#0f9f6e] to-[#34d399]",
      },
    ],
    [categoryData.length, filteredCategories.length],
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deleteCat = (id) => {
    deleteData(`/api/category/${id}`).then(() => {
      loadCategories();
    });
  };

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-[24px] border border-white/60 bg-[linear-gradient(135deg,_#ffffff_0%,_#f3f7ff_55%,_#eef4ec_100%)] p-4 shadow-[0_16px_40px_rgba(15,23,42,0.07)]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[680px]">
            <p className="text-[12px] font-[800] uppercase tracking-[0.22em] text-[#3872fa]">
              Catalog Control
            </p>
            <h1 className="mt-2 text-[24px] font-[900] leading-tight text-[#14213d]">
              Category Library
            </h1>
            <p className="mt-1.5 text-[13px] leading-6 text-slate-600">
              Manage storefront categories with a cleaner overview, quick search,
              and direct edit actions for your product structure.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              className="!min-w-[158px] !rounded-[14px] !border !border-[#dbe7ff] !bg-white !px-4 !py-2 !text-[13px] !font-[800] !capitalize !text-[#24324d]"
              onClick={loadCategories}
            >
              Refresh Categories
            </Button>
            <Button
              className="!min-w-[176px] !rounded-[14px] !bg-[linear-gradient(135deg,_#14213d,_#3872fa)] !px-4 !py-2 !text-[13px] !font-[800] !capitalize !text-white shadow-[0_12px_26px_rgba(56,114,250,0.2)]"
              onClick={() =>
                context.setIsOpenFullScreenPanel({
                  open: true,
                  model: "Add New Category",
                })
              }
            >
              <IoMdAdd className="mr-2 text-[18px]" />
              Add New Category
            </Button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {stats.map((item) => (
            <div
              key={item.label}
              className={`rounded-[22px] bg-gradient-to-br ${item.tone} p-[1px]`}
            >
              <div className="flex items-center justify-between rounded-[21px] bg-white/92 px-4 py-3.5 backdrop-blur">
                <div>
                  <p className="text-[12px] font-[800] uppercase tracking-[0.14em] text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-1.5 text-[24px] font-[900] leading-none text-[#14213d]">
                    {item.value}
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-[#eef4ff] text-[#3872fa]">
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,260px)_1fr]">
        <SearchBox
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPageOrder={setPage}
        />

        <section className="overflow-hidden rounded-[24px] border border-[#edf1f7] bg-white shadow-[0_16px_36px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-3 border-b border-[#edf1f7] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[12px] font-[800] uppercase tracking-[0.16em] text-slate-400">
                Category Table
              </p>
              <h2 className="mt-1 text-[18px] font-[900] text-[#14213d]">
                Browse and update categories
              </h2>
            </div>

            <div className="rounded-[14px] bg-[#f7f9fc] px-3.5 py-2.5 text-[12px] font-[700] text-slate-500">
              {filteredCategories.length} items found
            </div>
          </div>

          <TableContainer sx={{ maxHeight: 560 }}>
            <Table stickyHeader aria-label="category table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      sx={{
                        borderBottom: "1px solid #edf1f7",
                        backgroundColor: "#f8fbff",
                        color: "#64748b",
                        fontSize: "12px",
                        fontWeight: 800,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedCategories.length > 0 ? (
                  paginatedCategories.map((item) => {
                    const imageUrl = item?.images?.[0];
                    const childCount = item?.children?.length || 0;

                    return (
                      <TableRow
                        key={item?._id}
                        hover
                        sx={{
                          "& td": {
                            borderBottom: "1px solid #f1f5f9",
                          },
                        }}
                      >
                        <TableCell sx={{ py: 1.8 }}>
                          <div className="flex items-center gap-4">
                            <div className="flex h-[56px] w-[56px] items-center justify-center overflow-hidden rounded-[16px] bg-[#f8fafc]">
                              {imageUrl ? (
                                <LazyLoadImage
                                  alt={item?.name}
                                  effect="blur"
                                  className="h-full w-full object-cover"
                                  src={imageUrl}
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-[#94a3b8]">
                                  <HiOutlineCollection className="text-[24px]" />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="text-[14px] font-[800] text-[#14213d]">
                                {item?.name}
                              </p>
                              <p className="mt-1 text-[12px] font-[600] text-slate-500">
                                ID: {item?._id}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell sx={{ py: 1.8 }}>
                          <div className="flex items-center gap-3">
                            <span className="inline-flex rounded-full bg-[#e9f3ff] px-3 py-1 text-[12px] font-[800] text-[#1d4ed8]">
                              {childCount} sub categories
                            </span>
                            <span className="text-[13px] font-[600] text-slate-500">
                              {childCount > 0
                                ? "Ready for product grouping"
                                : "No child categories yet"}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell sx={{ py: 1.8 }}>
                          <div className="flex items-center gap-2">
                            <Button
                              className="!min-w-[40px] !rounded-[12px] !bg-[#eef4ff] !px-3 !py-2 !text-[#3872fa] hover:!bg-[#dfeaff]"
                              onClick={() =>
                                context.setIsOpenFullScreenPanel({
                                  open: true,
                                  model: "Edit Category",
                                  id: item?._id,
                                })
                              }
                            >
                              <AiOutlineEdit className="text-[18px]" />
                            </Button>
                            <Button
                              className="!min-w-[40px] !rounded-[12px] !bg-[#fff1f2] !px-3 !py-2 !text-[#e11d48] hover:!bg-[#ffe4e6]"
                              onClick={() => deleteCat(item?._id)}
                            >
                              <GoTrash className="text-[17px]" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} sx={{ py: 8 }}>
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#eef4ff] text-[#3872fa]">
                          <HiOutlineFolderOpen className="text-[30px]" />
                        </div>
                        <h3 className="mt-4 text-[18px] font-[800] text-[#14213d]">
                          No categories found
                        </h3>
                        <p className="mt-2 max-w-[360px] text-[13px] leading-6 text-slate-500">
                          Try another keyword or create a new category to start
                          organizing your product catalog.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredCategories.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </section>
      </div>
    </div>
  );
};

export default Category;

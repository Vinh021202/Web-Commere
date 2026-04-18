import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { FaRegEye } from "react-icons/fa6";
import { GoTrash } from "react-icons/go";
import { IoMdAdd } from "react-icons/io";
import { HiOutlineCube } from "react-icons/hi2";
import SearchBox from "../../Components/SearchBox";
import { MyContext } from "../../App";
import {
  deleteData,
  deleteMultipleData,
  fetchDataFromApi,
} from "../../utils/api";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import CircularProgress from "@mui/material/CircularProgress";
import Rating from "@mui/material/Rating";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const columns = [
  { id: "product", label: "PRODUCT", minWidth: 150 },
  { id: "category", label: "CATEGORY", minWidth: 100 },
  { id: "subcategory", label: "SUB CATEGORY", minWidth: 150 },
  { id: "price", label: "PRICE", minWidth: 150 },
  { id: "sales", label: "SALES", minWidth: 150 },
  { id: "rating", label: "RATING", minWidth: 150 },
  { id: "action", label: "ACTION", minWidth: 150 },
];

const productFontFamily = '"Montserrat", "Segoe UI", sans-serif';

const copy = {
  VN: {
    productManager: "Quan ly san pham",
    products: "San pham",
    subtitle: "Xem, loc va quan ly kho hang trong mot noi.",
    totalProducts: "Tong san pham",
    deleteSelected: "Xoa da chon",
    export: "Xuat file",
    addProduct: "Them san pham",
    inventory: "Kho hang",
    overview: "Tong quan san pham",
    selected: "Da chon",
    category: "Danh muc",
    subCategory: "Danh muc con",
    thirdLevel: "Cap 3",
    chooseCategory: "Chon danh muc",
    chooseSubCategory: "Chon danh muc con",
    chooseThirdLevel: "Chon cap 3",
    noBrand: "Khong co thuong hieu",
    uncategorized: "Chua phan loai",
    noSubCategory: "Khong co danh muc con",
    sale: "luot ban",
    rating: "danh gia",
    noProductsFound: "Khong tim thay san pham",
    noProductsText:
      "Thu doi bo loc hoac tu khoa tim kiem de xem them san pham trong kho.",
    productDeleted: "Da xoa san pham",
    selectDeleteItems: "Vui long chon muc can xoa",
    deleteError: "Co loi khi xoa muc",
  },
  EU: {
    productManager: "Product Manager",
    products: "Products",
    subtitle: "Browse, filter and manage your inventory in one place.",
    totalProducts: "Total Products",
    deleteSelected: "Delete Selected",
    export: "Export",
    addProduct: "Add Product",
    inventory: "Inventory",
    overview: "Product Overview",
    selected: "Selected",
    category: "Category",
    subCategory: "Sub Category",
    thirdLevel: "Third Level",
    chooseCategory: "Choose category",
    chooseSubCategory: "Choose sub category",
    chooseThirdLevel: "Choose third level",
    noBrand: "No brand",
    uncategorized: "Uncategorized",
    noSubCategory: "No sub category",
    sale: "sale",
    rating: "rating",
    noProductsFound: "No products found",
    noProductsText:
      "Try changing the filters or search keyword to see more products in your inventory.",
    productDeleted: "Product deleted",
    selectDeleteItems: "Please select items to delete",
    deleteError: "Error deleting item",
  },
};

const selectSx = {
  width: "100%",
  borderRadius: "18px",
  backgroundColor: "#fbfcff",
  boxShadow: "0 10px 24px rgba(15,23,42,0.04)",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#dbe4f0",
    borderWidth: "1px",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#bfd0ea",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#3872fa",
    borderWidth: "1px",
    boxShadow: "0 0 0 4px rgba(56,114,250,0.12)",
  },
  "& .MuiSelect-select": {
    minHeight: "unset",
    padding: "13px 16px",
    fontSize: "13px",
    fontWeight: 700,
    color: "#1e293b",
    display: "flex",
    alignItems: "center",
  },
  "& .MuiSvgIcon-root": {
    color: "#64748b",
    right: "10px",
  },
};

const Products = () => {
  const [productCat, setProductCat] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [productData, setProductData] = useState([]);
  const [productSubCat, setProductSubCat] = useState("");
  const [productThirLaveldCat, setProductThirLaveldCat] = useState("");
  const [sortedIds, setSortedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [productTotalData, setProductTotalData] = useState([]);
  const [pageOrder, setPageOrder] = useState(1);

  const context = useContext(MyContext);
  const c = copy[context.language] || copy.EU;

  useEffect(() => {
    getProducts();
  }, [context?.refreshData]);

  useEffect(() => {
    if (searchQuery !== "") {
      const filteredOrders = productTotalData?.filter(
        (product) =>
          product?._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product?.catName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product?.subCat?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setProductData(filteredOrders);
    } else {
      fetchDataFromApi(`/api/product/getAllProducts`).then((res) => {
        if (res?.error === false) {
          const productArr = res?.products?.map((product) => ({
            ...product,
            checked: false,
          }));
          setProductData(productArr);
          setProductTotalData(productArr);
        }
      });
    }
  }, [searchQuery]);

  const getProducts = async () => {
    setIsLoading(true);
    fetchDataFromApi(`/api/product/getAllProducts`).then((res) => {
      let productArr = [];
      if (res?.error === false) {
        for (let i = 0; i < res?.products?.length; i++) {
          productArr[i] = res?.products[i];
          productArr[i].checked = false;
        }
        setTimeout(() => {
          setProductData(productArr);
          setProductTotalData(productArr);
          setIsLoading(false);
        }, 300);
      }
    });
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;

    const updateItems = productData.map((item) => ({
      ...item,
      checked: isChecked,
    }));
    setProductData(updateItems);

    if (isChecked) {
      const ids = updateItems.map((item) => item._id).sort((a, b) => a - b);
      setSortedIds(ids);
    } else {
      setSortedIds([]);
    }
  };

  const handleCheckboxChange = (e, id) => {
    const updateItems = productData.map((item) =>
      item._id === id ? { ...item, checked: !item.checked } : item,
    );

    setProductData(updateItems);

    const selectedIds = updateItems
      .filter((item) => item.checked)
      .map((item) => item._id)
      .sort((a, b) => a - b);
    setSortedIds(selectedIds);
  };

  const deleteProduct = (id) => {
    deleteData(`/api/product/${id}`).then(() => {
      getProducts();
      context.alertBox("success", c.productDeleted);
    });
  };

  const deleteMultipleProduct = () => {
    if (sortedIds.length === 0) {
      context.alertBox("error", c.selectDeleteItems);
      return;
    }

    try {
      deleteMultipleData(`/api/product/deleteMultiple`, sortedIds).then(() => {
        getProducts();
        context.alertBox("success", c.productDeleted);
      });
    } catch (error) {
      context.alertBox("error", c.deleteError);
    }
  };

  const handleChangeProductCat = (event) => {
    const value = event.target.value;
    setProductCat(value);
    setProductSubCat("");
    setProductThirLaveldCat("");
    setIsLoading(true);

    fetchDataFromApi(`/api/product/getAllProductsByCatId/${value}`).then(
      (res) => {
        if (res?.error === false) {
          setProductData(res?.products);
          setTimeout(() => {
            setIsLoading(false);
          }, 300);
        }
      },
    );
  };

  const handleChangeProductSudCat = (event) => {
    const value = event.target.value;
    setProductCat("");
    setProductSubCat(value);
    setProductThirLaveldCat("");
    setIsLoading(true);
    fetchDataFromApi(`/api/product/getAllProductsBySubCatId/${value}`).then(
      (res) => {
        if (res?.error === false) {
          setProductData(res?.products);
          setTimeout(() => {
            setIsLoading(false);
          }, 300);
        }
      },
    );
  };

  const handleChangeProductThirLavelCat = (event) => {
    const value = event.target.value;
    setProductThirLaveldCat(value);
    setProductCat("");
    setProductSubCat("");
    setIsLoading(true);
    fetchDataFromApi(
      `/api/product/getAllProductsByThirdLavelCat/${value}`,
    ).then((res) => {
      if (res?.error === false) {
        setProductData(res?.products);
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const paginatedProducts = productData?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-6 rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,_rgba(255,255,255,0.92),_rgba(245,247,255,0.96))] p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,_#14213d,_#3872fa)] text-white shadow-[0_16px_35px_rgba(56,114,250,0.20)]">
            <HiOutlineCube className="text-[26px]" />
          </div>
          <div>
            <p className="text-[11px] font-[800] uppercase tracking-[0.18em] text-slate-400">
              {c.productManager}
            </p>
            <h2 className="mt-2 text-[28px] font-[900] leading-none text-[#14213d]">
              {c.products}
            </h2>
            <p className="mt-2 text-[14px] text-slate-500">
              {c.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-[18px] border border-[#e6edfb] bg-white/80 px-4 py-3 text-right shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
            <p className="text-[11px] font-[800] uppercase tracking-[0.14em] text-slate-400">
              {c.totalProducts}
            </p>
            <p className="mt-1 text-[22px] font-[900] text-[#3872fa]">
              {productData?.length || 0}
            </p>
          </div>

          {sortedIds?.length !== 0 && (
            <Button
              variant="contained"
              color="error"
              onClick={deleteMultipleProduct}
              className="!rounded-[16px] !px-4 !py-3 !text-[13px] !font-[800] !capitalize"
            >
              {c.deleteSelected}
            </Button>
          )}

          <Button className="!rounded-[16px] !bg-[#16a34a] !px-4 !py-3 !text-[13px] !font-[800] !capitalize !text-white shadow-[0_16px_35px_rgba(22,163,74,0.18)]">
            {c.export}
          </Button>

          <Button
            className="!rounded-[16px] !bg-[linear-gradient(135deg,_#14213d,_#3872fa)] !px-4 !py-3 !text-[13px] !font-[800] !capitalize !text-white shadow-[0_16px_35px_rgba(56,114,250,0.22)]"
            onClick={() =>
              context.setIsOpenFullScreenPanel({
                open: true,
                model: "Add Product",
              })
            }
          >
            <IoMdAdd className="mr-1 text-[18px]" />
            {c.addProduct}
          </Button>
        </div>
      </div>

      <div className="card my-6 overflow-hidden rounded-[28px] border border-white/70 bg-white/90 pt-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between border-b border-[#eef2f7] px-6 pb-5">
          <div>
            <p className="text-[11px] font-[800] uppercase tracking-[0.18em] text-slate-400">
              {c.inventory}
            </p>
            <h3 className="mt-2 text-[22px] font-[900] text-[#14213d]">
              {c.overview}
            </h3>
          </div>
          <div className="rounded-[16px] border border-[#e6edfb] bg-[#f8faff] px-4 py-3 text-right">
            <p className="text-[11px] font-[800] uppercase tracking-[0.14em] text-slate-400">
              {c.selected}
            </p>
            <p className="mt-1 text-[18px] font-[900] text-[#3872fa]">
              {sortedIds?.length || 0}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 px-6 pt-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="grid flex-1 gap-4 md:grid-cols-2 xl:grid-cols-[0.9fr_0.9fr_1.1fr]">
            <div className="col rounded-[22px] border border-[#edf2f8] bg-[linear-gradient(180deg,_#ffffff,_#f8fbff)] p-4 shadow-[0_10px_25px_rgba(15,23,42,0.03)]">
              <h3 className="mb-2 text-[12px] font-[800] uppercase tracking-[0.08em] text-slate-500">
                {c.category}
              </h3>
              {context?.catData?.length !== 0 && (
                <Select
                  size="small"
                  displayEmpty
                  sx={selectSx}
                  value={productCat}
                  onChange={handleChangeProductCat}
                  renderValue={(selected) => {
                    if (!selected) {
                      return c.chooseCategory;
                    }

                    const selectedCategory = context?.catData?.find(
                      (cat) => cat?._id === selected,
                    );

                    return selectedCategory?.name || c.chooseCategory;
                  }}
                >
                  <MenuItem value="">
                    <em>{c.chooseCategory}</em>
                  </MenuItem>
                  {context?.catData.map((cat, index) => (
                    <MenuItem value={cat?._id} key={index}>
                      {cat?.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </div>

            <div className="col rounded-[22px] border border-[#edf2f8] bg-[linear-gradient(180deg,_#ffffff,_#f8fbff)] p-4 shadow-[0_10px_25px_rgba(15,23,42,0.03)]">
              <h3 className="mb-2 text-[12px] font-[800] uppercase tracking-[0.08em] text-slate-500">
                {c.subCategory}
              </h3>
              {context?.catData?.length !== 0 && (
                <Select
                  size="small"
                  displayEmpty
                  sx={selectSx}
                  value={productSubCat}
                  onChange={handleChangeProductSudCat}
                  renderValue={(selected) => {
                    if (!selected) {
                      return c.chooseSubCategory;
                    }

                    for (const cat of context?.catData || []) {
                      const matchedSubCat = cat?.children?.find(
                        (subCat) => subCat?._id === selected,
                      );

                      if (matchedSubCat) {
                        return matchedSubCat?.name;
                      }
                    }

                    return c.chooseSubCategory;
                  }}
                >
                  <MenuItem value="">
                    <em>{c.chooseSubCategory}</em>
                  </MenuItem>
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

            <div className="col rounded-[22px] border border-[#edf2f8] bg-[linear-gradient(180deg,_#ffffff,_#f8fbff)] p-4 shadow-[0_10px_25px_rgba(15,23,42,0.03)]">
              <h3 className="mb-2 text-[12px] font-[800] uppercase tracking-[0.08em] text-slate-500">
                {c.thirdLevel}
              </h3>
              {context?.catData?.length !== 0 && (
                <Select
                  size="small"
                  displayEmpty
                  sx={selectSx}
                  value={productThirLaveldCat}
                  onChange={handleChangeProductThirLavelCat}
                  renderValue={(selected) => {
                    if (!selected) {
                      return c.chooseThirdLevel;
                    }

                    for (const cat of context?.catData || []) {
                      for (const subCat of cat?.children || []) {
                        const matchedThirdLevel = subCat?.children?.find(
                          (thirdLavelCat) => thirdLavelCat?._id === selected,
                        );

                        if (matchedThirdLevel) {
                          return matchedThirdLevel?.name;
                        }
                      }
                    }

                    return c.chooseThirdLevel;
                  }}
                >
                  <MenuItem value="">
                    <em>{c.chooseThirdLevel}</em>
                  </MenuItem>
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
          </div>

          <div className="col w-full xl:ml-auto xl:w-[260px]">
            <SearchBox
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setPageOrder={setPageOrder}
            />
          </div>
        </div>

        <div className="px-6 pb-4 pt-5">
          <div className="overflow-hidden rounded-[24px] border border-[#edf2f8] bg-[#fcfdff] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
            <TableContainer sx={{ maxHeight: 560 }}>
              <Table
                stickyHeader
                aria-label="products table"
                sx={{
                  "& .MuiTableCell-root": {
                    fontFamily: productFontFamily,
                  },
                }}
              >
            <TableHead>
              <TableRow>
                <TableCell
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
                      productData?.length > 0
                        ? productData.every((item) => item.checked)
                        : false
                    }
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
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
              {isLoading === false ? (
                paginatedProducts?.length !== 0 ? (
                  paginatedProducts?.map((product, index) => (
                    <TableRow
                      key={index}
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
                      <TableCell sx={{ width: 56 }}>
                        <Checkbox
                          {...label}
                          size="small"
                          checked={product.checked === true}
                          onChange={(e) => handleCheckboxChange(e, product._id)}
                        />
                      </TableCell>

                      <TableCell>
                        <div className="flex min-w-[290px] items-center gap-4">
                          <div className="h-[78px] w-[78px] overflow-hidden rounded-[20px] border border-[#e8eef7] bg-white p-1.5 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                            <Link to={`/product/${product?._id}`}>
                              <LazyLoadImage
                                alt="image"
                                effect="blur"
                                src={product?.images?.[0]}
                                className="h-full w-full rounded-[14px] object-cover transition-all duration-300 hover:scale-[1.04]"
                              />
                            </Link>
                          </div>
                          <div className="w-[75%] min-w-0">
                            <h3
                              className="line-clamp-2 text-[13px] font-[800] leading-5 text-[#14213d] hover:text-[#3872fa]"
                              style={{ fontFamily: productFontFamily }}
                            >
                              <Link to={`/product/${product?._id}`}>
                                {product?.name}
                              </Link>
                            </h3>
                            <span
                              className="mt-1 block truncate text-[12px] text-slate-400"
                              style={{ fontFamily: productFontFamily }}
                            >
                              {product?.brand || c.noBrand}
                            </span>
                            <span
                              className="mt-2 inline-flex rounded-full border border-[#e6edfb] bg-[#f7faff] px-2.5 py-1 text-[10px] font-[800] uppercase tracking-[0.12em] text-[#3872fa]"
                              style={{ fontFamily: productFontFamily }}
                            >
                              ID: {product?._id?.slice(-6)}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="inline-flex rounded-full border border-[#e4ecfb] bg-[#f7faff] px-3 py-1.5 text-[12px] font-[700] text-[#315ea8]">
                          {product?.catName || c.uncategorized}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex rounded-full border border-[#edf0f5] bg-[#f8fafc] px-3 py-1.5 text-[12px] font-[700] text-slate-600">
                          {product?.subCat || c.noSubCategory}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="flex min-w-[120px] flex-col gap-1">
                          <span className="text-[12px] font-[700] leading-4 text-slate-400 line-through">
                            {context.formatCurrency
                              ? context.formatCurrency(product?.oldPrice)
                              : product?.oldPrice}
                          </span>
                          <span className="text-[15px] font-[900] text-[#3872fa]">
                            {context.formatCurrency
                              ? context.formatCurrency(product?.price)
                              : product?.price}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="inline-flex rounded-full border border-[#dbe6ff] bg-[#f5f8ff] px-3 py-1.5 text-[12px] font-[800] text-[#3872fa]">
                          {product?.sale} {c.sale}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="flex min-w-[120px] flex-col gap-1">
                          <Rating
                            name="half-rating"
                            size="small"
                            defaultValue={product?.rating}
                            readOnly
                          />
                          <span className="text-[11px] font-[700] text-slate-400">
                            {product?.rating || 0}/5 {c.rating}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Button
                            className="!h-[40px] !min-w-[40px] !rounded-[14px] !border !border-[#e7ebf3] !bg-white !text-slate-600 hover:!border-[#cdd8ea] hover:!bg-[#f8fbff]"
                            onClick={() =>
                              context.setIsOpenFullScreenPanel({
                                open: true,
                                model: "Edit Product",
                                id: product?._id,
                              })
                            }
                          >
                            <AiOutlineEdit className="text-[19px]" />
                          </Button>

                          <Link to={`/product/${product?._id}`}>
                            <Button className="!h-[40px] !min-w-[40px] !rounded-[14px] !border !border-[#e7ebf3] !bg-white !text-slate-600 hover:!border-[#cdd8ea] hover:!bg-[#f8fbff]">
                              <FaRegEye className="text-[17px]" />
                            </Button>
                          </Link>

                          <Button
                            className="!h-[40px] !min-w-[40px] !rounded-[14px] !border !border-[#ffe0e0] !bg-[#fff5f5] !text-[#ef4444]"
                            onClick={() => deleteProduct(product?._id)}
                          >
                            <GoTrash className="text-[18px]" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#f4f7ff] text-[#3872fa] shadow-[0_12px_30px_rgba(56,114,250,0.08)]">
                          <HiOutlineCube className="text-[30px]" />
                        </div>
                        <h4 className="mt-5 text-[18px] font-[900] text-[#14213d]">
                          {c.noProductsFound}
                        </h4>
                        <p className="mt-2 max-w-[320px] text-[13px] leading-6 text-slate-500">
                          {c.noProductsText}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={8}>
                    <div className="flex min-h-[400px] w-full items-center justify-center">
                      <CircularProgress color="inherit" />
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
          count={productData?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </>
  );
};

export default Products;

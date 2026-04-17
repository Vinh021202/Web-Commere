import React, { useState, PureComponent, useContext, useEffect } from "react";
import DashboardBoxes from "../../Components/DashboardBoxes";
import Button from "@mui/material/Button";
import { FaPlus } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";
import Badge from "../../Components/Badge";
import { FaAngleUp } from "react-icons/fa6";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import ProgressBar from "../../Components/ProgressBar";
import { AiOutlineEdit } from "react-icons/ai";
import { FaRegEye } from "react-icons/fa6";
import { GoTrash } from "react-icons/go";
import Pagination from "@mui/material/Pagination";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { MyContext } from "../../App";
import { deleteData, fetchDataFromApi } from "../../utils/api";
import SearchBox from "../../Components/SearchBox";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import CircularProgress from "@mui/material/CircularProgress";
import Rating from "@mui/material/Rating";
import { HiOutlineCube } from "react-icons/hi2";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const columns = [
  { id: "product", label: "PRODUCT", minWidth: 150 },
  { id: "category", label: "CATEGORY", minWidth: 100 },
  {
    id: "subcategory",
    label: "SUB CATEGORY",
    minWidth: 150,
  },
  {
    id: "price",
    label: "PRICE",
    minWidth: 150,
  },
  {
    id: "sales",
    label: "SALES",
    minWidth: 150,
  },
  {
    id: "rating",
    label: "RATING",
    minWidth: 150,
  },
  {
    id: "action",
    label: "ACTION",
    minWidth: 150,
  },
];

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}

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

const Dashboard = () => {
  const [isOpenOrderdProduct, setIsOpenOrderdProduct] = useState(null);

  const [productCat, setProductCat] = useState("");
  const [productData, setProductData] = useState([]);
  const [productTotalData, setProductTotalData] = useState([]);
  const [productSubCat, setProductSubCat] = useState("");
  const [productThirLaveldCat, setProductThirLaveldCat] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [sortedIds, setSortedIds] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [totalOrdersData, setTotalOrdersData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersCount, setOrdersCount] = useState(null);

  const [users, setUsers] = useState([]);
  const [allReviews, setAllReviews] = useState([]);

  const [pageOrder, setPageOrder] = useState(1);
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [chartData, setChartData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [chartType, setChartType] = useState("sales");

  const context = useContext(MyContext);

  useEffect(() => {
    getProducts();
  }, [context?.refreshData]);
  // ✅ watch refreshData thay vì setIsOpenFullScreenPanel

  useEffect(() => {
    fetchDataFromApi(`/api/order/order-list?page=${pageOrder}&limit=6}`).then(
      (res) => {
        if (res?.error === false) {
          setOrders(res);
          setOrdersData(res?.data);
        }
      },
    );

    fetchDataFromApi(`/api/order/order-list`).then((res) => {
      if (res?.error === false) {
        setTotalOrdersData(res);
      }
    });

    fetchDataFromApi(`/api/order/count`).then((res) => {
      if (res?.error === false) {
        setOrdersCount(res?.count);
      }
    });
  }, [pageOrder]);

  useEffect(() => {
    if (orderSearchQuery !== "") {
      const filteredOrders = totalOrdersData?.data?.filter(
        (order) =>
          order?._id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
          order?.userId?.name
            ?.toLowerCase()
            .includes(orderSearchQuery.toLowerCase()) ||
          order?.userId?.email
            ?.toLowerCase()
            .includes(orderSearchQuery.toLowerCase()) ||
          order?.createdAt.includes(orderSearchQuery),
      );
      setOrdersData(filteredOrders);
    } else {
      fetchDataFromApi(`/api/order/order-list?page=${pageOrder}&limit=6`).then(
        (res) => {
          if (res?.error === false) {
            setOrders(res);
            setOrdersData(res?.data);
          }
        },
      );
    }
  }, [orderSearchQuery]);

  useEffect(() => {
    if (productSearchQuery !== "") {
      const filteredProducts = productTotalData?.filter(
        (product) =>
          product?._id
            ?.toLowerCase()
            .includes(productSearchQuery.toLowerCase()) ||
          product?.name
            ?.toLowerCase()
            .includes(productSearchQuery.toLowerCase()) ||
          product?.catName
            ?.toLowerCase()
            .includes(productSearchQuery.toLowerCase()) ||
          product?.subCat
            ?.toLowerCase()
            .includes(productSearchQuery.toLowerCase()),
      );
      setProductData(filteredProducts);
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
  }, [productSearchQuery]);

  useEffect(() => {
    getTotalSalesByYear();

    fetchDataFromApi(`/api/user/getAllUsers`).then((res) => {
      if (res?.error === false) {
        setUsers(res?.users);
      }
    });

    fetchDataFromApi(`/api/user/getAllReviews`).then((res) => {
      if (res?.error === false) {
        setAllReviews(res?.reviews);
      }
    });
  }, []);

  //Handler to toggle all checkboxes
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;

    //update all items checked status
    const updateItems = productData.map((item) => ({
      ...item,
      checked: isChecked,
    }));
    setProductData(updateItems);

    //Update the sorted IDs state
    if (isChecked) {
      const ids = updateItems.map((item) => item._id).sort((a, b) => a - b);
      setSortedIds(ids);
    } else {
      setSortedIds([]);
    }
  };

  const handleCheckboxChange = (e, id, index) => {
    const updateItems = productData.map((item) =>
      item._id === id ? { ...item, checked: !item.checked } : item,
    );

    setProductData(updateItems);

    //Update the sorted IDs state
    const selectedIds = updateItems
      .filter((item) => item.checked)
      .map((item) => item._id)
      .sort((a, b) => a - b);
    setSortedIds(selectedIds);
  };

  const isShowOrderdProduct = (index) => {
    if (isOpenOrderdProduct === index) {
      setIsOpenOrderdProduct(null);
    } else {
      setIsOpenOrderdProduct(index);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const paginatedProducts = productData?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

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

  const handleChangeProductCat = (event) => {
    const value = event.target.value;
    setProductCat(value);
    setProductSubCat("");
    setProductThirLaveldCat("");
    setIsLoading(true);
    // ✅ fix double slash
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

  // ✅ Third Level Category
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

  const deleteProduct = (id) => {
    deleteData(`/api/product/${id}`).then((res) => {
      getProducts();
      context.alertBox("success", "Product deleted");
    });
  };

const getTotalUserByYear = () => {
  fetchDataFromApi(`/api/order/users`).then((res) => {
    const user = [];
    res?.totalUsers?.map((item) => {
      // ✅ sửa monthlyUser -> totalUsers
      user.push({
        name: item?.name,
        TotalUsers: parseInt(item?.totalUsers),
      });
    });
    setChartData(user);
    setChartType("users");
  });
};
const getTotalSalesByYear = () => {
  fetchDataFromApi(`/api/order/sales`).then((res) => {
    const sales = [];
    res?.monthlySales?.map((item) => {
      sales.push({
        name: item?.name,
        TotalSales: parseInt(item?.totalSale),
      });
    });
    setChartData(sales);
    setChartType("sales"); // ✅ thêm
  });
};
  const handleChangeYerar = (event) => {
    getTotalSalesByYear(event.target.value);
    setYear(event.target.value);
  };

  return (
    <>
      <div
        className="mb-6 flex w-full items-center justify-between gap-8 overflow-hidden rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,_rgba(255,255,255,0.92),_rgba(245,247,255,0.96))] p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)]"
      >
        <div className="info max-w-[55%]">
          <span className="inline-flex rounded-full border border-[#dbe6ff] bg-[#edf3ff] px-3 py-1 text-[11px] font-[800] uppercase tracking-[0.18em] text-[#3872fa]">
            Dashboard Overview
          </span>
          <h1 className="mb-4 mt-4 text-[42px] font-[900] leading-[1.02] text-[#14213d]">
            Good Morning,
            <br /> Cameron
          </h1>
          <p className="max-w-[680px] text-[18px] leading-8 text-slate-500">
            Here's what happening on your store today. See the statistics at
            once.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="rounded-[18px] border border-[#e5ecff] bg-white/80 px-4 py-3 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
              <p className="text-[11px] font-[800] uppercase tracking-[0.14em] text-slate-400">
                Products
              </p>
              <p className="mt-1 text-[22px] font-[900] text-[#14213d]">
                {productData?.length || 0}
              </p>
            </div>
            <div className="rounded-[18px] border border-[#e5ecff] bg-white/80 px-4 py-3 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
              <p className="text-[11px] font-[800] uppercase tracking-[0.14em] text-slate-400">
                Orders
              </p>
              <p className="mt-1 text-[22px] font-[900] text-[#14213d]">
                {ordersCount || 0}
              </p>
            </div>
          </div>

          <Button
            className="!mt-6 !rounded-[18px] !bg-[linear-gradient(135deg,_#14213d,_#3872fa)] !px-5 !py-3 !text-[14px] !font-[800] !capitalize !text-white shadow-[0_16px_35px_rgba(56,114,250,0.22)]"
            onClick={() =>
              context.setIsOpenFullScreenPanel({
                open: true,
                model: "Add Product",
              })
            }
          >
            <FaPlus className="mr-2" />
            Add Product
          </Button>
        </div>
        <div className="relative flex h-[250px] w-[380px] items-center justify-center rounded-[26px] bg-[radial-gradient(circle_at_top,_rgba(56,114,250,0.15),_transparent_60%),linear-gradient(180deg,_rgba(255,255,255,0.65),_rgba(255,255,255,0.35))]">
          <div className="absolute inset-0 rounded-[26px] border border-white/70" />
          <img src="/logoadmin.jpeg" className="relative z-10 w-[340px]" />
        </div>
      </div>
      {productData?.length !== 0 &&
        users?.length !== 0 &&
        allReviews?.length !== 0 && (
          <DashboardBoxes
            orders={ordersCount}
            products={productData?.length}
            users={users?.length}
            reivews={allReviews?.length}
            categorry={context?.catData?.length}
          />
        )}

      <div className="card my-6 overflow-hidden rounded-[28px] border border-white/70 bg-white/90 pt-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between border-b border-[#eef2f7] px-6 pb-5">
          <div>
            <p className="text-[11px] font-[800] uppercase tracking-[0.18em] text-slate-400">
              Inventory
            </p>
            <h3 className="mt-2 text-[22px] font-[900] text-[#14213d]">
              Product Overview
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

        <div className="flex w-full flex-col gap-4 px-6 pt-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="grid flex-1 gap-4 md:grid-cols-2 xl:grid-cols-[0.9fr_0.9fr_1.1fr]">
            <div className="col rounded-[22px] border border-[#edf2f8] bg-[linear-gradient(180deg,_#ffffff,_#f8fbff)] p-4 shadow-[0_10px_25px_rgba(15,23,42,0.03)]">
              <h3 className="mb-2 text-[12px] font-[800] uppercase tracking-[0.08em] text-slate-500">
                Category
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
                      return "Choose category";
                    }

                    const selectedCategory = context?.catData?.find(
                      (cat) => cat?._id === selected,
                    );

                    return selectedCategory?.name || "Choose category";
                  }}
                >
                  <MenuItem value="">
                    <em>Choose category</em>
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
                Sub Category
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
                      return "Choose sub category";
                    }

                    for (const cat of context?.catData || []) {
                      const matchedSubCat = cat?.children?.find(
                        (subCat) => subCat?._id === selected,
                      );

                      if (matchedSubCat) {
                        return matchedSubCat?.name;
                      }
                    }

                    return "Choose sub category";
                  }}
                >
                  <MenuItem value="">
                    <em>Choose sub category</em>
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
                Third Level
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
                      return "Choose third level";
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

                    return "Choose third level";
                  }}
                >
                  <MenuItem value="">
                    <em>Choose third level</em>
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
              searchQuery={productSearchQuery}
              setSearchQuery={setProductSearchQuery}
              setPageOrder={setPage}
            />
          </div>
        </div>

        <div className="px-6 pb-4 pt-5">
          <div className="overflow-hidden rounded-[24px] border border-[#edf2f8] bg-[#fcfdff] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
            <TableContainer sx={{ maxHeight: 560 }}>
              <Table stickyHeader aria-label="products table">
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
                              onChange={(e) =>
                                handleCheckboxChange(e, product._id, index)
                              }
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
                                <h3 className="line-clamp-2 text-[13px] font-[800] leading-5 text-[#14213d] hover:text-[#3872fa]">
                                  <Link to={`/product/${product?._id}`}>
                                    {product?.name}
                                  </Link>
                                </h3>
                                <span className="mt-1 block truncate text-[12px] text-slate-400">
                                  {product?.brand || "No brand"}
                                </span>
                                <span className="mt-2 inline-flex rounded-full border border-[#e6edfb] bg-[#f7faff] px-2.5 py-1 text-[10px] font-[800] uppercase tracking-[0.12em] text-[#3872fa]">
                                  ID: {product?._id?.slice(-6)}
                                </span>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <span className="inline-flex rounded-full border border-[#e4ecfb] bg-[#f7faff] px-3 py-1.5 text-[12px] font-[700] text-[#315ea8]">
                              {product?.catName || "Uncategorized"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex rounded-full border border-[#edf0f5] bg-[#f8fafc] px-3 py-1.5 text-[12px] font-[700] text-slate-600">
                              {product?.subCat || "No sub category"}
                            </span>
                          </TableCell>

                          <TableCell>
                            <div className="flex min-w-[120px] flex-col gap-1">
                              <span className="text-[12px] font-[700] leading-4 text-slate-400 line-through">
                                &#8363; {product?.price}
                              </span>
                              <span className="text-[15px] font-[900] text-[#3872fa]">
                                &#8363; {product?.oldPrice}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <span className="inline-flex rounded-full border border-[#dbe6ff] bg-[#f5f8ff] px-3 py-1.5 text-[12px] font-[800] text-[#3872fa]">
                              {product?.sale} sale
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
                                {product?.rating || 0}/5 rating
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
                              No products found
                            </h4>
                            <p className="mt-2 max-w-[320px] text-[13px] leading-6 text-slate-500">
                              Try changing the filters or search keyword to see more
                              products in your inventory.
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

      <div className="card my-6 overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between border-b border-[#eef2f7] px-6 py-5">
          <div>
            <p className="text-[11px] font-[800] uppercase tracking-[0.18em] text-slate-400">
              Orders
            </p>
            <h2 className="mt-2 text-[22px] font-[900] text-[#14213d]">
              Recent Orders
            </h2>
          </div>
          <div className="w-full max-w-[320px]">
            <SearchBox
              searchQuery={orderSearchQuery}
              setSearchQuery={setOrderSearchQuery}
              setPageOrder={setPageOrder}
            />
          </div>
        </div>
        <div className="px-6 pb-4 pt-5">
          <div className="overflow-hidden rounded-[24px] border border-[#edf2f8] bg-[#fcfdff] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
            <div className="relative overflow-x-auto">
              <table className="w-full text-left text-[13px] text-slate-600 rtl:text-right">
                <thead className="bg-[#f8fbff] text-[11px] font-[800] uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th scope="col" className="px-6 py-4">
                  &nbsp;
                </th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap">
                  Order Id
                </th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap">
                  Paymant Id
                </th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap">
                  Name
                </th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap">
                  Phone Number
                </th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap">
                  Address
                </th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap">
                  Pincode
                </th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap">
                  Total Amount
                </th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap">
                  Email
                </th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap">
                  User Id
                </th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap">
                  Order Status
                </th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {ordersData?.length !== 0 &&
                ordersData?.map((orders, index) => {
                  return (
                    <>
                      <tr className="border-b border-[#eef3f9] bg-white hover:bg-[#fbfdff]">
                        <td className="px-6 py-4 font-[700]">
                          <Button
                            className="!h-[40px] !min-w-[40px] !rounded-[14px] !border !border-[#e7ebf3] !bg-white !text-slate-600 hover:!border-[#cdd8ea] hover:!bg-[#f8fbff]"
                            onClick={() => isShowOrderdProduct(index)}
                          >
                            {isOpenOrderdProduct === index ? (
                              <FaAngleUp className="text-[16px] text-[rgba(0,0,0,0.7)]" />
                            ) : (
                              <FaAngleDown className="text-[16px] text-[rgba(0,0,0,0.7)]" />
                            )}
                          </Button>
                        </td>
                        <td className="px-6 py-4 font-[800]">
                          <span className="text-primary"> {orders?._id} </span>
                        </td>
                        <td className="px-6 py-4 font-[700]">
                          <span className="text-primary whitespace-nowrap">
                            {orders?.paymentId
                              ? orders?.paymentId
                              : "CASH ON DELIVERY"}{" "}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-[700] whitespace-nowrap">
                          {orders?.userId?.name}
                        </td>
                        <td className="px-6 py-4 font-[700] whitespace-nowrap">
                          {orders?.userId?.mobile}
                        </td>
                        <td className="px-6 py-4 font-[700]">
                          <span className="block w-[340px] text-slate-500">
                            {orders?.delivery_address
                              ? [
                                  orders.delivery_address?.address_line1,
                                  orders.delivery_address?.city,
                                  orders.delivery_address?.lamdmark, // ✅ sửa 'lamdmark' → 'landmark'
                                  orders.delivery_address?.state,
                                  orders.delivery_address?.country,
                                  orders.delivery_address?.mobile
                                    ? `+${orders.delivery_address.mobile}`
                                    : null,
                                ]
                                  .filter(Boolean) // ✅ Lọc bỏ undefined/null
                                  .join(", ")
                              : "No address"}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-[700]">
                          {orders?.delivery_address?.pincode}
                        </td>
                        <td className="px-6 py-4 font-[800] text-[#14213d] whitespace-nowrap">
                          {orders?.totalAmt}
                        </td>
                        <td className="px-6 py-4 font-[700]">
                          {orders?.userId?.email}
                        </td>
                        <td className="px-6 py-4 font-[700]">
                          <span className="text-primary">{orders?.userId?._id}</span>
                        </td>
                        <td className="px-6 py-4 font-[700]">
                          <Badge status={orders?.order_status} />
                        </td>
                        <td className="px-6 py-4 font-[700] whitespace-nowrap">
                          {orders?.createdAt?.split("T")[0]}
                        </td>
                      </tr>

                      {isOpenOrderdProduct === index && (
                        <tr className="bg-white">
                          <td className="px-6 pb-6 pt-2" colSpan={12}>
                            <div className="overflow-hidden rounded-[22px] border border-[#edf2f8] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
                              <div className="flex items-center justify-between border-b border-[#eef3f9] bg-[#fbfdff] px-5 py-4">
                                <div>
                                  <p className="text-[11px] font-[800] uppercase tracking-[0.14em] text-slate-400">
                                    Items
                                  </p>
                                  <p className="mt-1 text-[14px] font-[900] text-[#14213d]">
                                    Ordered products
                                  </p>
                                </div>
                                <span className="inline-flex rounded-full border border-[#e6edfb] bg-[#f7faff] px-3 py-1.5 text-[11px] font-[800] text-[#3872fa]">
                                  {orders?.products?.length || 0} items
                                </span>
                              </div>

                              <div className="relative overflow-x-auto">
                                <table className="w-full text-left text-[13px] text-slate-600 rtl:text-right">
                                  <thead className="bg-[#f8fbff] text-[11px] font-[800] uppercase tracking-[0.14em] text-slate-500">
                                  <tr>
                                    <th
                                      scope="col"
                                      className="px-6 py-4 whitespace-nowrap"
                                    >
                                      Product Id
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-4 whitespace-nowrap"
                                    >
                                      Product Title
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-4 whitespace-nowrap"
                                    >
                                      Imge
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-4 whitespace-nowrap"
                                    >
                                      Quantity
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-4 whitespace-nowrap"
                                    >
                                      Price
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-4 whitespace-nowrap"
                                    >
                                      Sub Total
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {orders?.products?.map((item, index) => {
                                    return (
                                      <tr
                                        key={`${item?._id || "item"}-${index}`}
                                        className="border-b border-[#eef3f9] bg-white hover:bg-[#fbfdff]"
                                      >
                                        <td className="px-6 py-4 font-[800]">
                                          <span className="text-slate-600">{item?._id}</span>
                                        </td>
                                        <td className="px-6 py-4 font-[800]">
                                          <div className="w-[280px]">
                                            <span className="text-[#14213d]">
                                              {item?.productTitle}
                                            </span>
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 font-[700]">
                                          <img
                                            src={item?.image}
                                            className="h-[52px] w-[52px] rounded-[16px] border border-[#e8eef7] object-cover shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
                                          />
                                        </td>
                                        <td className="px-6 py-4 font-[800] whitespace-nowrap">
                                          <span className="inline-flex rounded-full border border-[#edf0f5] bg-[#f8fafc] px-3 py-1.5 text-[12px] font-[800] text-slate-700">
                                            {item?.quantity}
                                          </span>
                                        </td>
                                        <td className="px-6 py-4 font-[800] whitespace-nowrap">
                                          {item?.price?.toLocaleString(
                                            "vi-VN",
                                            {
                                              // Nên dùng 'vi-VN' để hiển thị định dạng số kiểu Việt Nam
                                              style: "currency",
                                              currency: "VND",
                                              minimumFractionDigits: 0, // Loại bỏ phần .00 nếu không cần thiết
                                            },
                                          )}
                                        </td>
                                        <td className="px-6 py-4 font-[900] text-[#3872fa] whitespace-nowrap">
                                          {(
                                            item?.price * item?.quantity
                                          )?.toLocaleString("vi-VN", {
                                            // Nên dùng 'vi-VN' để hiển thị định dạng số kiểu Việt Nam
                                            style: "currency",
                                            currency: "VND",
                                            minimumFractionDigits: 0, // Loại bỏ phần .00 nếu không cần thiết
                                          })}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
            </tbody>
          </table>
            </div>
          </div>
        </div>
        {orders?.totalPages > 0 && (
          <div className="flex items-center justify-center mt-5 pb-5">
            <Pagination
              showFirstButton
              showLastButton
              count={orders?.totalPages || 0}
              page={pageOrder}
              onChange={(e, value) => setPageOrder(value)}
            />
          </div>
        )}
      </div>

      <div className="card my-6 overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-4 border-b border-[#eef2f7] px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-[800] uppercase tracking-[0.18em] text-slate-400">
              Analytics
            </p>
            <h2 className="mt-2 text-[22px] font-[900] text-[#14213d]">
              Total Users & Total Sales
            </h2>
            <p className="mt-2 text-[13px] text-slate-500">
              Switch between user growth and monthly sales.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={getTotalUserByYear}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-[900] transition-all ${
                chartType === "users"
                  ? "border-[#dbe6ff] bg-[#f4f7ff] text-[#0858f7] shadow-[0_12px_30px_rgba(8,88,247,0.10)]"
                  : "border-[#edf2f8] bg-white text-slate-600 hover:bg-[#fbfdff]"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  chartType === "users" ? "bg-[#0858f7]" : "bg-slate-300"
                }`}
              />
              Total Users
            </button>

            <button
              type="button"
              onClick={getTotalSalesByYear}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-[900] transition-all ${
                chartType === "sales"
                  ? "border-[#d9f4e8] bg-[#f4fdf7] text-[#16a34a] shadow-[0_12px_30px_rgba(22,163,74,0.10)]"
                  : "border-[#edf2f8] bg-white text-slate-600 hover:bg-[#fbfdff]"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  chartType === "sales" ? "bg-[#16a34a]" : "bg-slate-300"
                }`}
              />
              Total Sales
            </button>
          </div>
        </div>

        <div className="px-6 py-5">
          <div className="overflow-hidden rounded-[24px] border border-[#edf2f8] bg-[#fcfdff] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
            {chartData?.length !== 0 ? (
              <div className="h-[320px] w-full p-3 md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 10,
                      right: 22,
                      left: 10,
                      bottom: 34,
                    }}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      style={{ fill: "#64748b" }}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      style={{ fill: "#64748b" }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#0b1222",
                        border: "1px solid rgba(255,255,255,0.10)",
                        borderRadius: "14px",
                        color: "white",
                        boxShadow: "0 18px 45px rgba(15,23,42,0.25)",
                      }}
                      labelStyle={{ color: "#cbd5e1", fontWeight: 800 }}
                      itemStyle={{ color: "white" }}
                      cursor={{ fill: "rgba(56,114,250,0.08)" }}
                      formatter={(value, name) => {
                        if (name === "TotalSales") return [value, "Total Sales"];
                        if (name === "TotalUsers") return [value, "Total Users"];
                        return [value, name];
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      align="center"
                      iconType="circle"
                      iconSize={12}
                      payload={
                        chartType === "sales"
                          ? [{ value: "TotalSales", type: "circle", color: "#16a34a" }]
                          : [{ value: "TotalUsers", type: "circle", color: "#0858f7" }]
                      }
                      formatter={(value) => {
                        if (value === "TotalSales") return "Total Sales";
                        if (value === "TotalUsers") return "Total Users";
                        return value;
                      }}
                      wrapperStyle={{
                        paddingBottom: "10px",
                        fontSize: "14px",
                        fontWeight: 900,
                        color: "#475569",
                      }}
                    />
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal
                      vertical={false}
                      stroke="#e8eef7"
                    />
                    <Bar
                      dataKey="TotalSales"
                      fill="#16a34a"
                      radius={[12, 12, 0, 0]}
                      hide={chartType !== "sales"}
                    />
                    <Bar
                      dataKey="TotalUsers"
                      fill="#0858f7"
                      radius={[12, 12, 0, 0]}
                      hide={chartType !== "users"}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex min-h-[320px] flex-col items-center justify-center p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#f4f7ff] text-[#3872fa] shadow-[0_12px_30px_rgba(56,114,250,0.08)]">
                  <HiOutlineCube className="text-[30px]" />
                </div>
                <h4 className="mt-5 text-[18px] font-[900] text-[#14213d]">
                  No analytics data
                </h4>
                <p className="mt-2 max-w-[360px] text-[13px] leading-6 text-slate-500">
                  Choose a metric to load the chart. If data is still missing,
                  check the API response.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

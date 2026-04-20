import React, { useEffect, useMemo, useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { Button } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TablePagination from '@mui/material/TablePagination';
import { IoGridSharp } from 'react-icons/io5';
import { LuMenu } from 'react-icons/lu';
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';
import SideBar from '../../componets/SideBar';
import ProductsItem from '../../componets/ProductsItem';
import ProductsItemListView from '../../componets/ProductsItemListView';
import ProductLoading from '../../componets/ProductLoading';
import { useSearchParams } from 'react-router-dom';

const ProductListing = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isItemView, setIsItemView] = useState('grid');
  const [productsData, setProductsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedSortVal, setSelectedSortVal] = useState('Độ bán chạy giảm dần');

  const [searchParams] = useSearchParams();
  const catName =
    searchParams.get('cat') ||
    searchParams.get('subCat') ||
    searchParams.get('thirdsubCat') ||
    'Sản phẩm';

  const open = Boolean(anchorEl);

  useEffect(() => {
    setPage(1);
    setRowsPerPage(10);
  }, [searchParams]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSortBy = (name, order, label) => {
    setSelectedSortVal(label);

    const sorted = [...(productsData?.products || [])].sort((a, b) => {
      if (name === 'name') {
        return order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      if (name === 'price') {
        return order === 'asc' ? a.price - b.price : b.price - a.price;
      }
      if (name === 'sale') {
        return order === 'asc' ? a.sale - b.sale : b.sale - a.sale;
      }
      return 0;
    });

    setProductsData((prev) => ({ ...prev, products: sorted }));
    setAnchorEl(null);
  };

  const sortOptions = [
    { label: 'Độ bán chạy giảm dần', name: 'sale', order: 'desc' },
    { label: 'Độ bán chạy tăng dần', name: 'sale', order: 'asc' },
    { label: 'Tên từ A đến Z', name: 'name', order: 'asc' },
    { label: 'Tên từ Z đến A', name: 'name', order: 'desc' },
    { label: 'Giá từ thấp đến cao', name: 'price', order: 'asc' },
    { label: 'Giá từ cao đến thấp', name: 'price', order: 'desc' },
  ];

  const productCount = productsData?.total || productsData?.products?.length || 0;
  const fromProduct = productCount === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const toProduct = Math.min(page * rowsPerPage, productCount);

  const listingSummary = useMemo(() => {
    if (productCount === 0) {
      return 'Chưa có sản phẩm phù hợp với bộ lọc hiện tại.';
    }

    return `Đang hiển thị ${productCount} sản phẩm với bố cục rõ ràng, dễ so sánh và chọn nhanh hơn.`;
  }, [productCount]);

  const emptyState = (
    <div className="listing-empty col-span-full overflow-hidden rounded-[28px] border border-dashed border-[rgba(255,82,82,0.18)] bg-[linear-gradient(135deg,#fff8f5_0%,#ffffff_100%)] p-6 text-center sm:p-10">
      <div className="mx-auto flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[#fff1eb] text-[#a65434] shadow-[0_10px_24px_rgba(255,82,82,0.10)]">
        <HiOutlineAdjustmentsHorizontal className="text-[30px]" />
      </div>
      <h3 className="mt-5 text-[22px] font-[800] text-[#1f2937]">Không tìm thấy sản phẩm</h3>
      <p className="mx-auto mb-0 mt-3 max-w-[520px] text-[14px] leading-7">
        Thử nới rộng khoảng giá, bỏ chọn một vài bộ lọc, hoặc chuyển danh mục để xem thêm kết
        quả phù hợp.
      </p>
    </div>
  );

  const handlePageChange = (event, value) => {
    setPage(value + 1);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  return (
    <section className="pb-8 pt-4 md:pt-5 xl:pt-6">
      <div className="container">
        <div className="section-shell listing-hero overflow-hidden px-4 py-5 md:px-7 md:py-6 xl:px-8 xl:py-7">
          <div className="absolute inset-y-0 right-0 hidden w-[34%] bg-[radial-gradient(circle_at_top_right,rgba(255,82,82,0.14),transparent_58%)] lg:block" />

          <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-[700px] xl:max-w-[760px]">
              <Breadcrumbs aria-label="breadcrumb" className="listing-breadcrumbs">
                <Link underline="hover" color="inherit" href="/" className="link !text-[14px]">
                  Trang chủ
                </Link>
                <span className="text-[14px] font-[600] text-[rgba(31,41,55,0.72)]">{catName}</span>
              </Breadcrumbs>

              <span className="eyebrow mt-4">Danh mục sản phẩm</span>
              <h1 className="section-heading mt-3 max-w-[680px] xl:max-w-[720px]">
                Khám phá {catName} với bộ lọc gọn hơn và nhịp trình bày rõ hơn.
              </h1>
              <p className="muted-copy mt-3 max-w-[600px] text-[14px] leading-7 xl:max-w-[640px] xl:text-[15px]">
                {listingSummary}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <span className="listing-chip">Bộ lọc theo danh mục</span>
                <span className="listing-chip">Sắp xếp linh hoạt</span>
                <span className="listing-chip">Grid và list view</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[390px]">
              <div className="soft-card p-3.5 xl:p-4">
                <span className="listing-stat__label">Tổng sản phẩm</span>
                <strong className="listing-stat__value">{productCount}</strong>
              </div>
              <div className="soft-card p-3.5 xl:p-4">
                <span className="listing-stat__label">Chế độ xem</span>
                <strong className="listing-stat__value capitalize">{isItemView}</strong>
              </div>
              <div className="soft-card p-3.5 xl:p-4">
                <span className="listing-stat__label">Sắp xếp</span>
                <strong className="listing-stat__value !text-[15px]">{selectedSortVal}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(220px,26%)_minmax(0,74%)]">
          <div className="sidebarWrapper">
            <SideBar
              productsData={productsData}
              setProductsData={setProductsData}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              page={page}
              rowsPerPage={rowsPerPage}
              setTotalPages={setTotalPages}
            />
          </div>

          <div className="rightContainer">
            <div className="section-shell px-4 py-4 md:px-5 md:py-5 xl:px-6 xl:py-6">
              <div className="listing-toolbar mb-4 flex flex-col gap-4 rounded-[24px] border border-[rgba(255,82,82,0.12)] bg-[linear-gradient(135deg,#fff8f5_0%,#ffffff_100%)] p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                  <div className="itemViewActions flex flex-wrap items-center gap-3">
                    <span className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#fff1eb] text-[#a65434]">
                      <HiOutlineAdjustmentsHorizontal className="text-[20px]" />
                    </span>

                    <div className="listing-toggle-group">
                      <Button
                        className={`listing-view-btn ${isItemView === 'list' ? 'active' : ''}`}
                        onClick={() => setIsItemView('list')}
                      >
                        <LuMenu className="text-[18px] text-[rgba(0,0,0,0.7)]" />
                      </Button>

                      <Button
                        className={`listing-view-btn ${isItemView === 'grid' ? 'active' : ''}`}
                        onClick={() => setIsItemView('grid')}
                      >
                        <IoGridSharp className="text-[18px] text-[rgba(0,0,0,0.7)]" />
                      </Button>
                    </div>
                  </div>

                  <div className="listing-toolbar__meta pl-0 xl:pl-2">
                    <span className="block text-[13px] font-[700] uppercase tracking-[0.08em] text-[#a65434]">
                      Trạng thái danh mục
                    </span>
                    <span className="text-[14px] font-[600] text-[rgba(31,41,55,0.72)]">
                      Có {productCount} sản phẩm trong chế độ hiện tại.
                    </span>
                  </div>
                </div>

                <div className="listing-toolbar__actions ml-auto flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                  <span className="text-[13px] font-[700] uppercase tracking-[0.08em] text-[#a65434]">
                    Sắp xếp theo
                  </span>
                  <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    className="!justify-between !rounded-full !border !border-[rgba(255,82,82,0.16)] !bg-white !px-4 !py-2 !text-[13px] !font-[700] !capitalize !text-[#1f2937] sm:!min-w-[240px]"
                  >
                    {selectedSortVal}
                  </Button>

                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    slotProps={{ list: { 'aria-labelledby': 'basic-button' } }}
                  >
                    {sortOptions.map((opt) => (
                      <MenuItem
                        key={opt.label}
                        onClick={() => handleSortBy(opt.name, opt.order, opt.label)}
                        className="!text-[13px] !text-[#000] !capitalize"
                      >
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </div>
              </div>

              <div
                className={
                  isItemView === 'grid'
                    ? 'listing-products-grid grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-5'
                    : 'grid grid-cols-1 gap-4'
                }
              >
                {isLoading ? (
                  <ProductLoading view={isItemView} />
                ) : isItemView === 'grid' ? (
                  productsData?.products?.length > 0 ? (
                    productsData.products.map((item, index) => (
                      <ProductsItem key={item?._id || index} item={item} />
                    ))
                  ) : (
                    emptyState
                  )
                ) : productsData?.products?.length > 0 ? (
                  productsData.products.map((item, index) => (
                    <ProductsItemListView key={item?._id || index} item={item} />
                  ))
                ) : (
                  emptyState
                )}
              </div>

              {productCount > 0 && (
                <div className="mt-8 border-t border-[rgba(255,82,82,0.1)] pt-4">
                  <div className="listing-pagination-shell">
                    <span className="listing-pagination-label">Số dòng mỗi trang:</span>
                    <TablePagination
                      component="div"
                      count={productCount}
                      page={page - 1}
                      onPageChange={handlePageChange}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={handleRowsPerPageChange}
                      rowsPerPageOptions={[10, 20, 30]}
                      labelRowsPerPage=""
                      labelDisplayedRows={() => `${fromProduct}-${toProduct} trên ${productCount}`}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListing;

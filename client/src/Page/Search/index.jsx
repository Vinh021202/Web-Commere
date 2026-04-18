import React, { useState } from 'react';
import SideBar from '../../componets/SideBar';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import ProductsItem from '../../componets/ProductsItem';
import ProductsItemListView from '../../componets/ProductsItemListView';
import { Button } from '@mui/material';
import { IoGridSharp } from 'react-icons/io5';
import { LuMenu } from 'react-icons/lu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import ProductLoading from '../../componets/ProductLoading';
import { useSearchParams } from 'react-router-dom';

const SearchPage = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isItemView, setIsItemView] = useState('grid');
  const [productsData, setProductsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSortVal, setSelectedSortVal] = useState('Độ bán chạy giảm dần');

  // Lấy tên category từ URL để hiển thị breadcrumb động
  const [searchParams] = useSearchParams();
  const catName =
    searchParams.get('cat') ||
    searchParams.get('subCat') ||
    searchParams.get('thirdsubCat') ||
    'Sản phẩm';

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Sort trực tiếp trên frontend - không cần gọi API
  const handleSortBy = (name, order, label) => {
    setSelectedSortVal(label);

    const sorted = [...(productsData?.products || [])].sort((a, b) => {
      if (name === 'name') {
        return order === 'asc'
          ? a.name.localeCompare(b.name) // localeCompare đúng chính tả
          : b.name.localeCompare(a.name);
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

  return (
    <>
      <section className="py-5 pb-0">
        <div className="container">
          {/* Breadcrumb động theo URL */}
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              underline="hover"
              color="inherit"
              href="/"
              className="link transition !text-[14px]"
            >
              Trang chủ
            </Link>
            <span className="text-[14px] text-[rgba(0,0,0,0.6)]">{catName}</span>
          </Breadcrumbs>
        </div>

        <div className="mt-4 bg-white p-3">
          <div className="container flex gap-3">
            {/* Sidebar */}
            <div className="sidebarWrapper w-[20%] bg-white">
              <SideBar
                productsData={productsData}
                setProductsData={setProductsData}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                page={page}
                setTotalPages={setTotalPages}
              />
            </div>

            {/* Right Content */}
            <div className="rightContainer w-[80%] py-3">
              {/* Toolbar */}
              <div
                className="sticky top-[130px] z-[99] mb-4 flex w-full items-center justify-between rounded-md bg-[#f1f1f1] p-2"
              >
                <div className="col1 itemViewActions flex items-center gap-3">
                  {/* List view button */}
                  <Button
                    className={`!h-[40px] !w-[40px] !min-w-[40px] !rounded-full !text-[#000] ${
                      isItemView === 'list' ? 'active' : ''
                    }`}
                    onClick={() => setIsItemView('list')}
                  >
                    <LuMenu className="text-[rgba(0,0,0,0.7)]" />
                  </Button>

                  {/* Grid view button */}
                  <Button
                    className={`!h-[40px] !w-[40px] !min-w-[40px] !rounded-full !text-[#000] ${
                      isItemView === 'grid' ? 'active' : ''
                    }`}
                    onClick={() => setIsItemView('grid')}
                  >
                    <IoGridSharp className="text-[rgba(0,0,0,0.7)]" />
                  </Button>

                  <span className="pl-3 text-[14px] font-[500] text-[rgba(0,0,0,0.7)]">
                    Có {productsData?.total || 0} sản phẩm.
                  </span>
                </div>

                {/* Sort */}
                <div className="col2 ml-auto flex items-center justify-end gap-3 pr-4">
                  <span className="text-[14px] font-[500] text-[rgba(0,0,0,0.7)]">
                    Sắp xếp theo
                  </span>
                  <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    className="!border !border-[#d3c5c5] !bg-white !text-[12px] !capitalize !text-[#000]"
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
                        className="!text-[13px] !capitalize !text-[#000]"
                      >
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </div>
              </div>

              {/* Product Grid / List */}
              <div
                className={`grid ${
                  isItemView === 'grid'
                    ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6'
                    : 'grid-cols-1 md:grid-cols-1'
                } gap-4`}
              >
                {isItemView === 'grid' ? (
                  <>
                    {isLoading ? (
                      <ProductLoading view={isItemView} />
                    ) : (
                      productsData?.products?.length > 0 &&
                      productsData.products.map((item, index) => (
                        <ProductsItem key={index} item={item} />
                      ))
                    )}
                  </>
                ) : (
                  <>
                    {isLoading ? (
                      <ProductLoading view={isItemView} />
                    ) : (
                      productsData?.products?.length > 0 &&
                      productsData.products.map((item, index) => (
                        <ProductsItemListView key={index} item={item} />
                      ))
                    )}
                  </>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center">
                  <Pagination
                    showFirstButton
                    showLastButton
                    count={totalPages}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SearchPage;

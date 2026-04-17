import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import '../SideBar/style.css';
import { Collapse } from 'react-collapse';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6';
import Button from '@mui/material/Button';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import Rating from '@mui/material/Rating';
import { MyContext } from '../../App';
import { useLocation } from 'react-router-dom';
import { postData } from '../../utils/api';
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';

const SideBar = (props) => {
  const { setProductsData, setIsLoading, setTotalPages, page, rowsPerPage } = props;
  const [isopenCategoryFilter, setIsopenCategoryFilter] = useState(true);
  const [filters, setFilters] = useState({
    catId: [],
    subCatId: [],
    thirdsubCatId: [],
    minPrice: '',
    maxPrice: '',
    rating: [],
    page: 1,
    limit: rowsPerPage || 12,
  });

  const [price, setPrice] = useState([0, 600000]);
  const isMounted = useRef(false);

  const context = useContext(MyContext);
  const location = useLocation();

  const areArraysEqual = (first = [], second = []) => {
    if (first.length !== second.length) return false;
    return first.every((item, index) => item === second[index]);
  };

  const handleCheckboxChange = (field, value) => {
    context.setSearchData([]);

    const currentValues = filters[field] || [];
    const updatedValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    setFilters((prev) => ({
      ...prev,
      [field]: updatedValues,
      ...(field === 'catId' && { subCatId: [], thirdsubCatId: [] }),
    }));
  };

  useEffect(() => {
    const url = window.location.href;
    const queryParameters = new URLSearchParams(location.search);
    let nextPatch = null;

    if (url.includes('catId')) {
      const categoryId = queryParameters.get('catId');
      nextPatch = {
        catId: [categoryId],
        subCatId: [],
        thirdsubCatId: [],
        rating: [],
        page: 1,
      };
      context?.setSearchData([]);
    } else if (url.includes('subCatId')) {
      const subCategoryId = queryParameters.get('subCatId');
      nextPatch = {
        catId: [],
        subCatId: [subCategoryId],
        thirdsubCatId: [],
        rating: [],
        page: 1,
      };
      context?.setSearchData([]);
    } else if (url.includes('thirdsubCatId')) {
      const thirdsubCatId = queryParameters.get('thirdsubCatId');
      nextPatch = {
        catId: [],
        subCatId: [],
        thirdsubCatId: [thirdsubCatId],
        rating: [],
        page: 1,
      };
      context?.setSearchData([]);
    } else {
      nextPatch = {
        catId: [],
        subCatId: [],
        thirdsubCatId: [],
        rating: [],
        page: 1,
      };
    }

    setFilters((prev) => {
      if (
        areArraysEqual(prev.catId, nextPatch.catId) &&
        areArraysEqual(prev.subCatId, nextPatch.subCatId) &&
        areArraysEqual(prev.thirdsubCatId, nextPatch.thirdsubCatId) &&
        areArraysEqual(prev.rating, nextPatch.rating) &&
        prev.page === nextPatch.page
      ) {
        return prev;
      }

      return {
        ...prev,
        ...nextPatch,
      };
    });
  }, [context?.setSearchData, location.search]);

  const filterData = useCallback(() => {
    setIsLoading(true);

    if (context?.searchData?.products?.length > 0) {
      setProductsData(context?.searchData);
      setIsLoading(false);
      setTotalPages(context?.searchData?.totalPages);
      window.scrollTo(0, 0);
    } else {
      postData('/api/product/filters', { ...filters, page: page || filters.page }).then(
        (res) => {
          setProductsData(res);
          setIsLoading(false);
          setTotalPages(res?.totalPages);
          window.scrollTo(0, 0);
        }
      );
    }
  }, [context?.searchData, filters, page, setIsLoading, setProductsData, setTotalPages]);

  useEffect(() => {
    filterData();
  }, [filterData]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    setFilters((prev) => ({
      ...prev,
      minPrice: price[0],
      maxPrice: price[1],
    }));
  }, [price]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      limit: rowsPerPage || 10,
      page: 1,
    }));
  }, [rowsPerPage]);

  return (
    <aside className="sidebar sticky top-[86px] z-[20] py-1">
      <div className="section-shell overflow-hidden p-4 md:p-5">
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#fff1eb] text-[#a65434]">
            <HiOutlineAdjustmentsHorizontal className="text-[20px]" />
          </div>

          <div>
            <span className="block text-[12px] font-[800] uppercase tracking-[0.08em] text-[#a65434]">
              Filter panel
            </span>
            <h3 className="mt-1 text-[18px] font-[800] leading-6 text-[#1f2937]">
              Tinh chinh ket qua
            </h3>
            <p className="mb-0 mt-1 text-[13px] leading-6 text-[#6b7280]">
              Chon danh muc, khoang gia va danh gia de thu hep danh sach san pham.
            </p>
          </div>
        </div>

        <div className="filter-box">
          <div className="mb-3 flex items-center gap-3 pr-1">
            <h3 className="text-[16px] font-[700] text-[#1f2937]">Shop By Category</h3>
            <Button
              className="!ml-auto !h-[34px] !min-w-[34px] !w-[34px] !rounded-full !bg-[#fff1eb] !text-[#a65434]"
              onClick={() => setIsopenCategoryFilter(!isopenCategoryFilter)}
            >
              {isopenCategoryFilter ? <FaAngleUp /> : <FaAngleDown />}
            </Button>
          </div>

          <Collapse isOpened={isopenCategoryFilter}>
            <div className="scroll sidebar-filter-list px-1">
              {context?.catData?.length !== 0 &&
                context?.catData?.map((item, index) => (
                  <FormControlLabel
                    key={index}
                    value={item?._id}
                    control={<Checkbox size="small" />}
                    checked={filters?.catId?.includes(item?._id)}
                    label={item?.name}
                    onChange={() => handleCheckboxChange('catId', item?._id)}
                    className="sidebar-check w-full"
                  />
                ))}
            </div>
          </Collapse>
        </div>

        <div className="filter-box mt-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-[16px] font-[700] text-[#1f2937]">Filter By Price</h3>
            <span className="rounded-full bg-[#fff1eb] px-3 py-1 text-[11px] font-[800] uppercase tracking-[0.06em] text-[#a65434]">
              VND
            </span>
          </div>

          <RangeSlider value={price} onInput={setPrice} min={0} max={600000} />

          <div className="priceRange mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-[18px] bg-[#fff8f5] px-3 py-3">
              <span className="block text-[11px] font-[800] uppercase tracking-[0.08em] text-[#a65434]">
                Tu
              </span>
              <strong className="mt-1 block text-[15px] font-[800] text-[#1f2937]">
                {price[0].toLocaleString('vi-VN')} d
              </strong>
            </div>

            <div className="rounded-[18px] bg-[#fff8f5] px-3 py-3">
              <span className="block text-[11px] font-[800] uppercase tracking-[0.08em] text-[#a65434]">
                Den
              </span>
              <strong className="mt-1 block text-[15px] font-[800] text-[#1f2937]">
                {price[1].toLocaleString('vi-VN')} d
              </strong>
            </div>
          </div>
        </div>

        <div className="filter-box mt-4">
          <h3 className="mb-3 text-[16px] font-[700] text-[#1f2937]">Filter By Rating</h3>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <label
                key={star}
                className="sidebar-rating-row flex cursor-pointer items-center justify-between gap-3 rounded-[18px] border border-transparent bg-[#fff8f5] px-3 py-2.5 transition-all duration-200 hover:border-[rgba(255,82,82,0.16)] hover:bg-white"
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    size="small"
                    checked={filters?.rating?.includes(star)}
                    onChange={() => handleCheckboxChange('rating', star)}
                  />
                  <span className="text-[13px] font-[700] text-[#1f2937]">{star} sao</span>
                </div>

                <Rating name={`rating-${star}`} value={star} size="small" readOnly />
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;

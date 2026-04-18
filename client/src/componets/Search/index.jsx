import { Button } from '@mui/material';
import React, { useContext, useState } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { MyContext } from '../../App';
import { postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const context = useContext(MyContext);
  const history = useNavigate();

  const onChangeInput = (e) => {
    setSearchQuery(e.target.value);
  };

  const search = () => {
    setIsLoading(true);

    const obj = {
      page: 1,
      limit: 30,
      query: searchQuery,
    };

    if (searchQuery !== '') {
      postData(`/api/product/search/get`, obj).then((res) => {
        context?.setSearchData(res);
        setTimeout(() => {
          setIsLoading(false);
          history('/search');
        }, 1000);
      });
    }
  };

  return (
    <div className="header-search relative w-full max-w-[520px] overflow-hidden rounded-full border border-[rgba(255,82,82,0.14)] bg-white shadow-[0_10px_26px_rgba(15,23,42,0.1)] backdrop-blur">
      <input
        type="text"
        className="h-[42px] w-full bg-transparent pl-4 pr-14 text-[13px] outline-none md:h-[46px]"
        placeholder="Tìm sản phẩm, thương hiệu hoặc danh mục..."
        value={searchQuery}
        onChange={onChangeInput}
      />
      <Button
        variant="text"
        className="!absolute right-[5px] top-[5px] z-50 !h-[32px] !min-w-[32px] !w-[32px] !rounded-full !bg-[#ff5252] !text-white hover:!bg-[#1f2937] md:!h-[36px] md:!min-w-[36px] md:!w-[36px]"
        onClick={search}
      >
        {isLoading === true ? (
          <CircularProgress color="inherit" />
        ) : (
          <IoIosSearch size={16} className="text-white" />
        )}
      </Button>
    </div>
  );
};

export default Search;

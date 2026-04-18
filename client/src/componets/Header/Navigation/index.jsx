import { Button } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { RiMenu2Fill } from 'react-icons/ri';
import { LiaAngleDownSolid } from 'react-icons/lia';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineSparkles } from 'react-icons/hi2';
import CategoryPanel from './CategoryPanel';
import '../Navigation/style.css';
import { MyContext } from '../../../App';

export const Navigation = () => {
  const [isopenCategoryPanel, setIsopenCategoryPanel] = useState(false);
  const [catData, setCatData] = useState([]);
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setCatData(context?.catData);
  }, [context?.catData]);

  const openCategoryPanel = () => {
    setIsopenCategoryPanel(true);
  };

  const handleCatClick = (cat) => {
    navigate(`/ProductListing?catId=${cat._id}&cat=${cat.name}`);
  };

  const handleSubCatClick = (subCat) => {
    navigate(`/ProductListing?subCatId=${subCat._id}&subCat=${subCat.name}`);
  };

  const handleThirdCatClick = (thirdCat) => {
    navigate(`/ProductListing?thirdsubCatId=${thirdCat._id}&thirdsubCat=${thirdCat.name}`);
  };

  return (
    <>
      <nav className="border-b border-[rgba(255,82,82,0.12)] bg-[linear-gradient(180deg,#fff_0%,#fff8f5_100%)] backdrop-blur-xl">
        <div className="container flex flex-col gap-3 py-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="col_1 w-full xl:w-[14%]">
            <Button
              className="navCategoryTrigger !flex !w-full !justify-start !gap-2 !rounded-[18px] !border !border-[rgba(255,82,82,0.14)] !bg-[linear-gradient(135deg,#fff4ef_0%,#fff_100%)] !px-4 !py-3 !text-[#1f2937] shadow-[0_14px_28px_rgba(15,23,42,0.08)] hover:!bg-[#fff8f5]"
              onClick={openCategoryPanel}
            >
              <span className="navCategoryTrigger__icon flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#ffeded] text-[#ff5252]">
                <RiMenu2Fill size={16} />
              </span>
              <span className="navCategoryTrigger__label text-[13px] font-[600] normal-case text-[#1f2937]">{context?.t('shopByCategory')}</span>
              <LiaAngleDownSolid size={12} className="navCategoryTrigger__arrow ml-auto font-bold text-[#ff5252]" />
            </Button>
          </div>

          <div className="col_2 w-full xl:w-[64%]">
            <div className="rounded-[20px] border border-[rgba(255,82,82,0.12)] bg-white/95 p-1.5 shadow-[0_14px_28px_rgba(15,23,42,0.05)]">
              <ul className="nav flex items-center gap-1 overflow-x-auto">
                <li className="list-none">
                  <Link to="/">
                    <Button
                      className={`navPill !rounded-full !px-3.5 !py-2.5 whitespace-nowrap !text-[13px] !font-[700] ${
                        location.pathname === '/'
                          ? '!bg-[#ff5252] !text-white'
                          : '!text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252]'
                      }`}
                    >
                      {context?.t('home')}
                    </Button>
                  </Link>
                </li>

                {catData?.length !== 0 &&
                  catData?.map((cat, index) => (
                    <li className="list-none relative" key={cat?._id || index}>
                      <Button
                        className="navPill !rounded-full !px-3.5 !py-2.5 !text-[13px] !font-[700] !text-[rgba(0,0,0,0.8)] whitespace-nowrap hover:!text-[#ff5252]"
                        onClick={() => handleCatClick(cat)}
                      >
                        {cat?.name}
                      </Button>

                      {Array.isArray(cat?.children) && cat.children.length > 0 && (
                        <div className="submenu absolute left-[0%] top-[118%] z-50 min-w-[220px] rounded-[20px] border border-[rgba(255,82,82,0.12)] bg-white p-2 shadow-[0_18px_40px_rgba(15,23,42,0.12)] opacity-0 transition-all">
                          <ul>
                            {cat?.children?.map((subCat, index_) => (
                              <li className="list-none relative w-full" key={subCat?._id || index_}>
                                <Button
                                  className="!w-full !justify-start !rounded-[14px] !px-3.5 !py-2.5 !text-left !text-[rgba(0,0,0,0.8)] !font-[600]"
                                  onClick={() => handleSubCatClick(subCat)}
                                >
                                  {subCat?.name}
                                </Button>

                                {Array.isArray(subCat?.children) && subCat.children.length > 0 && (
                                  <div className="submenu absolute left-full top-[0%] z-50 min-w-[210px] rounded-[20px] border border-[rgba(255,82,82,0.12)] bg-white p-2 shadow-[0_18px_40px_rgba(15,23,42,0.12)] opacity-0 transition-all">
                                    <ul>
                                      {subCat?.children?.map((thirdCat, index__) => (
                                        <li className="list-none w-full" key={thirdCat?._id || index__}>
                                          <Button
                                            className="!w-full !justify-start !rounded-[14px] !px-3.5 !py-2.5 !text-left !text-[rgba(0,0,0,0.8)] !font-[600]"
                                            onClick={() => handleThirdCatClick(thirdCat)}
                                          >
                                            {thirdCat?.name}
                                          </Button>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <div className="col_3 hidden xl:flex xl:w-[20%] xl:items-center xl:justify-end">
            <div className="flex items-center gap-3 rounded-[20px] border border-[rgba(255,82,82,0.12)] bg-[linear-gradient(135deg,#fff4ef_0%,#fff_100%)] px-3.5 py-2.5 shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
              <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#ffeded] text-[#ff5252]">
                <HiOutlineSparkles className="text-[13px]" />
              </span>
              <span className="flex items-center gap-2 text-[12px] font-[700] text-[#1f2937]">
                {context?.t('freeInternationalShipping')}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {catData?.length !== 0 && (
        <CategoryPanel
          isopenCategoryPanel={isopenCategoryPanel}
          setIsopenCategoryPanel={setIsopenCategoryPanel}
          data={catData}
        />
      )}
    </>
  );
};

export default Navigation;

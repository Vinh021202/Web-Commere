import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { FiMinus, FiPlus } from 'react-icons/fi';

const CategoryCollapse = (props) => {
  const [submenuIndex, setSubmenuIndex] = useState(null);
  const [innerSubmenuIndex, setInnerSubmenuIndex] = useState(null);

  const openSubmenu = (index) => {
    setSubmenuIndex(submenuIndex === index ? null : index);
    setInnerSubmenuIndex(null);
  };

  const openInnerSubmenu = (index) => {
    setInnerSubmenuIndex(innerSubmenuIndex === index ? null : index);
  };

  return (
    <div className="categoryTree scroll px-4 pb-5">
      <ul className="w-full space-y-2">
        {props?.data?.length !== 0 &&
          props?.data?.map((cat, index) => (
            <li key={cat?._id || index} className="categoryNode list-none">
              <div className="categoryRow flex items-center gap-2 rounded-[18px] border border-[rgba(255,82,82,0.1)] bg-white px-2 py-2 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                <Link to={'/'} className="min-w-0 flex-1">
                  <Button className="categoryTree__label !w-full !justify-start !rounded-[14px] !px-3 !py-2.5 !text-left !text-[14px] !font-[700] !text-[rgba(0,0,0,0.84)]">
                    <span className="truncate">{cat?.name}</span>
                  </Button>
                </Link>

                {cat?.children?.length > 0 && (
                  <Button
                    className="categoryTree__toggle !min-w-[36px] !w-[36px] !h-[36px] !rounded-full !bg-[#fff4ef] !text-[#ff5252]"
                    onClick={() => openSubmenu(index)}
                  >
                    {submenuIndex === index ? <FiMinus size={16} /> : <FiPlus size={16} />}
                  </Button>
                )}
              </div>

              {submenuIndex === index && (
                <ul className="mt-3 space-y-2 pl-3">
                  {cat?.children?.length !== 0 &&
                    cat?.children?.map((subCat, index_) => (
                      <li key={subCat?._id || index_} className="list-none">
                        <div className="flex items-center gap-2 rounded-[16px] border border-[rgba(255,82,82,0.08)] bg-[#fffaf9] px-2 py-2">
                          <Link to={'/'} className="min-w-0 flex-1">
                            <Button className="categoryTree__sublabel !w-full !justify-start !rounded-[12px] !px-3 !py-2 !text-left !text-[13px] !font-[600] !text-[rgba(0,0,0,0.78)]">
                              <span className="truncate">{subCat?.name}</span>
                            </Button>
                          </Link>

                          {subCat?.children?.length > 0 && (
                            <Button
                              className="categoryTree__toggle categoryTree__toggle--inner !min-w-[32px] !w-[32px] !h-[32px] !rounded-full !bg-white !text-[#ff5252]"
                              onClick={() => openInnerSubmenu(index_)}
                            >
                              {innerSubmenuIndex === index_ ? (
                                <FiMinus size={14} />
                              ) : (
                                <FiPlus size={14} />
                              )}
                            </Button>
                          )}
                        </div>

                        {innerSubmenuIndex === index_ && (
                          <ul className="mt-2 space-y-2 pl-3">
                            {subCat?.children?.length !== 0 &&
                              subCat?.children?.map((thirdLevelCat, index__) => (
                                <li key={thirdLevelCat?._id || index__} className="list-none">
                                  <Link
                                    to={'/'}
                                    className="categoryTree__leaf block rounded-[14px] border border-[rgba(255,82,82,0.06)] bg-white px-4 py-3 text-[13px] font-[600] text-[rgba(0,0,0,0.72)] transition hover:border-[rgba(255,82,82,0.18)] hover:text-[#ff5252]"
                                  >
                                    {thirdLevelCat?.name}
                                  </Link>
                                </li>
                              ))}
                          </ul>
                        )}
                      </li>
                    ))}
                </ul>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default CategoryCollapse;

import React, { useContext, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import { FaAngleDown } from "react-icons/fa";
import { HiOutlineFolderOpen, HiOutlineSquares2X2 } from "react-icons/hi2";
import { IoMdAdd } from "react-icons/io";
import { MyContext } from "../../App";
import EditSubBoxCat from "./editSubBoxCat";

const copy = {
  VN: {
    categoryStructure: "Cau truc danh muc",
    subCategoryTree: "Cay danh muc con",
    subtitle:
      "Mo rong tung danh muc cha de sua cap 2 va cap 3 ma khong mat bo cuc phan cap hien tai.",
    addNewSubCategory: "Them danh muc con moi",
    parentCategories: "Danh muc cha",
    nestedCategories: "Danh muc long nhau",
    hierarchyView: "Che do phan cap",
    parentAndNested: "Danh muc cha va danh muc con",
    parentGroups: "nhom cha",
    directSubCategories: "danh muc con truc tiep",
    noSubCategoryYet: "Danh muc cha nay chua co danh muc con.",
    noHierarchyYet: "Chua co cau truc danh muc",
    noHierarchyText:
      "Hay tao danh muc cha truoc, sau do them danh muc con de xay dung cay san pham.",
  },
  EU: {
    categoryStructure: "Category Structure",
    subCategoryTree: "Sub Category Tree",
    subtitle:
      "Expand each parent category to edit second-level and third-level nodes without losing the current hierarchy view.",
    addNewSubCategory: "Add New Sub Category",
    parentCategories: "Parent Categories",
    nestedCategories: "Nested Categories",
    hierarchyView: "Hierarchy View",
    parentAndNested: "Parent and nested categories",
    parentGroups: "parent groups",
    directSubCategories: "direct sub categories",
    noSubCategoryYet: "This parent category does not have sub categories yet.",
    noHierarchyYet: "No category hierarchy yet",
    noHierarchyText:
      "Add a parent category first, then create sub categories to build your product tree.",
  },
};

const SubCatList = () => {
  const [isOpen, setIsOpen] = useState(0);
  const context = useContext(MyContext);
  const categoryData = context?.catData || [];
  const c = copy[context.language] || copy.EU;

  const stats = useMemo(() => {
    const secondLevelCount = categoryData.reduce(
      (total, item) => total + (item?.children?.length || 0),
      0,
    );

    const thirdLevelCount = categoryData.reduce(
      (total, item) =>
        total +
        (item?.children?.reduce(
          (subTotal, child) => subTotal + (child?.children?.length || 0),
          0,
        ) || 0),
      0,
    );

    return [
      {
        label: c.parentCategories,
        value: categoryData.length,
        icon: <HiOutlineFolderOpen className="text-[20px]" />,
      },
      {
        label: c.nestedCategories,
        value: secondLevelCount + thirdLevelCount,
        icon: <HiOutlineSquares2X2 className="text-[20px]" />,
      },
    ];
  }, [c.nestedCategories, c.parentCategories, categoryData]);

  const expend = (index) => {
    setIsOpen((prev) => (prev === index ? -1 : index));
  };

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[28px] border border-white/60 bg-[linear-gradient(135deg,_#ffffff_0%,_#f5f8ff_55%,_#eefbf4_100%)] p-5 shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[680px]">
            <p className="text-[12px] font-[800] uppercase tracking-[0.22em] text-[#3872fa]">
              {c.categoryStructure}
            </p>
            <h1 className="mt-2 text-[28px] font-[900] leading-tight text-[#14213d]">
              {c.subCategoryTree}
            </h1>
            <p className="mt-2 text-[14px] leading-6 text-slate-600">
              {c.subtitle}
            </p>
          </div>

          <Button
            className="!min-w-[220px] !rounded-[16px] !bg-[linear-gradient(135deg,_#14213d,_#3872fa)] !px-4 !py-2.5 !text-[13px] !font-[800] !capitalize !text-white shadow-[0_14px_30px_rgba(56,114,250,0.22)]"
            onClick={() =>
              context.setIsOpenFullScreenPanel({
                open: true,
                model: "Add New Sub Category",
              })
            }
          >
            <IoMdAdd className="mr-2 text-[18px]" />
            {c.addNewSubCategory}
          </Button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {stats.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-[22px] border border-white/60 bg-white/75 px-4 py-4 shadow-[0_10px_28px_rgba(15,23,42,0.04)] backdrop-blur"
            >
              <div>
                <p className="text-[12px] font-[800] uppercase tracking-[0.14em] text-slate-400">
                  {item.label}
                </p>
                <p className="mt-2 text-[28px] font-[900] leading-none text-[#14213d]">
                  {item.value}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#eef4ff] text-[#3872fa]">
                {item.icon}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-[#edf1f7] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-[12px] font-[800] uppercase tracking-[0.16em] text-slate-400">
              {c.hierarchyView}
            </p>
            <h2 className="mt-1 text-[20px] font-[900] text-[#14213d]">
              {c.parentAndNested}
            </h2>
          </div>

          <div className="rounded-[16px] bg-[#f7f9fc] px-4 py-3 text-[13px] font-[700] text-slate-500">
            {categoryData.length} {c.parentGroups}
          </div>
        </div>

        {categoryData.length > 0 ? (
          <ul className="space-y-3">
            {categoryData.map((firstLevelCat, index) => {
              const isExpanded = isOpen === index;
              const children = firstLevelCat?.children || [];

              return (
                <li
                  className="overflow-hidden rounded-[22px] border border-[#edf1f7] bg-[#fcfdff]"
                  key={firstLevelCat?._id || index}
                >
                  <div className="flex items-center gap-3 px-4 py-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#eef4ff] text-[#3872fa]">
                      <HiOutlineFolderOpen className="text-[20px]" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-[800] text-[#14213d]">
                        {firstLevelCat?.name}
                      </p>
                      <p className="mt-1 text-[12px] font-[600] text-slate-500">
                        {children.length} {c.directSubCategories}
                      </p>
                    </div>

                    <Button
                      className="!ml-auto !min-w-[42px] !rounded-[14px] !bg-[#f6f8ff] !p-0 !text-[#3872fa] hover:!bg-[#e9f0ff]"
                      onClick={() => expend(index)}
                    >
                      <FaAngleDown
                        className={`text-[14px] transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </div>

                  {isExpanded ? (
                    <div className="border-t border-[#edf1f7] bg-white px-4 py-4">
                      {children.length > 0 ? (
                        <ul className="space-y-3">
                          {children.map((subCat, subIndex) => (
                            <li
                              className="rounded-[18px] border border-[#eef2f7] bg-[#fbfcff] p-3"
                              key={subCat?._id || subIndex}
                            >
                              <EditSubBoxCat
                                name={subCat?.name}
                                id={subCat?._id}
                                catData={categoryData}
                                index={subIndex}
                                selectedCat={subCat?.parentId}
                                selectedCatName={subCat?.parentCatName}
                              />

                              {subCat?.children?.length > 0 ? (
                                <ul className="mt-3 space-y-2 border-l-2 border-[#e5eefc] pl-4">
                                  {subCat.children.map((thirdLevel, thirdIndex) => (
                                    <li
                                      key={thirdLevel?._id || thirdIndex}
                                      className="rounded-[16px] border border-[#f1f5f9] bg-white p-2.5"
                                    >
                                      <EditSubBoxCat
                                        name={thirdLevel?.name}
                                        catData={firstLevelCat?.children}
                                        index={thirdIndex}
                                        selectedCat={thirdLevel?.parentId}
                                        selectedCatName={thirdLevel?.parentCatName}
                                        id={thirdLevel?._id}
                                      />
                                    </li>
                                  ))}
                                </ul>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="rounded-[18px] border border-dashed border-[#dbe4f0] bg-[#f8fbff] px-4 py-6 text-center">
                          <p className="text-[14px] font-[700] text-slate-500">
                            {c.noSubCategoryYet}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="rounded-[22px] border border-dashed border-[#dbe4f0] bg-[#f8fbff] px-5 py-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#eef4ff] text-[#3872fa]">
              <HiOutlineSquares2X2 className="text-[28px]" />
            </div>
            <h3 className="mt-4 text-[18px] font-[800] text-[#14213d]">
              {c.noHierarchyYet}
            </h3>
            <p className="mt-2 text-[13px] leading-6 text-slate-500">
              {c.noHierarchyText}
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default SubCatList;

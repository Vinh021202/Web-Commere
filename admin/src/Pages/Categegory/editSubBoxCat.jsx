import Button from "@mui/material/Button";
import React, { useContext, useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdOutlineModeEdit } from "react-icons/md";
import { MyContext } from "../../App";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import { deleteData, editData } from "../../utils/api";

const EditSubBoxCat = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [selectVal, setSelectVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    name: "",
    parentCatName: null,
    parentId: null,
  });

  const context = useContext(MyContext);

  useEffect(() => {
    setFormFields({
      name: props?.name,
      parentCatName: props?.parentCatName,
      parentId: props?.parentId,
    });
    setSelectVal(props?.selectedCat);
  }, [props?.name, props?.parentCatName, props?.parentId, props?.selectedCat]);

  const handleChange = (event) => {
    setSelectVal(event.target.value);
    formFields.parentId = event.target.value;
  };

  const onChangeInput = (e) => {
    const { name, value } = e.target;

    const catId = selectVal;
    setSelectVal(catId);

    setFormFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (formFields.name === "") {
      context.alertBox("error", "Please Category name");
      setIsLoading(false);
      return false;
    }

    editData(`/api/category/${props?.id}`, formFields).then((res) => {
      setTimeout(() => {
        context?.alertBox("success", res?.data?.message);
        setIsLoading(false);
        setEditMode(false); // ← thêm dòng này
        context?.getCat(); // fetch lại data mới từ server
      }, 2500);
    });
  };

  const deleteCat = (id) => {
    deleteData(`/api/category/${id}`).then((res) => {
        context.getCat();
    })
  }

  return (
    <>
      <form
        className="flex w-full items-center gap-3"
        onSubmit={handleSubmit}
      >
        {editMode === true && (
          <>
            <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center">
              <div className="w-full lg:w-[170px]">
                <Select
                  style={{ zoom: "75%" }}
                  className="w-full"
                  size="small"
                  value={selectVal}
                  onChange={handleChange}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                >
                  {props?.catData?.length !== 0 &&
                    props?.catData?.map((item, index) => {
                      return (
                        <MenuItem
                          value={item?._id}
                          key={index}
                          onClick={() => {
                            formFields.parentCatName = item?.name;
                          }}
                        >
                          {item?.name}
                        </MenuItem>
                      );
                    })}
                </Select>
              </div>
              <input
                type="text"
                className="h-[42px] w-full rounded-[14px] border border-[#dbe4f0] bg-white px-4 text-sm font-[600] text-slate-700 outline-none transition-all focus:border-[#3872fa] focus:shadow-[0_0_0_4px_rgba(56,114,250,0.12)]"
                name="name"
                value={formFields?.name}
                onChange={onChangeInput}
              />
              <div className="flex items-center gap-2 lg:ml-auto">
                <Button
                  size="small"
                  className="!rounded-[12px] !bg-[#3872fa] !px-4 !py-2 !text-[12px] !font-[800] !capitalize !text-white"
                  type="submit"
                  variant="contained"
                >
                  {isLoading === true ? (
                    <CircularProgress color="inherit" />
                  ) : (
                    <>Edit</>
                  )}
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  className="!rounded-[12px] !border-[#dbe4f0] !px-4 !py-2 !text-[12px] !font-[800] !capitalize !text-slate-600"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </>
        )}
        {editMode === false && (
          <>
            <span className="text-[14px] font-[700] text-[#14213d]">
              {props?.name}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <Button
                className="!min-w-[38px] !w-[38px] !h-[38px] !rounded-[12px] !bg-[#eef4ff] !text-[#3872fa] hover:!bg-[#dfeaff]"
                onClick={() => {
                  setEditMode(true);
                  //   setSelectVal(props.selectedCat);
                }}
              >
                <MdOutlineModeEdit />
              </Button>
              <Button
                className="!min-w-[38px] !w-[38px] !h-[38px] !rounded-[12px] !bg-[#fff1f2] !text-[#e11d48] hover:!bg-[#ffe4e6]"
                onClick={() => deleteCat(props?.id)}
              >
                <FaRegTrashAlt />
              </Button>
            </div>
          </>
        )}
      </form>
    </>
  );
};

export default EditSubBoxCat;

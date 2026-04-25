import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { GoTrash } from "react-icons/go";
import { MdLocalPhone, MdOutlineMarkEmailRead } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { HiOutlineUsers } from "react-icons/hi2";
import SearchBox from "../../Components/SearchBox";
import { MyContext } from "../../App";
import {
  deleteData,
  deleteMultipleData,
  editData,
  fetchDataFromApi,
} from "../../utils/api";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const columns = [
  { id: "userImg", label: "USER IMAGE", minWidth: 80 },
  { id: "userName", label: "USER NAME", minWidth: 150 },
  { id: "userEmail", label: "USER EMAIL", minWidth: 150 },
  { id: "userPh", label: "USER PHONE", minWidth: 150 },
  { id: "role", label: "ROLE", minWidth: 140 },
  { id: "veriyemail", label: "EMAIL VERIFY", minWidth: 150 },
  { id: "createdDate", label: "CREATED", minWidth: 150 },
  { id: "action", label: "ACTION", minWidth: 150 },
];

const Users = () => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [userData, setUserData] = useState([]);
  const [userTotalData, setUserTotalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortedIds, setSortedIds] = useState([]);

  const context = useContext(MyContext);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (searchQuery !== "") {
      const filteredItems = userTotalData?.filter(
        (user) =>
          user?._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user?.createdAt?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setUserData(filteredItems);
    } else {
      fetchDataFromApi(`/api/user/getAllUsers`).then((res) => {
        if (res?.error === false) {
          setUserData(res?.users);
          setIsLoading(false);
        }
      });
    }
  }, [searchQuery]);

  const getUser = () => {
    setIsLoading(true);
    fetchDataFromApi(`/api/user/getAllUsers`).then((res) => {
      if (res?.users) {
        setUserData(
          res.users.map((user) => ({
            ...user,
            checked: false,
          })),
        );
        setUserTotalData(res.users);
      }
      setIsLoading(false);
    });
  };

  const deleteUser = (id) => {
    deleteData(`/api/user/delete/${id}`).then((res) => {
      if (res?.data?.error || res?.error) {
        context.alertBox(
          "error",
          res?.data?.message || res?.message || "Unable to delete user",
        );
        return;
      }

      getUser();
      context.alertBox("success", "User deleted");
    });
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    const updateItems = userData.map((item) => ({
      ...item,
      checked: isChecked,
    }));
    setUserData(updateItems);
    if (isChecked) {
      setSortedIds(updateItems.map((item) => item._id).sort((a, b) => a - b));
    } else {
      setSortedIds([]);
    }
  };

  const handleCheckboxChange = (e, id) => {
    const updateItems = userData.map((item) =>
      item._id === id ? { ...item, checked: !item.checked } : item,
    );
    setUserData(updateItems);
    const selectedIds = updateItems
      .filter((item) => item.checked)
      .map((item) => item._id)
      .sort((a, b) => a - b);
    setSortedIds(selectedIds);
  };

  const deleteMultiple = () => {
    if (sortedIds.length === 0) {
      context.alertBox("error", "Please select items to delete");
      return;
    }
    try {
      deleteMultipleData(`/api/user/deleteMultiple`, sortedIds).then((res) => {
        if (res?.data?.error || res?.error) {
          context.alertBox(
            "error",
            res?.data?.message || res?.message || "Error deleting items",
          );
          return;
        }

        getUser();
        setSortedIds([]);
        context.alertBox("success", "Users deleted");
      });
    } catch (error) {
      context.alertBox("error", "Error deleting items");
    }
  };

  const updateRole = (id, role) => {
    editData(`/api/user/role/${id}`, { role }).then((res) => {
      if (res?.data?.error || res?.error) {
        context.alertBox(
          "error",
          res?.data?.message || res?.message || "Unable to update role",
        );
        getUser();
        return;
      }

      setUserData((prev) =>
        prev.map((user) => (user._id === id ? { ...user, role } : user)),
      );
      setUserTotalData((prev) =>
        prev.map((user) => (user._id === id ? { ...user, role } : user)),
      );
      context.alertBox("success", "User role updated");
    });
  };

  const verifiedUsers = userData?.filter(
    (user) => user?.verify_email === true,
  )?.length;
  const paginatedUsers = userData?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-6 rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,_rgba(255,255,255,0.92),_rgba(245,247,255,0.96))] p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,_#14213d,_#3872fa)] text-white shadow-[0_16px_35px_rgba(56,114,250,0.20)]">
            <HiOutlineUsers className="text-[26px]" />
          </div>
          <div>
            <p className="text-[11px] font-[800] uppercase tracking-[0.18em] text-slate-400">
              User Manager
            </p>
            <h2 className="mt-2 text-[28px] font-[900] leading-none text-[#14213d]">
              Users List
            </h2>
            <p className="mt-2 text-[14px] text-slate-500">
              Track accounts, email verification status and registration dates.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-[18px] border border-[#e6edfb] bg-white/80 px-4 py-3 text-right shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
            <p className="text-[11px] font-[800] uppercase tracking-[0.14em] text-slate-400">
              Total Users
            </p>
            <p className="mt-1 text-[22px] font-[900] text-[#3872fa]">
              {userData?.length || 0}
            </p>
          </div>
          <div className="rounded-[18px] border border-[#daf4e7] bg-[#f5fcf8] px-4 py-3 text-right shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
            <p className="text-[11px] font-[800] uppercase tracking-[0.14em] text-slate-400">
              Verified
            </p>
            <p className="mt-1 text-[22px] font-[900] text-[#10b981]">
              {verifiedUsers || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="card my-6 overflow-hidden rounded-[28px] border border-white/70 bg-white/90 pt-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between border-b border-[#eef2f7] px-6 pb-5">
          <div>
            <p className="text-[11px] font-[800] uppercase tracking-[0.18em] text-slate-400">
              Accounts
            </p>
            <h3 className="mt-2 text-[22px] font-[900] text-[#14213d]">
              Registered Users
            </h3>
          </div>

          <div className="col flex w-[45%] items-center gap-3">
            {sortedIds?.length !== 0 && (
              <Button
                variant="contained"
                className="!rounded-[16px] !px-4 !py-3 !text-[13px] !font-[800] !capitalize"
                color="error"
                onClick={deleteMultiple}
              >
                Delete ({sortedIds.length})
              </Button>
            )}
            <SearchBox
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
        </div>

        <div className="px-6 pb-4 pt-5">
          <div className="overflow-hidden rounded-[24px] border border-[#edf2f8] bg-[#fcfdff] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
            <TableContainer sx={{ maxHeight: 560 }}>
              <Table stickyHeader aria-label="sticky table">
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
                      userData?.length > 0
                        ? userData.every((item) => item.checked)
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
                    <span className="whitespace-nowrap">{column.label}</span>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading === false ? (
                paginatedUsers?.length !== 0 ? (
                  paginatedUsers?.map((user, index) => (
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
                      <TableCell>
                        <Checkbox
                          {...label}
                          size="small"
                          checked={user.checked === true}
                          onChange={(e) => handleCheckboxChange(e, user._id)}
                        />
                      </TableCell>

                      <TableCell>
                        <div className="h-[58px] w-[58px] overflow-hidden rounded-[18px] border border-[#e8eef7] bg-white p-1.5 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                          <img
                            src={
                              user?.avatar !== "" && user?.avatar !== undefined
                                ? user?.avatar
                                : "/user.jpg"
                            }
                            className="h-full w-full rounded-[12px] object-cover transition-all duration-300 hover:scale-[1.04]"
                          />
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="min-w-[180px]">
                          <p className="font-[800] text-[#14213d]">{user?.name}</p>
                          <p className="text-[12px] text-slate-400">
                            ID: {user?._id?.slice(0, 8)}...
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="inline-flex min-w-[220px] items-center gap-2 rounded-full border border-[#e4ecfb] bg-[#f7faff] px-3 py-2 text-[12px] font-[700] text-slate-600">
                          <MdOutlineMarkEmailRead className="text-[16px] text-[#3872fa]" />
                          {user?.email}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="inline-flex min-w-[150px] items-center gap-2 rounded-full border border-[#eaf7ef] bg-[#f6fdf8] px-3 py-2 text-[12px] font-[700] text-slate-600">
                          <MdLocalPhone className="text-[16px] text-[#10b981]" />
                          {user?.mobile ? user?.mobile : "NONE"}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Select
                          size="small"
                          value={user?.role || "USER"}
                          onChange={(e) => updateRole(user?._id, e.target.value)}
                          sx={{
                            minWidth: 120,
                            borderRadius: "999px",
                            backgroundColor:
                              user?.role === "ADMIN" ? "#eef4ff" : "#f8fafc",
                            fontSize: "12px",
                            fontWeight: 800,
                            ".MuiSelect-select": {
                              py: 1,
                              px: 1.5,
                            },
                          }}
                        >
                          <MenuItem value="USER">USER</MenuItem>
                          <MenuItem value="ADMIN">ADMIN</MenuItem>
                        </Select>
                      </TableCell>

                      <TableCell>
                        {user?.verify_email === false ? (
                          <span className="inline-flex rounded-full border border-[#ffd9d9] bg-[#fff5f5] px-3 py-1 text-[11px] font-[800] uppercase tracking-[0.08em] text-[#ef4444]">
                            Not Verified
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full border border-[#d7f5e4] bg-[#f4fcf7] px-3 py-1 text-[11px] font-[800] uppercase tracking-[0.08em] text-[#10b981]">
                            Verified
                          </span>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#edf0f5] bg-[#f8fafc] px-3 py-2 text-[12px] font-[700] text-slate-600">
                          <SlCalender className="text-[14px] text-slate-400" />
                          {user?.createdAt?.split("T")[0]}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Button
                            className="!h-[40px] !min-w-[40px] !rounded-[14px] !border !border-[#ffe0e0] !bg-[#fff5f5] !text-[#ef4444]"
                            onClick={() => deleteUser(user?._id)}
                          >
                            <GoTrash className="text-[18px]" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9}>
                      <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#f4f7ff] text-[#3872fa] shadow-[0_12px_30px_rgba(56,114,250,0.08)]">
                          <HiOutlineUsers className="text-[30px]" />
                        </div>
                        <h4 className="mt-5 text-[18px] font-[900] text-[#14213d]">
                          No users found
                        </h4>
                        <p className="mt-2 max-w-[320px] text-[13px] leading-6 text-slate-500">
                          Try another search keyword or refresh the user list to
                          load more accounts.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={9}>
                    <div className="flex min-h-[320px] w-full items-center justify-center">
                      <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-[0_10px_25px_rgba(15,23,42,0.06)]">
                        <CircularProgress color="inherit" size={22} />
                        <span className="text-[13px] font-[700] text-slate-600">
                          Loading users...
                        </span>
                      </div>
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
          count={userData?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </>
  );
};

export default Users;

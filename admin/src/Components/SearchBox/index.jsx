import React, { useRef } from "react";
import { IoClose, IoSearch } from "react-icons/io5";

const SearchBox = (props) => {
  const searchInput = useRef();

  const onChangeInput = (e) => {
    const value = e.target.value;

    if (props.setSearchQuery) {
      props.setSearchQuery(value);
    }

    if (value === "" && props.setPageOrder) {
      props.setPageOrder(0);
    }
  };

  const clearSearch = () => {
    if (props.setSearchQuery) {
      props.setSearchQuery("");
    }

    if (props.setPageOrder) {
      props.setPageOrder(0);
    }

    searchInput.current?.focus();
  };

  return (
    <div className="rounded-[22px] border border-[#edf2f8] bg-[linear-gradient(180deg,_#ffffff,_#f8fbff)] p-4 shadow-[0_10px_25px_rgba(15,23,42,0.03)]">
      <p className="mb-2 text-[12px] font-[800] uppercase tracking-[0.08em] text-slate-500">
        Search
      </p>

      <div className="group relative overflow-hidden rounded-[18px] border border-[#dbe4f0] bg-[#fbfcff] shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition-all focus-within:border-[#3872fa] focus-within:shadow-[0_0_0_4px_rgba(56,114,250,0.12)]">
        <IoSearch className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[18px] text-slate-400 transition-all group-focus-within:text-[#3872fa]" />

        <input
          type="text"
          className="h-[46px] w-full border-0 bg-transparent pl-11 pr-12 text-[13px] font-[600] text-slate-700 outline-none placeholder:text-slate-400"
          placeholder="Search products, category..."
          value={props.searchQuery ?? ""}
          ref={searchInput}
          onChange={onChangeInput}
        />

        {props.searchQuery ? (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#eef4ff] text-[#3872fa] transition-all hover:bg-[#dfeaff]"
            aria-label="Clear search"
          >
            <IoClose className="text-[18px]" />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default SearchBox;

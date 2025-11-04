import React from "react";
import { HiOutlineSearch } from "react-icons/hi";

/**
 * Search 컴포넌트
 * @param {string} placeholder - input의 placeholder 텍스트
 * @param {string} placeholderClass - placeholder에 적용할 커스텀 클래스
 * @param {string} inputClass - input에 적용할 커스텀 클래스
 * @param {function} onChange - input 값 변경 핸들러
 * @param {string} value - input 값
 */
function Search({
  placeholder = "",
  placeholderClass = "search-placeholder",
  inputClass = "",
  onChange,
  value,
}) {
  return (
    <div className="flex items-center w-full">
      <div className="flex justify-center items-center mr-2">
        <HiOutlineSearch size={36} className="" />
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`rounded-lg bg-transparent focus:outline-none border-none ${inputClass} ${placeholderClass}`}
      />
      <style>
        {`
          .${placeholderClass}::placeholder {
            color: #000;
            font-weight: bold;
            font-size: 14px;
          }
        `}
      </style>
    </div>
  );
}

export default Search;

import React from "react";
import searchIcon from "../../assets/images/searchIcon.png";

const SearchBar = (props) => {

    const onChange = (event) => {
        props.onChange(event.target.value);
    }

    return (
        <div className="inline-block">
            <img src={searchIcon} className="absolute w-[24px] my-[3px] ml-[5px]"></img>
            <input onChange={onChange} className="bg-gray-light rounded-[5px] w-[120px] font-bold h-[30px] text-[15px] pl-[32px]" placeholder="Search">
                
            </input>
        </div>
    );
}

export default SearchBar;
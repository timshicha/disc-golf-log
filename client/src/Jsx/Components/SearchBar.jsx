import React from "react";
import searchIcon from "../../assets/images/searchIcon.png";

const SearchBar = (props) => {

    const onChange = (event) => {
        props.onChange(event.target.value);
    }

    return (
        <div className={props.className}>
            <img src={searchIcon} className="absolute w-[24px] my-[3px] ml-[5px]" alt="Search icon"></img>
            <input onChange={onChange} id={props.id} name={props.name} className="bg-gray-light rounded-[5px] w-[120px] font-bold h-[30px] text-[16px] pl-[32px]" placeholder="Search">
            </input>
        </div>
    );
}

export default SearchBar;
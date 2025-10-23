import { useState } from "react";
import MenuModal from "../Modals/Frames/MenuModal";
import ModalTitle from "../Modals/ModalComponents/ModalTitle";
import ModalButton from "../Modals/ModalComponents/ModalButton";
import sortByIcon from "../../assets/images/sortByIcon.png";
import checkMark from "../../assets/images/checkMark.png";

const SortCoursesBy = (props) => {

    const [showModal, setShowModal] = useState(false);

    const onSubmit = (sortBy) => {
        props.onSubmit(sortBy);
        setShowModal(false);
    }

    return (
        <div className={props.className}>
            <div className="p-[3px] bg-gray-light text-gray-mild rounded-[5px] font-bold text-[16px] cursor-pointer" onClick={() => setShowModal(true)}>
                <img src={sortByIcon} className="h-[28px]" alt="Sort by"></img>
            </div>
            {showModal &&
                <MenuModal onClose={() => setShowModal(false)}>
                    <ModalTitle>Sort Courses By</ModalTitle>
                    <ModalButton className="w-[95%] bg-gray-dark text-white m-[5px]" onClick={() => onSubmit("Alphabetically")}>
                        {props.selected === "Alphabetically" &&
                            <img src={checkMark} className="absolute w-[18px] py-[4px]"/>
                        }
                        Alphabetically
                    </ModalButton>
                    <ModalButton className="w-[95%] bg-gray-dark text-white m-[5px]" onClick={() => onSubmit("Most played")}>
                        {props.selected === "Most played" &&
                            <img src={checkMark} className="absolute w-[18px] py-[4px]"/>
                        }
                        Most played
                    </ModalButton>
                    <ModalButton className="w-[95%] bg-gray-dark text-white m-[5px]" onClick={() => onSubmit("Recently modified")}>
                    {props.selected === "Recently modified" &&
                        <img src={checkMark} className="absolute w-[18px] py-[4px]"/>
                    }
                        Recently modified
                    </ModalButton>
                </MenuModal>
            }
        </div>
    );
}

export default SortCoursesBy;
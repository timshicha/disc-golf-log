import LargeModal from "./Frames/LargeModal";
import ModalTitle from "./ModalComponents/ModalTitle";

const SocialModal = (props) => {

    const username = localStorage.getItem("username") || "";

    return (
        <LargeModal {...props}>
            <ModalTitle>Social</ModalTitle>
            <div className="bg-gray-light w-[95%] mx-auto h-[50px]">
                <div className="w-[fit-content] text-desc text-gray-mild ml-[10px]">{username}</div>
            </div>
        </LargeModal>
    );
}

export default SocialModal;
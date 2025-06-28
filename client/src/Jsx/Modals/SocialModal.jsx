import LargeModal from "./Frames/LargeModal";
import ModalTitle from "./ModalComponents/ModalTitle";

const SocialModal = (props) => {

    const username = localStorage.getItem("username") || null;

    return (
        <LargeModal {...props}>
            <ModalTitle>Social</ModalTitle>
            {username ?
            <div className="bg-gray-light w-[95%] mx-auto h-[50px]">
                <div className="w-[fit-content] text-desc text-gray-mild ml-[10px]">{username}</div>
            </div> :
            <div className="text-desc text-gray-mild mt-[50%]">
                Log in to view social page.
            </div>}
        </LargeModal>
    );
}

export default SocialModal;
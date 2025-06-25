import LargeModal from "./Frames/LargeModal";
import ModalTitle from "./ModalComponents/ModalTitle";

const SocialModal = (props) => {

    return (
        <LargeModal {...props}>
            <ModalTitle>Social</ModalTitle>
            <div className="mt-[50%] text-desc text-black">Social page coming soon!</div>
        </LargeModal>
    );
}

export default SocialModal;
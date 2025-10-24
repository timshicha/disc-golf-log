import LargeModal from "./Frames/LargeModal";
import ModalTitle from "./ModalComponents/ModalTitle";


const SearchCourseInfoModal = (props) => {

    return (
        <>
            <LargeModal onClose={props.onClose}>
                <ModalTitle>Find a Course</ModalTitle>
            </LargeModal>
        </>
    );
}

export default SearchCourseInfoModal;
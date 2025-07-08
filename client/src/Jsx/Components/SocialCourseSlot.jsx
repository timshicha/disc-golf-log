
const SocialCourseSlot = (props) => {

    return (
        <button {...props} className="text-left bg-[#c0c0c0] w-[45%] text-black pl-[8px] py-[3px] pr-[5px] m-[3px] rounded-[7px] truncate">
            {props.course.name}
        </button>
    );
}

export default SocialCourseSlot;
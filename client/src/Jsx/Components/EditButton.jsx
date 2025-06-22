import editIcon from "../../assets/images/editIcon.png";

const EditButton = (props) => {

    const { className, ...otherProps } = props;

    return (
        <button {...otherProps} className={"rounded-[7px] " + className}>
            <img src={editIcon}/>
        </button>
    );
}

export default EditButton;
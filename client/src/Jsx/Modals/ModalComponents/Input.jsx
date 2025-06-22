
const Input = (props) => {
    const { className, ...otherProps } = props;

    return (
        <input {...props} className={"text-[20px] font-sans font-bold inline-block p-[5px] bg-gray-lighter placeholder-gray-300 " + className}></input>
    );
}

export default Input;
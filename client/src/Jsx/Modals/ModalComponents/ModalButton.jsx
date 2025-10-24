import React from "react";
import "../../../css/general.css";
import LoadingImg from "../../Components/LoadingImg";

class ModalButton extends React.Component {

    render = () => {
        const { loading, className, disabled, children, ...otherProps } = this.props;
        return (
            <button {...otherProps} className={"relative inline-block text-[18px] px-[10px] py-[5px] font-bold font-sans rounded-[7px] cursor-pointer " + className + (loading || disabled ? " pointer-events-none opacity-60 " : "")}>
                {loading &&
                    <div className="absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%]">
                        <LoadingImg className="w-[20px]"></LoadingImg>
                    </div>
                }
                {/* If loading, opacity 0; if disabled, opacity 0.5 */}
                <div className={loading ? "opacity-0" : (disabled ? "opacity-[0.5]" : "")}>
                    {children}
                </div>
            </button>
        );
    }
}

export default ModalButton;
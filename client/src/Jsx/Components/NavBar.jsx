import React from "react";
import "../../css/navbar.css";
import ModalButton from "../Modals/ModalComponents/ModalButton";
import GoogleLoginButton from "./GoogleLoginButton";
import titleLogo from "../../assets/images/title-logo.png";
import cogwheel from "../../assets/images/cogwheel.png";

class NavBar extends React.Component {
    constructor (props) {
        super(props);

        this.props = props;
    }

    onGoogleLoginSuccess = (data) => {
        for (let key in data) {
            console.log(key + ": " + data[key]);
        }

        localStorage.setItem("signed-in-email", data.email);
    }

    navigateTo = (newPage) => {
        if(this.props.navigateTo) {
            this.props.navigateTo(newPage);
        }
        else {
            alert("This feature is under construction!");
        }
    }

    render = () => {
        return (
            <div className="navbar">
                <img src={titleLogo} className="navbar-title-logo"></img>
                <div className="navbar-right-items">
                    <GoogleLoginButton onSuccess={this.onGoogleLoginSuccess}>
                        <ModalButton className="login-button">Sign in</ModalButton>
                    </GoogleLoginButton>
                    <button className="navbar-hamburger-button" onClick={() => {
                        this.navigateTo("settings");
                    }}>
                        <img src={cogwheel}></img>
                    </button>
                </div>
            </div>
        );
    }
}

export default NavBar;
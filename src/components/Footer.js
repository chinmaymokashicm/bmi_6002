// import PropTypes from "prop-types"

import Button from "./Button";

const Footer = ({ buttonText, buttonOnClick, resetText, resetOnClick, continueText, continueOnClick, isFinishButton }) => {
    const resetButton = <Button text={resetText} onClick={resetOnClick}/>
    const contineButton = <Button text={continueText} onClick={continueOnClick}/>
    const finishButton = <Button text="Finish" onClick={null} />
    if(isFinishButton) {
        return <div className="Footer">
            {resetButton}
            {contineButton}
            {finishButton}
        </div>
    }
    else {
        return <div className="Footer">
            {resetButton}
            {contineButton}
        </div>
    }
};

Footer.defaultProps = {
    resetText: "Reset",
    continueText: "Continue",
    isFinishButton: false
}

export default Footer;

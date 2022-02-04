// import PropTypes from "prop-types"

import Button from "./Button";

const Footer = ({ resetText, resetOnClick, continueText, continueOnClick, isFinishButton }) => {
    const resetButton = <Button text={resetText} onClick={resetOnClick}/>
    const continueButton = <Button text={continueText} onClick={continueOnClick}/>
    const finishButton = <Button text="Finish" onClick={null} />
    if(isFinishButton) {
        return <div className="Footer">
            {resetButton}
            {continueButton}
            {finishButton}
        </div>
    }
    else {
        return <div className="Footer">
            {resetButton}
            {continueButton}
        </div>
    }
};

Footer.defaultProps = {
    resetText: "Reset",
    continueText: "Continue",
    isFinishButton: false
}

export default Footer;

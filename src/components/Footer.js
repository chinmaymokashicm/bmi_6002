// import PropTypes from "prop-types"

import Button from "./Button";

const Footer = ({
  continueText,
  continueOnClick,
}) => {
  const continueButton = (
    <Button text={continueText} onClick={continueOnClick} />
  );
  return (
    <div className="Footer">
      {continueButton}
    </div>
  )
};

Footer.defaultProps = {
  resetText: "Reset",
  continueText: "Continue",
  isResetPresent: true
};

export default Footer;

// import PropTypes from "prop-types"

const Button = ({ text, onClick , optional}) => {
  return <button className="button" onClick={onClick}>
      {text}
  </button>
};

Button.defaultProps = {
    text: "Button",
    // onClick: undefined,
    // optional: undefined
}

export default Button;

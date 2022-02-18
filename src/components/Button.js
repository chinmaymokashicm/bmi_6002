// import PropTypes from "prop-types"

const Button = ({ text, onClick , disabled, style}) => {
  return <button className="button" onClick={onClick} disabled={disabled} style={style}> 
      {text}
  </button>
};

Button.defaultProps = {
    text: "Button",
    disabled: false
    // onClick: undefined,
    // optional: undefined
}

export default Button;

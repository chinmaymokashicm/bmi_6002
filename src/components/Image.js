import PropTypes from "prop-types";

const Image = ({ id, src, alt, isVisible}) => {
  return (
    <div className="image-frame">
      <img key={id} src={src} alt={alt} className="image-class" style={{"display": isVisible}}/>
    </div>
  );
};

Image.defaultProps = {
  isVisible: "inline"
}

export default Image;

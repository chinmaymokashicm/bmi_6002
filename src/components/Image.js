// import PropTypes from "prop-types";

const Image = ({ id, src, alt }) => {
  return (
    <div className="image-frame">
    <img key={id} src={src} alt={alt} className="image"/>
    </div>
  )
};

export default Image;

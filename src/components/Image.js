// import PropTypes from "prop-types";

const Image = ({ id, src }) => {
  return (
    <div className="image-frame">
    <img key={id} src={src} className="image"/>
    </div>
  )
};

export default Image;

import PropTypes from "prop-types";
import { canvasConfig } from "../Variables";

const Image = ({ id, src, alt, isVisible, innerRef }) => {
  return (
    <div className="image-frame">
      <img
        key={id}
        src={src}
        alt={alt}
        className="image-class"
        style={{ display: isVisible}}
        ref={innerRef}
      />
    </div>
  );
};

Image.defaultProps = {
  isVisible: "inline",
};

export default Image;

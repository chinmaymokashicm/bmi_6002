import PropTypes from "prop-types";
import { canvasConfig } from "../Variables";

const Image = ({ id, src, alt, title, isVisible, innerRef }) => {
  return (
      <img
        key={id}
        src={src}
        alt={alt}
        title={title}
        className="image-class"
        style={{ display: isVisible}}
        ref={innerRef}
      />
  );
};

Image.defaultProps = {
  isVisible: "inline",
  title: ""
};

export default Image;

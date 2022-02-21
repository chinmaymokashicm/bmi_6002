import PropTypes from "prop-types";
import { canvasConfig } from "../Variables";

const Image = ({ id, src, alt, isVisible }) => {
  return (
    <div className="image-frame">
      <img
        key={id}
        src={src}
        alt={alt}
        className="image-class"
        style={{ display: isVisible }}
        // height={canvasConfig.height}
        // width={canvasConfig.width}
      />
    </div>
  );
};

Image.defaultProps = {
  isVisible: "inline",
};

export default Image;

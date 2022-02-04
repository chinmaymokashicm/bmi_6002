import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

import Image from "./Image";

const Carousel = ({ imageURLs }) => {
  return (
    <AliceCarousel
    >
    {imageURLs.map((imageSrc) => (
      <Image alt={imageSrc.fileName} id={imageSrc.id} src={imageSrc.objectURL} />
    ))}
  </AliceCarousel>
  );
};

export default Carousel;

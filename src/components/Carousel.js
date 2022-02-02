import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

import Image from "./Image";

const Carousel = ({ fileURLs }) => {
  return (
    <AliceCarousel
    items={2}
    >
    {fileURLs.map((imageSrc) => (
      <Image alt={imageSrc.fileName} id={imageSrc.id} src={imageSrc.objectURL} />
    ))}
  </AliceCarousel>
  );
};

export default Carousel;

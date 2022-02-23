// https://konvajs.org/docs/overview.html
// https://konvajs.org/docs/react/index.html#page-title
// https://blog.logrocket.com/canvas-manipulation-react-konva/
// https://konvajs.org/docs/react/Transformer.html

import { Stage, Layer, Rect, Circle } from "react-konva";

function KonvaStage(imageOverlayRef) {
  var width = 200
  var height = 200
  return (
    <Stage width={width} height={height}>
      <Layer>
        <Circle
          x={0}
          y={0}
          width={200}
          height={100}
          radius={50}
          fill="red"
          shadowBlur={5}
        />
      </Layer>
    </Stage>
  );
}

export default KonvaStage;

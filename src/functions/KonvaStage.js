// https://konvajs.org/docs/overview.html
// https://konvajs.org/docs/react/index.html#page-title
// https://blog.logrocket.com/canvas-manipulation-react-konva/
// https://konvajs.org/docs/react/Transformer.html

import { useRef, useState } from "react";
import { Stage, Layer, Circle, Transformer } from "react-konva";

function KonvaStage({ circleRef, width, height }) {
  // const [centerX, setCenterX] = useState(width/2)
  // const [centerY, setCenterY] = useState(height/2)


  return (
    <Stage width={width} height={height} circleRef={circleRef}>
      <Layer>
        <Circle
          x={width/2}
          y={height/2}
          radius={50}
          fill="red"
          shadowBlur={5}
          draggable={true}
          resizable={true}
          ref={circleRef}
          onClick={(e) => {
            console.log(circleRef)
            console.log(e.target.attrs.x, e.target.attrs.y)
            // setCenterX(e.target.x)
            // setCenterY(e.target.y)
          }}
          onDragMove={(e) => {
            console.log(e.target.attrs.x, e.target.attrs.y)
            // setCenterX(e.target.x)
            // setCenterY(e.target.y)
          }}
        />
      </Layer>
    </Stage>
  );
}

export default KonvaStage;

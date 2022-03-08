// https://konvajs.org/docs/overview.html
// https://konvajs.org/docs/react/index.html#page-title
// https://blog.logrocket.com/canvas-manipulation-react-konva/
// https://konvajs.org/docs/react/Transformer.html

import { Fragment, useEffect, useRef, useState } from "react";
import { Stage, Layer, Circle, Transformer } from "react-konva";
import UpdateOverlayData from "./UpdateOverlayData";

function KonvaStage({
  width,
  height,
  overlayData,
  setOverlayData,
  currentImageIndex,
  imageRef
}) {
  const circleRef = useRef();
  const transformerRef = useRef();

  var imageRefWidth = imageRef.current.width
  var imageRefHeight = imageRef.current.height
  // console.log("imageRefWidth", imageRefWidth)
  // console.log("imageRefHeight", imageRefHeight)
  console.log("imageRefWidth, width", imageRefWidth, width)
  console.log("imageRefHeight, height", imageRefHeight, height)
  var scaleWidth = imageRefWidth/width
  var scaleHeight = imageRefHeight/height
  console.log("scaleWidth, scaleHeight", scaleWidth, scaleHeight)

  try {
    if (!isNaN(overlayData.x)) {
      console.log(overlayData);
      console.log("Loading existing data!");
      width = overlayData.x * 2;
      height = overlayData.y * 2;
    }
  } catch (e) {
    console.log(e);
  }

  if (width === undefined) {
    width = 200;
  }
  if (height === undefined) {
    height = 100;
  }

  function onChange(e) {
    var attributes = e.target.attrs;
    const node = circleRef.current;
    const scaleX = node.scaleX();
    var overlayDataObj = {
      x: (Math.round(attributes.x/scaleWidth)),
      y: (Math.round(attributes.y/scaleHeight)),
      radius: (Math.round(attributes.radius * scaleX/scaleWidth)),
    };
    node.scaleX(1);
    node.scaleY(1);
    console.log(overlayDataObj);
    UpdateOverlayData(
      overlayData,
      setOverlayData,
      overlayDataObj,
      currentImageIndex
    );
  }

  return (
    <Fragment>
      <Stage
        width={imageRefWidth}
        height={imageRefHeight}
        onMouseDown={(e) => {
          transformerRef.current.nodes([circleRef.current]);
          transformerRef.current.getLayer().batchDraw();
        }}
      >
        <Layer>
          <Circle
            x={Math.round(overlayData[currentImageIndex].x * scaleWidth)}
            y={Math.round(overlayData[currentImageIndex].y * scaleHeight)}
            radius={Math.round(overlayData[currentImageIndex].radius * scaleWidth)} //How should the radius be scaled? scaleWidth = scaleHeight
            fill="rgba(166, 109, 86, 0.1)"
            stroke="red"
            strokeWidth={5}
            shadowBlur={5}
            draggable={true}
            resizable={true}
            ref={circleRef}
            onClick={onChange}
            onDragStart={onChange}
            onDragEnd={onChange}
            onDragMove={onChange}
            onTransformEnd={onChange}
          />
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              // limit resize
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
            enabledAnchors={[
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
            ]}
            resizeEnabled={true}
            rotateEnabled={false}
          />
          <Circle
            x={Math.round(overlayData[currentImageIndex].x * scaleWidth)}
            y={Math.round(overlayData[currentImageIndex].y * scaleHeight)}
            radius={Math.round(overlayData[currentImageIndex].radius * scaleWidth * 0.5)} //How should the radius be scaled? scaleWidth = scaleHeight
            fill="rgba(166, 109, 86, 0.1)"
            stroke="yellow"
            strokeWidth={5}
            zIndex={0}
          />
        </Layer>
      </Stage>
    </Fragment>
  );
}

export default KonvaStage;

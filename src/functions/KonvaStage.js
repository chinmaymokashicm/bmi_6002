// https://konvajs.org/docs/overview.html
// https://konvajs.org/docs/react/index.html#page-title
// https://blog.logrocket.com/canvas-manipulation-react-konva/
// https://konvajs.org/docs/react/Transformer.html
// https://stackoverflow.com/questions/46557532/using-image-mask-with-globalcompositeoperation-on-konvajs

import clone from "just-clone";
import { Fragment, useEffect, useRef, useState } from "react";
import { Stage, Layer, Circle, Transformer, Arc } from "react-konva";
import DataURLtoBlob from "./DataURLToBlob";
import UpdateOverlayData from "./UpdateOverlayData";

function KonvaStage({
  width,
  height,
  overlayData,
  setOverlayData,
  currentImageIndex,
  imageRef,
  overlayURLs,
  setOverlayURLs,
  stackImageURLs,
  stackCounter,
  imageDimensions,
}) {
  const transformerRef = useRef();
  const stageRef = useRef();

  const innerCircleRef = useRef();
  const arcIN = useRef();
  const arcII = useRef();
  const arcIT = useRef();
  const arcIS = useRef();
  var percentInner = 0.4;

  var imageRefWidth = imageRef.current.width;
  var imageRefHeight = imageRef.current.height;
  var scaleWidth = imageRefWidth / width;
  var scaleHeight = imageRefHeight / height;

  var fillInner = "rgba(66, 191, 245, 1)";
  var fillIN = "rgba(66, 191, 245, 1)";
  var fillII = "rgba(66, 191, 245, 1)";
  var fillIT = "rgba(66, 191, 245, 1)";
  var fillIS = "rgba(66, 191, 245, 1)";

  var x = Math.round(overlayData[currentImageIndex].x * scaleWidth);
  var y = Math.round(overlayData[currentImageIndex].y * scaleHeight);
  var radiusInner = Math.round(
    overlayData[currentImageIndex].radius * percentInner * scaleWidth
  );
  var radiusOuter = Math.round(
    overlayData[currentImageIndex].radius * scaleWidth
  );

  var refArray = [
    [0, "innerCircle", innerCircleRef, 0, 0],
    [1, "IN", arcIN, 0, 0],
    [2, "II", arcII, 0, 0],
    [3, "IT", arcIT, 0, 0],
    [4, "IS", arcIS, 0, 0],
  ];

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

  function extractPixels(counter, currentOverlayURLs, refArray, attributes) {
    try {
      var subRefArray = refArray[counter];
      let mask = new Image();
      mask.src = URL.createObjectURL(
        DataURLtoBlob(subRefArray[2].current.toDataURL())
      );
      mask.onload = function () {
        if(subRefArray[1] == "II"){
          var offsetX = - mask.width/2
          var offsetY = 0
        }
        else if(subRefArray[1] === "IN"){
          var offsetX = 0
          var offsetY = - mask.height/2
        }
        else if(subRefArray[1] === "IT"){
          var offsetX = - mask.width
          var offsetY = - mask.height/2
        }
        else if(subRefArray[1] === "IS"){
          var offsetX = - mask.width/2
          var offsetY = - mask.height
        }
        else if (subRefArray[1] === "innerCircle"){
          var offsetX = - mask.width/2
          var offsetY = - mask.height/2
        }
        let img = new Image();
        img.src = imageRef.current.src;
        img.onload = function () {
          console.log(counter, subRefArray[1], mask.width, mask.height)
          var canvas = document.createElement("canvas");
          var ctx = canvas.getContext("2d", { csolorSpace: "display-p3" });
          ctx.drawImage(
            mask,
            0,
            0,
            mask.width,
            mask.height,
            0,
            0,
            mask.width,
            mask.height
          );
          ctx.globalCompositeOperation = "source-in";

          ctx.drawImage(
            img,
            (attributes.x + offsetX)/scaleWidth,
            (attributes.y + offsetY)/scaleHeight,
            mask.width / scaleWidth,
            mask.height / scaleHeight,
            0,
            0,
            mask.width,
            mask.height
          );
          console.log(counter, mask.width, mask.height, subRefArray[2].current.attrs, attributes)
          ctx.restore();
          // canvas.toDataURL();
          currentOverlayURLs[subRefArray[1]] = canvas.toDataURL();
          extractPixels(counter + 1, currentOverlayURLs, refArray, attributes);
          return;
        };
      };
    } catch (e) {
      var tempOverlayURLs = clone(overlayURLs);
      tempOverlayURLs[currentImageIndex] = currentOverlayURLs;
      // console.log(attributes);
      setOverlayURLs(tempOverlayURLs);
      return;
    }
  }

  function onChange(e) {
    var attributes = e.target.attrs;
    const node = innerCircleRef.current;
    const scaleX = node.scaleX();
    var overlayDataObj = {
      x: Math.round(attributes.x / scaleWidth),
      y: Math.round(attributes.y / scaleHeight),
      radius: Math.round(
        (attributes.radius * scaleX) / (scaleWidth * percentInner)
      ),
    };
    node.scaleX(1);
    node.scaleY(1);
    UpdateOverlayData(
      overlayData,
      setOverlayData,
      overlayDataObj,
      currentImageIndex
    );
    var currentOverlayURLs = clone(overlayURLs)[currentImageIndex];
    extractPixels(0, currentOverlayURLs, refArray, attributes);
  }

  return (
    <Fragment>
      <Stage
        width={imageRefWidth}
        height={imageRefHeight}
        onMouseDown={(e) => {
          if (e.target.className !== undefined) {
            transformerRef.current.nodes([
              innerCircleRef.current,
              arcIN.current,
              arcII.current,
              arcIT.current,
              arcIS.current,
            ]);
            transformerRef.current.getLayer().batchDraw();
          } else {
            transformerRef.current.nodes([]);
          }
        }}
        ref={stageRef}
      >
        <Layer>
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
            x={x}
            y={y}
            radius={radiusInner} //How should the radius be scaled? scaleWidth = scaleHeight
            fill={fillInner}
            shadowBlur={5}
            draggable={true}
            resizable={true}
            ref={innerCircleRef}
            onClick={onChange}
            onDragStart={onChange}
            onDragEnd={onChange}
            onDragMove={onChange}
            onTransformEnd={onChange}
          />
          <Arc
            x={x}
            y={y}
            innerRadius={radiusInner}
            outerRadius={radiusOuter}
            angle={90}
            fill={fillIN}
            stroke="red"
            strokeWidth={1}
            rotation={315}
            ref={arcIN}
          />
          <Arc
            x={x}
            y={y}
            innerRadius={radiusInner}
            outerRadius={radiusOuter}
            angle={90}
            fill={fillII}
            stroke="red"
            strokeWidth={1}
            rotation={45}
            ref={arcII}
          />
          <Arc
            x={x}
            y={y}
            innerRadius={radiusInner}
            outerRadius={radiusOuter}
            angle={90}
            fill={fillIT}
            stroke="red"
            strokeWidth={1}
            rotation={135}
            ref={arcIT}
          />
          <Arc
            x={x}
            y={y}
            innerRadius={radiusInner}
            outerRadius={radiusOuter}
            angle={90}
            fill={fillIS}
            stroke="red"
            strokeWidth={1}
            rotation={225}
            ref={arcIS}
          />
        </Layer>
      </Stage>
    </Fragment>
  );
}

export default KonvaStage;

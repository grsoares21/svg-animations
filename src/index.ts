import TWEEN from '@tweenjs/tween.js';
import * as d3 from 'd3';

const w = 500;
const h = 500;
const padding = 30;

const xDomain = 10;
const pointNum = 500;

let svg = d3.select("#svg");

let xScale = d3.scaleLinear([-10, xDomain], [padding, w - padding]);
let yScale = d3.scaleLinear([5, -5], [padding, h - padding]);

// Clip path
let clipPath = svg
  .append("clipPath")
  .attr("id", "chart-area")
  .append("rect")
  .attr("x", padding)
  .attr("y", padding)
  .attr("width", w - 2 * padding)
  .attr("height", h - 2 * padding);

let xTemp, yTemp;

// Generate points of `y = log(x)`
let datasetFunc = [];

const applyFunc = (x) => {
  return -(x ** 2) / 8 + 4;
  //Math.sin(x);
  //-(x ** 2) / 8 + 4;
  // (x ** 2) = 72
};

for (let i = -pointNum; i <= pointNum; i++) {
  xTemp = (xDomain / pointNum) * i;
  yTemp = applyFunc(xTemp);
  if (i == 0) {
  } else {
    datasetFunc.push([xTemp, yTemp]);
  }
}

let lineFunc = d3
  .line()
  .x((d) => xScale(d[0]))
  .y((d) => yScale(d[1]));
// .curve(d3.curveNatural) // Note this!

svg
  .append("path")
  .datum(datasetFunc)
  .attr("clip-path", "url(#chart-area)")
  .attr("fill", "none")
  .attr("stroke", "black")
  .attr("stroke-width", 3)
  .attr("d", lineFunc);

let first = -2;
let second = 8;

const pointsX = {
  first,
  second,
};

let x1 = xScale(pointsX.first);
let x2 = xScale(pointsX.second);
let y1 = yScale(applyFunc(pointsX.first));
let y2 = yScale(applyFunc(pointsX.second));

let angle = (Math.atan((x2 - x1) / (y2 - y1)) * 180) / Math.PI;

let xMiddle = (x1 + x2) / 2;
let yMiddle = (y1 + y2) / 2;

const firstPoint = svg.append("circle").attr("cx", x1).attr("cy", y1).attr("r", 4);
const secondPoint = svg.append("circle").attr("cx", x2).attr("cy", y2).attr("r", 4);

const line = svg
  .append("line")
  .attr("x1", xMiddle - 500)
  .attr("x2", xMiddle + 500)
  .attr("y1", yMiddle)
  .attr("y2", yMiddle)
  .attr("transform", `translate(${xMiddle} ${yMiddle}) rotate(${90 - angle}) translate(${-xMiddle} ${-yMiddle})`)
  .attr("stroke", "black")
  .attr("stroke-width", 3);

let rectWidth = 25;
let rectSize = { rectWidth };

let minRectX = -10;
let maxRectX = 10;

let currentRects = [];

svg
  .append("line")
  .attr("x1", 0)
  .attr("x2", 500)
  .attr("y1", yScale(0))
  .attr("y2", yScale(0))
  .attr("stroke", "black")
  .attr("stroke-width", "3");

const updateIntegralRects = () => {
  for (let rectFirstX = minRectX; rectFirstX <= maxRectX; rectFirstX += rectSize.rectWidth) {
    const y = applyFunc(rectFirstX);

    let rect = svg
      .append("rect")
      .attr("x", xScale(rectFirstX))
      .attr("y", yScale(y >= 0 ? y : 0))
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 3)
      .attr("height", Math.abs(yScale(Math.abs(y)) - yScale(0)))
      .attr("width", xScale(rectFirstX + rectSize.rectWidth) - xScale(rectFirstX));

    currentRects.push(rect);
  }
};

updateIntegralRects();

function animate(time) {
  requestAnimationFrame(animate);
  TWEEN.update(time);
}

requestAnimationFrame(animate);

var derivativeTween = new TWEEN.Tween(pointsX) // Create a new tween that modifies 'coords'.
  .to({ first: 2.999, second: 3.0001 }, 15000) // Move to (300, 200) in 1 second.
  .easing(TWEEN.Easing.Linear.None) // Use an easing function to make the animation smooth.
  .onUpdate(() => {
    x1 = xScale(pointsX.first);
    x2 = xScale(pointsX.second);
    y1 = yScale(applyFunc(pointsX.first));
    y2 = yScale(applyFunc(pointsX.second));

    angle = (Math.atan((x2 - x1) / (y2 - y1)) * 180) / Math.PI;

    xMiddle = (x1 + x2) / 2;
    yMiddle = (y1 + y2) / 2;

    firstPoint.attr("cx", x1).attr("cy", y1);
    secondPoint.attr("cx", x2).attr("cy", y2);

    line
      .attr("x1", xMiddle - 500)
      .attr("x2", xMiddle + 500)
      .attr("y1", yMiddle)
      .attr("y2", yMiddle)
      .attr("transform", `translate(${xMiddle} ${yMiddle}) rotate(${90 - angle}) translate(${-xMiddle} ${-yMiddle})`);
  });

var integralTween = new TWEEN.Tween(rectSize) // Create a new tween that modifies 'coords'.
  .to({ rectWidth: 0.15 }, 15000) // Move to (300, 200) in 1 second.
  .easing(TWEEN.Easing.Quintic.Out) // Use an easing function to make the animation smooth.
  .onUpdate(() => {
    currentRects.forEach((rect) => rect.remove());
    currentRects = [];

    updateIntegralRects();
  });

export function startAnimation() {
  derivativeTween.start();
  integralTween.start();
}

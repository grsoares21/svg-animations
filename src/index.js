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
  return -(x ** 2) / 10 + 4;
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

let first = -5;
let second = 0;

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
//const middlePoint = svg.append("circle").attr("cx", xMiddle).attr("cy", yMiddle).attr("r", 4).attr("fill", "red");

const line = svg
  .append("line")
  .attr("x1", xMiddle - 500)
  .attr("x2", xMiddle + 500)
  .attr("y1", yMiddle)
  .attr("y2", yMiddle)
  .attr("transform", `translate(${xMiddle} ${yMiddle}) rotate(${angle}) translate(${-xMiddle} ${-yMiddle})`)
  .attr("stroke", "black")
  .attr("stroke-width", 3);

function animate(time) {
  requestAnimationFrame(animate);
  TWEEN.update(time);
}

requestAnimationFrame(animate);

var tween = new TWEEN.Tween(pointsX) // Create a new tween that modifies 'coords'.
  .to({ first: 5.4999, second: 5.5001 }, 1000) // Move to (300, 200) in 1 second.
  .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
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

    //middlePoint.attr("cx", xMiddle).attr("cy", yMiddle);

    line
      .attr("x1", xMiddle - 500)
      .attr("x2", xMiddle + 500)
      .attr("y1", yMiddle)
      .attr("y2", yMiddle)
      .attr("transform", `translate(${xMiddle} ${yMiddle}) rotate(${angle}) translate(${-xMiddle} ${-yMiddle})`);
  });

function startAnimation() {
  tween.start();
}

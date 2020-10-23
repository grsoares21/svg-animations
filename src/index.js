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

const firstPoint = svg
  .append("circle")
  .attr("cx", xScale(pointsX.first))
  .attr("cy", yScale(applyFunc(pointsX.first)))
  .attr("r", 4);

const secondPoint = svg
  .append("circle")
  .attr("cx", xScale(pointsX.second))
  .attr("cy", yScale(applyFunc(pointsX.second)))
  .attr("r", 4);

function animate(time) {
  requestAnimationFrame(animate);
  TWEEN.update(time);
}
requestAnimationFrame(animate);

var tween = new TWEEN.Tween(pointsX) // Create a new tween that modifies 'coords'.
  .to({ first: -2.5, second: -2.5 }, 1000) // Move to (300, 200) in 1 second.
  .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
  .onUpdate(() => {
    firstPoint.attr("cx", xScale(pointsX.first)).attr("cy", yScale(applyFunc(pointsX.first)));

    secondPoint.attr("cx", xScale(pointsX.second)).attr("cy", yScale(applyFunc(pointsX.second)));
  });

function startAnimation() {
  tween.start();
}

import * as d3 from "d3";
import TWEEN, { Tween } from "@tweenjs/tween.js";

export default class DerivativeAnimation {
  private xScale: d3.ScaleLinear<number, number>;
  private yScale: d3.ScaleLinear<number, number>;

  private interpolationObject: { firstPointX: number, secondPointX: number };
  private animationTween: Tween<{ firstPointX: number, secondPointX: number }>;

  private target: d3.Selection<SVGElement & HTMLElement, any, any, any>;

  private derivativeLine: d3.Selection<SVGLineElement, any, any, any>;
  private firstPoint: d3.Selection<SVGCircleElement, any, any, any>;
  private secondPoint: d3.Selection<SVGCircleElement, any, any, any>;

  constructor(
    private mathFunction: (number) => number,
    private xDomain: [number, number],
    yDomain: [number, number],
    targetPointsX: number,
    startingPointsXs: [number, number],
    targetElement: SVGElement & HTMLElement,
    duration: number,
    private pointsNum: number = 500,
    easingFunction: (number) => number = TWEEN.Easing.Linear.None
  ) {
    const targetWidth = targetElement.getBoundingClientRect().width;
    const targetHeight = targetElement.getBoundingClientRect().height;

    this.xScale = d3.scaleLinear(xDomain, [0, targetWidth]);
    this.yScale = d3.scaleLinear(yDomain, [0, targetHeight]);
    this.interpolationObject = { firstPointX: startingPointsXs[0], secondPointX: startingPointsXs[1] };
    this.target = d3.select(targetElement);

    this.drawFunction();

    const minPointsDistance = Math.abs(xDomain[1] - xDomain[0]) / targetWidth;
    // distance in the domain that corresponds to 1px in the svg

    this.animationTween = new TWEEN.Tween(this.interpolationObject)
      .to({ firstPointX: targetPointsX, secondPointX: targetPointsX + minPointsDistance }, duration)
      .easing(easingFunction)
      .onUpdate(() => this.drawFrame());
  }

  private drawFunction() {
    const dataset: [number, number][] = [];

    for (let i = -this.pointsNum; i <= this.pointsNum; i++) {
      let xTemp = (this.xDomain[1] / this.pointsNum) * i;
      let yTemp = this.mathFunction(xTemp);

      dataset.push([xTemp, yTemp]);
    }

    let line = d3
      .line()
      .x((d) => this.xScale(d[0]))
      .y((d) => this.yScale(d[1]));

    this.target
      .append("path")
      .datum(dataset)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 3)
      .attr("d", line);
  }

  private drawFrame() {
    const {
      interpolationObject: { firstPointX, secondPointX },
      mathFunction,
      xScale, yScale, target, firstPoint, secondPoint, derivativeLine
    } = this;

    let x1 = xScale(firstPointX);
    let x2 = xScale(secondPointX);
    let y1 = yScale(mathFunction(firstPointX));
    let y2 = yScale(mathFunction(secondPointX));

    let angle = (Math.atan((x2 - x1) / (y2 - y1)) * 180) / Math.PI;

    let xMiddle = (x1 + x2) / 2;
    let yMiddle = (y1 + y2) / 2;

    if (!firstPoint) this.firstPoint = target.append("circle").attr("r", 4);
    if (!secondPoint) this.secondPoint = target.append("circle").attr("r", 4);
    if (!derivativeLine) this.derivativeLine = target.append("line").attr("stroke", "black").attr("stroke-width", 3);

    firstPoint.attr("cx", x1).attr("cy", y1);
    secondPoint.attr("cx", x2).attr("cy", y2);

    derivativeLine
      .attr("x1", xMiddle - 500)
      .attr("x2", xMiddle + 500)
      .attr("y1", yMiddle)
      .attr("y2", yMiddle)
      .attr("transform", `translate(${xMiddle} ${yMiddle}) rotate(${90 - angle}) translate(${-xMiddle} ${-yMiddle})`);
  }

  public start() {
    this.animationTween.start();
  }
}
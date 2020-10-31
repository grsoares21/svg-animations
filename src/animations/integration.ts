import * as d3 from "d3";
import TWEEN, { Tween } from "@tweenjs/tween.js";

export default class IntegrationAnimation {
  private xScale: d3.ScaleLinear<number, number>;
  private yScale: d3.ScaleLinear<number, number>;

  private interpolationObject: { rectWidth: number };
  private animationTween: Tween<{ rectWidth: number }>;

  private target: d3.Selection<SVGElement & HTMLElement, any, any, any>;
  private currentRects: d3.Selection<SVGRectElement, any, any, any>[] = [];

  constructor(
    private mathFunction: (number) => number,
    private xDomain: [number, number],
    yDomain: [number, number],
    initialRectangleWidth: number,
    targetElement: SVGElement & HTMLElement,
    duration: number,
    private pointsNum: number = 500,
    easingFunction: (number) => number = TWEEN.Easing.Quintic.Out
  ) {
    const targetWidth = targetElement.getBoundingClientRect().width;
    const targetHeight = targetElement.getBoundingClientRect().height;

    this.xScale = d3.scaleLinear(xDomain, [0, targetWidth]);
    this.yScale = d3.scaleLinear(yDomain, [0, targetHeight]);
    this.interpolationObject = { rectWidth: initialRectangleWidth };
    this.target = d3.select(targetElement);

    this.drawFunction();

    const minRectWidth = Math.abs(xDomain[1] - xDomain[0]) / targetWidth;
    // width in the domain that corresponds to 1px in the svg

    this.animationTween = new TWEEN.Tween(this.interpolationObject)
      .to({ rectWidth: minRectWidth }, duration)
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
    const { xDomain, mathFunction, target, xScale, yScale, interpolationObject } = this;

    this.currentRects.forEach((rect) => rect.remove());
    this.currentRects = [];

    for (let rectX = xDomain[0]; rectX <= xDomain[1]; rectX += interpolationObject.rectWidth) {
      const y = mathFunction(rectX);

      let rect = target
        .append("rect")
        .attr("x", xScale(rectX))
        .attr("y", yScale(y >= 0 ? y : 0))
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 3)
        .attr("height", Math.abs(yScale(Math.abs(y)) - yScale(0)))
        .attr("width", xScale(rectX + interpolationObject.rectWidth) - xScale(rectX));

      this.currentRects.push(rect);
    }
  }

  public start() {
    this.animationTween.start();
  }
}
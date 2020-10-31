import TWEEN from '@tweenjs/tween.js';
import * as d3 from 'd3';
import IntegrationAnimation from './animations/integration';
import DerivativeAnimation from './animations/derivative';

let datasetFunc = [];

const func = (x) => {
  return -(x ** 2) / 8 + 4;
  //Math.sin(x);
  //-(x ** 2) / 8 + 4;
};

function animate(time) {
  requestAnimationFrame(animate);
  TWEEN.update(time);
}

requestAnimationFrame(animate);

const integrationAnimation = new IntegrationAnimation(
  func,
  [-10, 10],
  [10, -10],
  10,
  document.getElementById('integration') as SVGElement & HTMLElement,
  10000
);

const derivativeAnimation = new DerivativeAnimation(
  func,
  [-10, 10],
  [10, -10],
  1,
  [-3, 5],
  document.getElementById('derivative') as SVGElement & HTMLElement,
  2000
)

export function startAnimation() {
  integrationAnimation.start();
  derivativeAnimation.start();
}
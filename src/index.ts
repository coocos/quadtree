import { insert, construct } from "./quadtree";
import { draw, initializeCanvas } from "./canvas";

const { canvas, context } = initializeCanvas();

const points = Array.from({ length: 256 }, () => {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
  };
});

let tree = construct(points, {
  x: 0,
  y: 0,
  width: canvas.width,
  height: canvas.height,
});

draw(tree, context);
canvas.addEventListener("click", (event) => {
  const { left, top } = canvas.getBoundingClientRect();
  const point = {
    x: event.clientX - left,
    y: event.clientY - top,
  };
  tree = insert(tree, point);
  draw(tree, context);
});

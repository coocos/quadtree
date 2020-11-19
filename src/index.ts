import { insert, construct, pointsWithinArea } from "./quadtree";
import { initializeCanvas } from "./canvas";

const canvas = initializeCanvas();

const points = Array.from({ length: 384 }, () => {
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

canvas.draw(tree);
canvas.element.addEventListener("click", (event) => {
  const point = {
    x: event.clientX,
    y: event.clientY,
  };
  tree = insert(tree, point);
  canvas.draw(tree);
});

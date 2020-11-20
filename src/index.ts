import { insert, construct } from "./quadtree";
import { initializeCanvas } from "./canvas";

const canvas = initializeCanvas();

const randomPoint = () => {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
  };
};

const points = Array.from({ length: 256 }, randomPoint);
let tree = construct(points, {
  x: 0,
  y: 0,
  width: canvas.width,
  height: canvas.height,
});

canvas.draw(tree);
setInterval(() => {
  tree = insert(tree, randomPoint());
  canvas.draw(tree);
}, 250);

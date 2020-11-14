import { construct, nodes } from "./quadtree";
import { clearCanvas, initializeCanvas, drawNode, drawPoints } from "./canvas";

const { canvas, context } = initializeCanvas();
clearCanvas(context);

const points = [];
while (points.length < 1024) {
  points.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
  });
}

const tree = construct(points, {
  x: 0,
  y: 0,
  width: canvas.width,
  height: canvas.height,
});
for (let node of nodes(tree)) {
  drawNode(context, node);
  drawPoints(context, node);
}

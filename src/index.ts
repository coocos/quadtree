import { Node } from "./quadtree";

function initializeCanvas() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const scale = window.devicePixelRatio;
  canvas.width = window.innerWidth * scale;
  canvas.height = window.innerHeight * scale;
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;
  context.scale(scale, scale);
  return {
    canvas,
    context,
  };
}

function drawNode(context: CanvasRenderingContext2D, node: Node) {
  context.strokeStyle = "#fff";
  context.beginPath();
  context.rect(node.box.x, node.box.y, node.box.width, node.box.height);
  context.stroke();
}

const { canvas, context } = initializeCanvas();
context.fillStyle = "#000";
context.fillRect(0, 0, window.innerWidth, window.innerHeight);

const root = {
  box: {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
  },
};
drawNode(context, root);

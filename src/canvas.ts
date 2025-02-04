import { nodes, isLeaf, Node } from "./quadtree";

export function initializeCanvas() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const scale = window.devicePixelRatio;
  canvas.width = Math.floor(window.innerWidth * scale);
  canvas.height = Math.floor(window.innerHeight * scale);
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;
  context.scale(scale, scale);

  return {
    draw: (tree: Node) => {
      clear(context, canvas.width, canvas.height);
      for (const node of nodes(tree)) {
        drawNode(context, node);
        drawPoints(context, node);
      }
    },
    width: canvas.width / scale,
    height: canvas.height / scale,
    element: canvas,
  };
}

function clear(
  context: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  context.fillStyle = "#fff";
  context.fillRect(0, 0, width, height);
}

function drawNode(context: CanvasRenderingContext2D, node: Node) {
  context.fillStyle = "#7772";
  context.fillRect(node.box.x, node.box.y, node.box.width, node.box.height);
  context.beginPath();
  context.strokeStyle = "#777";
  context.rect(node.box.x, node.box.y, node.box.width, node.box.height);
  context.stroke();
}

function drawPoints(context: CanvasRenderingContext2D, node: Node) {
  if (isLeaf(node)) {
    for (const point of node.points) {
      context.fillStyle = "#777";
      context.beginPath();
      context.arc(point.x, point.y, 3, 0, 2 * Math.PI);
      context.fill();
    }
  }
}

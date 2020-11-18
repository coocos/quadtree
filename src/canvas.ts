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
      for (let node of nodes(tree)) {
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
  context.fillStyle = "#eee";
  context.fillRect(0, 0, width, height);
}

function drawNode(context: CanvasRenderingContext2D, node: Node) {
  context.strokeStyle = "#aaa";
  context.beginPath();
  context.rect(node.box.x, node.box.y, node.box.width, node.box.height);
  context.stroke();
}

function drawPoints(context: CanvasRenderingContext2D, node: Node) {
  if (isLeaf(node)) {
    for (let point of node.points) {
      context.fillStyle = "#bbb";
      context.beginPath();
      context.arc(point.x, point.y, 3, 0, 2 * Math.PI);
      context.fill();
    }
  }
}

import { Vector } from "./vector";

type BoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Node = {
  children?: {
    topLeft: Node;
    topRight: Node;
    bottomLeft: Node;
    bottomRight: Node;
  };
  box: BoundingBox;
  points?: Array<Vector>;
};

export function construct(points: Array<Vector>, box: BoundingBox): Node {
  const root = {
    box,
  };
  for (let point of points) {
    insert(root, point);
  }
  return root;
}
const BUCKET_SIZE = 4;

function intersects(node: Node, point: Vector) {
  return (
    point.x <= node.box.x + node.box.width &&
    point.x >= node.box.x &&
    point.y <= node.box.y + node.box.height &&
    point.y >= node.box.y
  );
}

export function split(node: Node) {
  const childWidth = node.box.width / 2;
  const childHeight = node.box.height / 2;
  const dimensions = {
    width: childWidth,
    height: childHeight,
  };
  return {
    topLeft: {
      box: {
        x: node.box.x,
        y: node.box.y,
        ...dimensions,
      },
    },
    topRight: {
      box: {
        x: node.box.x + childWidth,
        y: node.box.y,
        ...dimensions,
      },
    },
    bottomLeft: {
      box: {
        x: node.box.x,
        y: node.box.y + childHeight,
        ...dimensions,
      },
    },
    bottomRight: {
      box: {
        x: node.box.x + childWidth,
        y: node.box.y + childHeight,
        ...dimensions,
      },
    },
  };
}

export function insert(node: Node, point: Vector) {
  if (node.points !== undefined) {
    if (node.points.length < BUCKET_SIZE) {
      node.points.push(point);
    } else {
      node.children = split(node);
      for (let nodePoint of [...node.points, point]) {
        for (let child of Object.values(node.children)) {
          if (intersects(child, nodePoint)) {
            insert(child, nodePoint);
          }
        }
      }
      node.points = undefined;
    }
  } else {
    node.points = [point];
  }
}

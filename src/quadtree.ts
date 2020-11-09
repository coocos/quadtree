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
  points?: Vector[];
};

export function construct(points: Vector[], box: BoundingBox): Node {
  const root = {
    box,
    points: [],
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
      points: [],
    },
    topRight: {
      box: {
        x: node.box.x + childWidth,
        y: node.box.y,
        ...dimensions,
      },
      points: [],
    },
    bottomLeft: {
      box: {
        x: node.box.x,
        y: node.box.y + childHeight,
        ...dimensions,
      },
      points: [],
    },
    bottomRight: {
      box: {
        x: node.box.x + childWidth,
        y: node.box.y + childHeight,
        ...dimensions,
      },
      points: [],
    },
  };
}

// FIXME: You should really use *[Symbol.Iterator somehow]?
export function nodes(node: Node) {
  const queue = [node];
  const nodes = [];
  while (queue.length > 0) {
    const node = queue.shift()!;
    nodes.push(node);
    if (node.children) {
      for (let child of Object.values(node.children)) {
        queue.push(child);
      }
    }
  }
  return nodes;
}

function isLeaf(node: Node) {
  return node.children === undefined && node.points !== undefined;
}

export function insert(node: Node, point: Vector) {
  if (isLeaf(node)) {
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
      console.error("Leaf should always have points");
    }
  } else {
    if (node.children) {
      for (let child of Object.values(node.children)) {
        if (intersects(child, point)) {
          insert(child, point);
        }
      }
    } else {
      console.error("Non-leaf should always have children");
    }
  }
}

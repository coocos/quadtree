export type Point = {
  x: number;
  y: number;
};

type Area = Point & {
  radius: number;
};

type BoundingBox = Point & {
  width: number;
  height: number;
};

type Leaf = {
  box: BoundingBox;
  points: Point[];
};

type Inner = {
  box: BoundingBox;
  children: {
    topLeft: Node;
    topRight: Node;
    bottomLeft: Node;
    bottomRight: Node;
  };
};

export type Node = Leaf | Inner;

export function construct(
  points: Point[],
  box: BoundingBox,
  bucketSize: number = 4
): Node {
  let root: Node = {
    box,
    points: [],
  };
  for (let point of points) {
    root = insert(root, point, bucketSize);
  }
  return root;
}
export function insert(node: Node, point: Point, bucketSize: number = 4): Node {
  if (isLeaf(node)) {
    if (node.points.length < bucketSize) {
      node.points.push(point);
      return node;
    }
    const inner: Inner = {
      box: node.box,
      children: split(node),
    };
    for (let nodePoint of [...node.points, point]) {
      for (let [name, child] of Object.entries(inner.children)) {
        if (intersects(child, nodePoint)) {
          inner.children[name as keyof Inner["children"]] = insert(
            child,
            nodePoint
          );
        }
      }
    }
    return inner;
  } else {
    for (let [name, child] of Object.entries(node.children)) {
      if (intersects(child, point)) {
        node.children[name as keyof Inner["children"]] = insert(child, point);
      }
    }
    return node;
  }
}

export function pointsWithinArea(node: Node, area: Area) {
  if (isLeaf(node)) {
    return node.points.filter((point) => pointWithinArea(point, area));
  }
  let points: Point[] = [];
  for (let child of Object.values(node.children)) {
    if (boxWithinArea(child.box, area)) {
      points = [...points, ...pointsWithinArea(child, area)];
    }
  }
  return points;
}

export function nodes(node: Node) {
  const queue = [node];
  const nodes = [];
  while (queue.length > 0) {
    const node = queue.shift()!;
    nodes.push(node);
    if (!isLeaf(node)) {
      for (let child of Object.values(node.children)) {
        queue.push(child);
      }
    }
  }
  return nodes;
}

export function isLeaf(node: Node): node is Leaf {
  return "points" in node;
}

function intersects(node: Node, point: Point) {
  return (
    point.x <= node.box.x + node.box.width &&
    point.x >= node.box.x &&
    point.y <= node.box.y + node.box.height &&
    point.y >= node.box.y
  );
}

function split(node: Leaf) {
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

export function boxWithinArea(box: BoundingBox, area: Area) {
  const closestX = Math.max(box.x, Math.min(area.x, box.x + box.width));
  const closestY = Math.max(box.y, Math.min(area.y, box.y + box.height));
  const distanceSquared = (area.x - closestX) ** 2 + (area.y - closestY) ** 2;
  return distanceSquared < area.radius ** 2;
}

export function pointWithinArea(point: Point, area: Area) {
  const distanceSquared = (point.x - area.x) ** 2 + (point.y - area.y) ** 2;
  return distanceSquared < area.radius ** 2;
}

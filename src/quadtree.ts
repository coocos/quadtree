const BUCKET_SIZE = 4;

type Point = {
  x: number;
  y: number;
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

type Node = Leaf | Inner;

export function construct(points: Point[], box: BoundingBox): Node {
  let root: Node = {
    box,
    points: [],
  };
  for (let point of points) {
    root = insert(root, point);
  }
  return root;
}

function insert(node: Node, point: Point): Node {
  if (isLeaf(node)) {
    if (node.points.length < BUCKET_SIZE) {
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

function isLeaf(node: Node): node is Leaf {
  return "points" in node;
}

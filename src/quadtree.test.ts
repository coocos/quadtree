import {
  construct,
  boxWithinArea,
  pointWithinArea,
  pointsWithinArea,
  Point,
} from "./quadtree";

describe("Quadtree", () => {
  test("construct a flat tree", () => {
    const points = [
      {
        x: 0,
        y: 0,
      },
      {
        x: 1,
        y: 0,
      },
      {
        x: 0,
        y: 1,
      },
      {
        x: 1,
        y: 1,
      },
    ];
    const root = construct(points, {
      x: 0,
      y: 0,
      width: 1,
      height: 1,
    });
    if ("children" in root) {
      fail("Flat tree root node should be a leaf");
    }
    expect(root.points).not.toEqual(undefined);
    expect(root.points).toEqual(points);
  });
  test("construct a two level deep tree", () => {
    const points = [
      {
        x: 0,
        y: 0,
      },
      {
        x: 1,
        y: 0,
      },
      {
        x: 0,
        y: 1,
      },
      {
        x: 0.9,
        y: 0.9,
      },
      {
        x: 1,
        y: 1,
      },
    ];
    const root = construct(points, {
      x: 0,
      y: 0,
      width: 1,
      height: 1,
    });
    if ("points" in root) {
      fail("Two-level tree root should not be a leaf");
    }
    expect(root.children.topLeft).toEqual({
      box: {
        x: 0,
        y: 0,
        width: 0.5,
        height: 0.5,
      },
      points: [points[0]],
    });
    expect(root.children.topRight).toEqual({
      box: {
        x: 0.5,
        y: 0.0,
        width: 0.5,
        height: 0.5,
      },
      points: [points[1]],
    });
    expect(root.children.bottomLeft).toEqual({
      box: {
        x: 0.0,
        y: 0.5,
        width: 0.5,
        height: 0.5,
      },
      points: [points[2]],
    });
    expect(root.children.bottomRight).toEqual({
      box: {
        x: 0.5,
        y: 0.5,
        width: 0.5,
        height: 0.5,
      },
      points: [points[3], points[4]],
    });
  });
  test("find points within an area using the tree", () => {
    const width = 10;
    const height = 10;
    const points = Array.from({ length: 128 }, () => {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
      };
    });
    const root = construct(points, {
      x: 0,
      y: 0,
      width,
      height,
    });
    const area = {
      x: 5,
      y: 5,
      radius: 3,
    };
    const orderByX = (first: Point, second: Point) => first.x - second.x;
    const expected = points
      .filter((point) => pointWithinArea(point, area))
      .sort(orderByX);
    const actual = pointsWithinArea(root, area).sort(orderByX);
    expect(actual).toEqual(expected);
  });
});

describe("Intersection helpers", () => {
  test("point is within area", () => {
    expect(
      pointWithinArea(
        {
          x: 0.5,
          y: 0.5,
        },
        { x: 0.75, y: 0.75, radius: 0.5 }
      )
    ).toBe(true);
  });
  test("point is not within area", () => {
    expect(
      pointWithinArea(
        {
          x: 0.5,
          y: 0.5,
        },
        { x: 0.75, y: 0.75, radius: 0.125 }
      )
    ).toBe(false);
  });
  test("box is within area", () => {
    expect(
      boxWithinArea(
        {
          x: 0,
          y: 0,
          width: 5,
          height: 5,
        },
        {
          x: 10,
          y: 10,
          radius: 7.5,
        }
      )
    ).toBe(true);
  });
  test("box is not within area", () => {
    expect(
      boxWithinArea(
        {
          x: 0,
          y: 0,
          width: 5,
          height: 5,
        },
        {
          x: 10,
          y: 10,
          radius: 2.5,
        }
      )
    ).toBe(false);
  });
});

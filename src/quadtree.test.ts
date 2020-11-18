import { construct, pointsWithinArea } from "./quadtree";

describe("Quadtree", () => {
  test("constructing a flat tree", () => {
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
  test("constructing a two level deep tree", () => {
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
  test("finding points within an area", () => {
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
      {
        x: 9,
        y: 9,
      },
      {
        x: 8,
        y: 8,
      },
    ];
    const root = construct(points, {
      x: 0,
      y: 0,
      width: 10,
      height: 10,
    });
    expect(pointsWithinArea(root, { x: 1, y: 1, radius: 2 })).toEqual(
      points.slice(0, 4)
    );
  });
});

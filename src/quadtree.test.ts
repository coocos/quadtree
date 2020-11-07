import { Vector } from "./vector";
import { construct } from "./quadtree";

describe("Quadtree", () => {
  test("constructing a flat tree", () => {
    const points = [
      new Vector(0, 0),
      new Vector(1, 0),
      new Vector(0, 1),
      new Vector(1, 1),
    ];
    const root = construct(points, {
      x: 0,
      y: 0,
      width: 1,
      height: 1,
    });
    expect(root.points).not.toEqual(undefined);
    expect(root.points).toEqual(points);
  });
  test("constructing a two level deep tree", () => {
    const points = [
      new Vector(0, 0),
      new Vector(1, 0),
      new Vector(0, 1),
      new Vector(0.9, 0.9),
      new Vector(1, 1),
    ];
    const root = construct(points, {
      x: 0,
      y: 0,
      width: 1,
      height: 1,
    });
    expect(root.points).toEqual(undefined);
    expect(root.children?.topLeft).toEqual({
      box: {
        x: 0,
        y: 0,
        width: 0.5,
        height: 0.5,
      },
      points: [points[0]],
    });
    expect(root.children?.topRight).toEqual({
      box: {
        x: 0.5,
        y: 0.0,
        width: 0.5,
        height: 0.5,
      },
      points: [points[1]],
    });
    expect(root.children?.bottomLeft).toEqual({
      box: {
        x: 0.0,
        y: 0.5,
        width: 0.5,
        height: 0.5,
      },
      points: [points[2]],
    });
    expect(root.children?.bottomRight).toEqual({
      box: {
        x: 0.5,
        y: 0.5,
        width: 0.5,
        height: 0.5,
      },
      points: [points[3], points[4]],
    });
  });
});

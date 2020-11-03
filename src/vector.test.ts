import { Vector } from "./vector";

describe("Vector arithmetics", () => {
  test("should add two vectors together", () => {
    expect(new Vector(1, 2).add(new Vector(3, 4))).toEqual(new Vector(4, 6));
  });
});

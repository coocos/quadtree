# Quadtree 🌳

[A quadtree](https://en.wikipedia.org/wiki/Quadtree) implementation in TypeScript. Built for fun and giggles, not for production.

## Example

The following example creates a quadtree with 256 random points within a 512 x 512 unit space and then returns all points within a 64 unit radius of the coordinates (256, 256):

```typescript
import { construct, pointsWithinArea } from "./quadtree";

const width = 512;
const height = 512;

const randomPoints = Array.from({ length: 256 }, () => {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
  };
});
const tree = construct(randomPoints, {
  x: 0,
  y: 0,
  width: width,
  height: height,
});
const nearbyPoints = pointsWithinArea(tree, {
  x: 256,
  y: 256,
  radius: 64,
});
```

## Demo

[This demo](https://lamsa.dev/quadtree/) visualizes the quadtree using canvas and keeps adding new random points to the tree, thus branching the tree deeper and deeper.

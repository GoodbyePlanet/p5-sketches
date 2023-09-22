import p5 from "p5";

const redPoint = { x: 200, y: 200 };
let points = [];
let neighbors = [];
let button;

const nearestNeighbors = new p5((p) => {
  function euclideanDistance(otherPoint) {
    let diffX = redPoint.x - otherPoint?.x;
    let diffY = redPoint.y - otherPoint?.y;

    let sum = diffX * diffX + diffY * diffY;
    return p.sqrt(sum);
  }

  function findNearestNeighbors() {
    if (points.length >= 5) {
      for (let i = 0; i < points.length; i++) {
        let dis = euclideanDistance(points[i]);
        neighbors.push({ x: points[i].x, y: points[i].y, distance: dis });
      }

      console.log(
        "neighbors sorted",
        neighbors.map((n) => n.distance).sort((a, b) => a - b),
      );
      return neighbors.sort((a, b) => a.distance - b.distance);
    }

    return [];
  }

  function paintNearestNeighbors() {
    const nearest = findNearestNeighbors().slice(0, 5);

    // Change the color of the nearest points to blue
    for (const neighbor of nearest) {
      const index = points.findIndex(
        (point) => point.x === neighbor.x && point.y === neighbor.y,
      );
      if (index !== -1) {
        points[index].color = "blue"; // Add color property to points
      }
    }
  }

  p.setup = () => {
    p.createCanvas(400, 400).parent("two");

    button = p.createButton("Calculate five nearest neighbors of RED point");
    button.mousePressed(paintNearestNeighbors);
  };

  p.draw = () => {
    p.background(220);
    p.fill("black");
    p.text(
      "Click on the canvas to create five or more points around RED point",
      10,
      10,
    );
    p.fill("red");
    p.ellipse(redPoint.x, redPoint.y, 30, 30);

    if (points.length > 0) {
      for (var i = 0; i < points.length; i++) {
        p.fill(points[i].color || "white");
        p.ellipse(points[i].x, points[i].y, 10, 10);
      }
    }
  };

  p.mousePressed = () => {
    if (p.mouseX <= 400 && p.mouseY <= 400) {
      points.push({ x: p.mouseX, y: p.mouseY });
    }
  };
});

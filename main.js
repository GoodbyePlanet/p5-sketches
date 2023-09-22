import p5 from "p5";

const redPoint = { x: 200, y: 200 };
let points = [];
let neighbors = [];
let calculateButton;
let resetButton;

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
        points[index].color = "#3498db";
      }
    }
  }

  function resetPoints() {
    neighbors = [];
    points = [];
  }

  p.setup = () => {
    let canvas = p.createCanvas(400, 400).parent("nearestNeighbors");
    canvas.elt.className = "canvas";

    let buttonsWrapper = p.createDiv();
    calculateButton = p.createButton("Nearest neighbors of orange point");
    resetButton = p.createButton("Reset");

    buttonsWrapper.elt.appendChild(calculateButton.elt);
    buttonsWrapper.elt.appendChild(resetButton.elt);
    buttonsWrapper.elt.className = "buttonsWrapper";

    calculateButton.mousePressed(paintNearestNeighbors);
    resetButton.mousePressed(resetPoints);
  };

  p.draw = () => {
    p.background(220);
    p.fill("#e67e22");
    p.ellipse(redPoint.x, redPoint.y, 30, 30);

    if (points.length > 0) {
      for (var i = 0; i < points.length; i++) {
        p.fill(points[i].color || "#ffffff");
        p.ellipse(points[i].x, points[i].y, 10, 10);
      }
    }
  };

  p.mousePressed = () => {
    if (p.mouseX <= p.width && p.mouseY <= p.height) {
      points.push({ x: p.mouseX, y: p.mouseY });
    }
  };
});

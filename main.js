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

  function isInsideCanvas() {
    return (
      p.mouseX >= 0 &&
      p.mouseX <= p.width &&
      p.mouseY >= 0 &&
      p.mouseY <= p.height
    );
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

    const knnWrapper = document.getElementById("knn");
    knnWrapper.appendChild(buttonsWrapper.elt);

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
    if (isInsideCanvas()) {
      points.push({ x: p.mouseX, y: p.mouseY });
    }
  };
});

// GRADIENT DESCENT IMPLEMENTATION

// y = mx + b - predicted Y value
// m is a slope of a line (is line moving left or right)
// b is a y-intercept or where is the line relative to the y-axis
//
// m = m - α * (∂J/∂m)
// b = b - α * (∂J/∂b)
// α is a learning reate
//
// Calculus
// Partial derivative of b ∂J/∂m = (1 / m) * ∑(h(xᵢ) - yᵢ) * xᵢ
// Partial derivarive of b ∂J/∂b = (1 / m) * ∑(h(xᵢ) - yᵢ)
//
// m in (1 / m) is is the number of training examples
// h(xᵢ) is the predicted value using the current values of m and b.
// xᵢ is the x value of the i-th data point.
// yᵢ is the actual y value of the i-th data point.

// function costFunction(m, b) {
//   let errorRate = 0;
//
//   for (let i = 0; i < gPoints.length; i++) {
//     const predictedY = m * gPoints[i].x + b;
//     const error = predictedY - gPoints[i].y;
//     errorRate += error * error;
//   }
//
//   return (1 / (2 * gPoints.length)) * errorRate;
// }

const gPoints = [];
const learningRate = 0.1;
// we can consider m and b as a weights
let b = 0;
let m = 0;

function gradientDescent(m, b) {
  let pointsLength = gPoints.length;
  let partialDerivativeOfM = 0;
  let partialDerivativeOfB = 0;

  for (let i = 0; i < pointsLength; i++) {
    let x = gPoints[i].x;
    let y = gPoints[i].y;

    const predictedY = m * x + b;
    const error = predictedY - y;

    partialDerivativeOfM += (1 / pointsLength) * error * x;
    partialDerivativeOfB += (1 / pointsLength) * error;
  }

  m -= learningRate * partialDerivativeOfM;
  b -= learningRate * partialDerivativeOfB;

  return { m, b };
}

const gradientDescentCanvas = new p5((p) => {
  function isInsideCanvas() {
    return (
      p.mouseX >= 0 &&
      p.mouseX <= p.width &&
      p.mouseY >= 0 &&
      p.mouseY <= p.height
    );
  }

  p.setup = () => {
    let canvas = p.createCanvas(400, 400).parent("gradientDescent");
    canvas.elt.className = "canvas";
  };

  p.draw = () => {
    p.background(220);

    drawDots(p);

    if (gPoints.length > 1) {
      for (let i = 0; i < gPoints.length; i++) {
        const gd = gradientDescent(m, b);

        m = gd.m;
        b = gd.b;
      }

      drawLine();
    }
  };

  p.mousePressed = () => {
    if (isInsideCanvas()) {
      let x = p.map(p.mouseX, 0, p.width, 0, 1);
      let y = p.map(p.mouseY, 0, p.height, 1, 0);

      gPoints.push(p.createVector(x, y));
    }
  };

  function drawDots() {
    if (gPoints.length > 0) {
      for (var i = 0; i < gPoints.length; i++) {
        let xPixel = p.map(gPoints[i].x, 0, 1, 0, p.width);
        let yPixel = p.map(gPoints[i].y, 0, 1, p.height, 0);
        p.ellipse(xPixel, yPixel, 10, 10);
      }
    }
  }

  function drawLine() {
    let x1 = 0;
    let y1 = m * x1 + b;
    let x2 = 1;
    let y2 = m * x2 + b;

    x1 = p.map(x1, 0, 1, 0, p.width);
    y1 = p.map(y1, 0, 1, p.height, 0);
    x2 = p.map(x2, 0, 1, 0, p.width);
    y2 = p.map(y2, 0, 1, p.height, 0);

    p.line(x1, y1, x2, y2);
  }
});

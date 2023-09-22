import p5 from "p5";

let points = [];
let dis;

const sketch0 = new p5((p) => {
  function euclideanDistance(pointOne, pointTwo) {
    let diffX = pointTwo.x - pointOne.x;
    let diffY = pointTwo.y - pointOne.y;
    let sum = diffX * diffX + diffY * diffY;

    dis = p.sqrt(sum);
    return dis;
  }

  p.setup = () => {
    p.createCanvas(400, 400).parent("one");
  };

  p.draw = () => {
    p.background(220);

    if (points.length > 0) {
      for (var i = 0; i < points.length; i++) {
        p.ellipse(points[i].x, points[i].y, 10, 10);
      }
    }

    if (points.length >= 2) {
      dis = euclideanDistance(
        { x: points[0].x, y: points[0].y },
        { x: points[1].x, y: points[1].y },
      );
      p.text(`Euclidean Distance between points: ${dis}`, p.width / 10, 10);
    }
  };

  p.mousePressed = () => {
    if (points.length >= 2) {
      points = [];
    }
    points.push({ x: p.mouseX, y: p.mouseY });
  };
});

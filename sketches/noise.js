import p5 from "p5";

const sketch1 = new p5((p) => {
  let time = 0;

  p.setup = () => {
    p.createCanvas(400, 400).parent("two");
  };

  p.draw = () => {
    p.background(220);

    time = time + 0.05;

    let x = p.noise(time);
    let y = p.noise(time);
    x = p.map(x, 0, 1, 0, p.width);
    y = p.map(y, 0, 1, 0, p.height);
    p.ellipse(p.width / 2, y, 20, 20);
  };
});

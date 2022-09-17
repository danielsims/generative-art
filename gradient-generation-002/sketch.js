const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {
  return ({ context, width, height }) => {

    const margin = 100;
    const randomizer1 = Math.random(0,100) * 100;
    const randomizer2 = Math.random(0,100) * 300;
    const hue = Math.random(0,360) * 100;

    const r1 = width / 2 + randomizer1;
    const r2 = (width / 2) + randomizer2;

    // Create a radial gradient
    const gradient = context.createRadialGradient(width / 2, height / 2, width / 2, height / 2, r1, r2 / 2);

    // Add three color stops
    gradient.addColorStop(0,  `hsla(${ hue }, 80%, 80%, 100%)`);
    gradient.addColorStop(.5, `hsla(${ hue }, 80%, 50%, 100%)`);
    gradient.addColorStop(1, `hsla(${ hue }, 80%, 0%, 80%)`);

    // Set the fill style and draw a rectangle
    context.fillStyle = gradient;
    context.fillRect(margin, margin, width - margin * 2, height - margin * 2);

  };
};

canvasSketch(sketch, settings);

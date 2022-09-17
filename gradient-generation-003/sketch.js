const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {
  return ({ context, width, height }) => {

    const margin = 100;

    const radius1 = 400;
    const radius2 = 1250;

    // Create a radial gradient
    const gradient = context.createRadialGradient(width / 2, height / 2, radius1, width / 2, height / 2, radius2);

    // Add color stops

    gradient.addColorStop(0, `hsla(330, 100%, 85%, 1)`);
    gradient.addColorStop(.35, `hsla(38, 100%, 80%, 1)`);
    gradient.addColorStop(.5, `hsla(221, 100%, 50%, 1)`);
    gradient.addColorStop(1, `hsla(0, 80%, 0%, 80%)`);

    // Set the fill style and draw a rectangle
    context.fillStyle = gradient;
    context.fillRect(margin, margin, width - margin * 2, height - margin * 2);

  };
};

canvasSketch(sketch, settings);

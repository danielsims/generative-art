const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const { createNoise2D } = require('simplex-noise');
const simplex = createNoise2D();
const { gradientColorMap } = require('./utils/color')

const settings = {
    dimensions: [512, 512]
};

const sketch = () => {
    return ({ context, width, height }) => {
        const imageData = context.createImageData(width, height);
        const data = imageData.data;
        for (let x = 0; x < width; x += 1) {
            for (let y = 0; y < height; y += 1) {
                const pixelIndex = (x + y * width) * 4;
                const noise = simplex(x / 50, y / 50); //generating noise
                const color = Math.round(lerp(0, 255, noise)); //smooth gradient
                data[pixelIndex + 0] = color; // red
                data[pixelIndex + 1] = color; // green
                data[pixelIndex + 2] = color; // blue
                data[pixelIndex + 3] = 255; // alpha
            }
        }

        let colorStops = [
            { stop: 0, color: [230, 230, 255], label: "lavender" },
            { stop: 80, color: [200, 200, 240], label: "light purple" },
            { stop: 100, color: [100, 100, 200], label: "cornflower blue" },
            { stop: 255, color: [0, 0, 60], label: "midnight blue" }
        ];
        let filteredData = gradientColorMap(imageData, colorStops);


        context.putImageData(filteredData, 0, 0);
    };
};
canvasSketch(sketch, settings);

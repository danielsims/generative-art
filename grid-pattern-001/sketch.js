const canvasSketch = require('canvas-sketch');
const { renderPaths, createPath, pathsToPolylines } = require('canvas-sketch-util/penplot');
const { clipPolylinesToBox } = require('canvas-sketch-util/geometry');
const Random = require('canvas-sketch-util/random');

// You can force a specific seed by replacing this with a string value
const defaultSeed = '';

// Set a random seed so we can reproduce this print later
Random.setSeed(defaultSeed || Random.getRandomSeed());

// Print to console so we can see which seed is being used and copy it if desired
console.log('Random Seed:', Random.getSeed());

const settings = {
  suffix: Random.getSeed(),
  dimensions: 'a4',
  orientation: 'portrait',
  pixelsPerInch: 300,
  scaleToView: true,
  units: 'cm'
};

const sketch = (props) => {
  const { width, height, units } = props;

  // Holds all 'path' objects
  // which could be from createPath, or SVGPath string, or polylines
  const paths = [];

  const grid = {
    gridWidth: width / 20,
    gridHeight: width / 4,
    padding: 0.35
  }

  console.log(grid)

  const getRandomFloat = (min, max, decimals) => {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
  }
  

  const shadeCell = (x, y, gridHeight, gridWidth, padding) => {

    const shadeDensity = getRandomFloat(0.045,0.25,2)

    for (let cellX = x; cellX < x + gridWidth; cellX = cellX + shadeDensity) {

            console.log({ cellX })

            // draw the path
            const p = createPath();
            p.moveTo(cellX, y);
            p.lineTo(cellX, y + gridHeight);
            paths.push(p);

    }
  }

  const drawGrid = ({ gridWidth, gridHeight, padding }) => {
    for (let x = 0; x < width; x = x + (gridWidth + padding) ) {
        for (let y = 0; y < height; y = y + (gridHeight + padding)) {
            
            console.log({ x, y })
            shadeCell(x, y, gridHeight, gridWidth, padding)


        }
    }
  }

  drawGrid(grid)



  // Convert the paths into polylines so we can apply line-clipping
  // When converting, pass the 'units' to get a nice default curve resolution
  let lines = pathsToPolylines(paths, { units });

  // Clip to bounds, using a margin in working units
  const margin = 1; // in working 'units' based on settings
  const box = [ margin, margin, width - margin, height - margin ];
  lines = clipPolylinesToBox(lines, box);

  // The 'penplot' util includes a utility to render
  // and export both PNG and SVG files
  return props => renderPaths(lines, {
    ...props,
    lineJoin: 'round',
    lineCap: 'round',
    // in working units; you might have a thicker pen
    lineWidth: 0.025,
    // Optimize SVG paths for pen plotter use
    optimize: true
  });
};

canvasSketch(sketch, settings);

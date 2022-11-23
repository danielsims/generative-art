const canvasSketch = require('canvas-sketch');
const { renderPaths, createPath, pathsToPolylines } = require('canvas-sketch-util/penplot');
const { clipPolylinesToBox } = require('canvas-sketch-util/geometry');
const Random = require('canvas-sketch-util/random');
const { getRandomFloat, getRandomInt } = require('./utils.js')

// Force a specific seed by replacing this with a string value
const defaultSeed = '';

// Set a random seed so we can reproduce this print later
Random.setSeed(defaultSeed || Random.getRandomSeed());

// Print to console so we can see which seed is being used and copy it if desired
console.log('Random Seed:', Random.getSeed());

const settings = {
    suffix: Random.getSeed(),
    dimensions: 'a3',
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

    // Dimensions in working 'units' based on settings
    const margin = 3
    const gridPadding = 0.35

    const canvasWidth = width - (margin * 2);
    const canvasHeight = height - (margin * 2);

    const grid = {
        gridWidth: (canvasWidth / 12),
        gridHeight: (canvasHeight / 5),
        padding: gridPadding,
        margin: margin
    }

    // Utilities
    // getRandomInt(4,20)
    // getRandomFloat(0.25,0.5,2)

    const shadeCell = (x, y, gridHeight, gridWidth, padding) => {

        const shadeDensity = getRandomFloat(0.045, 0.25, 2)

        for (let cellX = x; cellX <= x + (gridWidth - padding); cellX = cellX + shadeDensity) {

            // Hatch cell at randomised interval
            const p = createPath();
            p.moveTo(cellX, y + (padding / 2));
            p.lineTo(cellX, y + (gridHeight - padding / 2));
            paths.push(p);
        }
    }

    const drawGrid = ({ gridWidth, gridHeight, padding }) => {

        for (let x = margin; x <= width; x = x + gridWidth) {
            for (let y = margin; y <= height; y = y + gridHeight) {

                shadeCell(x + (padding / 2), y + (padding / 2), gridHeight, gridWidth, padding)

                // The below coordinates can be used to construct a responsive grid with padding

                // const p = createPath();
                // p.moveTo(x + (padding / 2), y + (padding / 2));
                // p.lineTo(x + (padding / 2), (y + gridHeight) - padding);
                // paths.push(p);

                // // draw the path
                // const p2 = createPath();
                // p2.moveTo(x - (padding / 2), y + (padding / 2));
                // p2.lineTo(x - (padding / 2), (y + gridHeight) - padding);
                // paths.push(p2);

            }
        }
    }

    drawGrid(grid)

    // Convert the paths into polylines so we can apply line-clipping
    // When converting, pass the 'units' to get a nice default curve resolution
    let lines = pathsToPolylines(paths, { units });

    // Clip to bounds, using a margin in working units
    const box = [margin, margin, width - margin, height - margin];
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

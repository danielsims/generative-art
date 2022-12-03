const canvasSketch = require('canvas-sketch');
const { createPath, renderPaths } = require('canvas-sketch-util/penplot');

const settings = {
  dimensions: 'A4',
  pixelsPerInch: 300,
  units: 'cm',
};

const sketch = ({ width, height }) => {

    const path = createPath(context => {
        // Circle in centre of page
        context.arc(width / 2, height / 2, 8, 0, Math.PI * 2);
    });

    for (i = 0; i < 360; i++) {

        console.log('test')
        
    }
    
    const paths = [ path ];



  // Export both PNG and SVG files on 'Cmd + S'
  return props => renderPaths(paths, props);
};

canvasSketch(sketch, settings);
const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
const { PlaneGeometry } = require('three');
const pallete = require('./palletes.json');

// console.log(pallete.palletes[0].colors[0].r);

// Optional preloader
const preload = p5 => {
  // Can p5.loadImage() here and so forth
};

const settings = {
  // Use p5 in instance mode, passing the preloader
  // Can also just pass { p5 } setting if you don't need preloader
  p5: { p5, preload },
  dimensions: [ 800, 800 ],
  animate: false,
};

canvasSketch(() => {
  

  const drawWaveform = (p5, width, height, yoff) => {

    let xoff = 0.0;

    p5.beginShape();
      p5.vertex(-10, height+10);
    
      for ( x=0; x<(width+10); x++ ) {

        xoff = xoff + p5.random(0.001, 0.015);

        let y = yoff + p5.noise(xoff) * 100;
    
        //Create Waveform Line from x(0) to edge of screen.
        p5.vertex (x, y);
        }
    
      p5.vertex (width+10, height+10);
    p5.endShape();
  }

  const drawBorder = (p5, width, height, bgColor) => {
    p5.noFill();
    p5.strokeWeight(350);
    p5.stroke(bgColor.r, bgColor.g, bgColor.b)
    p5.ellipse(width/2, height/2, 1000, 1000);
  }


  // Draw with p5.js
  return ({ p5, time, width, height }) => {
    
    const palletesLength = pallete.palletes.length;
    const palletesRandom = Math.floor(p5.random(0, palletesLength)) + 0;
    const colorPallete = pallete.palletes[palletesRandom].colors;
    const bgColor = colorPallete[0];

    p5.background(bgColor.r, bgColor.g, bgColor.b);
    p5.stroke(bgColor.r, bgColor.g, bgColor.b);

    for (i = p5.random(5,20);i < 100;i++) {


      let rand = Math.floor(p5.random(0 + 1, 4)) + 0;
      fillColor = colorPallete[rand]
      

      p5.fill(fillColor.r, fillColor.g, fillColor.b);

      drawWaveform(p5, width, height, (i * p5.random(10,15)))
    }

    drawBorder(p5, width, height, bgColor)

  };
}, settings);
const canvasSketch = require('canvas-sketch');
const p5 = require('p5');

// Optional preloader
const preload = p5 => {
  // Can p5.loadImage() here and so forth
};

// Sketch parameters
const settings = {
  p5: { p5, preload },
  dimensions: [ 800, 800 ],
  animate: false,
  name: 'radiating-circle'
};

// Artwork function
const sketch = ({ render, exportFrame }) => {

  //Save on Keypress
  window.addEventListener('keypress', async () => {
    const result = await exportFrame({  });
    console.log('Exported Result', result.dataURL);
  });

    //Render on Click
    window.addEventListener('click', () => render());

    var yoff = 0.0;


  return ({ p5, time, width, height }) => {

    p5.background(255);
    p5.noStroke();
    p5.fill(p5.random(255),p5.random(150),p5.random(100),60);


    circleRadius = 300;

    for (var i = 0; i < 5; i++) {

      drawShape( p5, time, width, height );
    
      }
    


  

    function drawShape( p5, time, width, height ) {    

      var xoff = 0;
      yoff += 0.001;
      var y = p5.map(p5.noise(xoff, yoff), 0, 1, 200,300);
      var startRadius = 200+y;
    
      p5.beginShape();

          //Start Circle
        for(var angle = 0; angle < 1; angle += 1.0){
          var radius = startRadius;
          var radian = p5.radians(angle);
          p5.vertex(radius * p5.cos(radian), radius * p5.sin(radian));
          xoff += 0.02;
        }
        //Do Loop
        for(var angle = 1; angle < 360; angle += 1.0){
          var y = p5.map(p5.noise(xoff, yoff), 0, 1, 200,300);
          var radius = circleRadius + y;
          var radian = p5.radians(angle);
          p5.vertex(radius * p5.cos(radian), radius * p5.sin(radian));
          xoff += 0.02;
        
        }
        //End Circle
        for(var angle = 359; angle < 360; angle += 1.0){
          var radius = startRadius;
          var radian = p5.radians(angle);
          p5.vertex(startRadius * p5.cos(radian), startRadius * p5.sin(radian));
          xoff += 0.02;
        
        circleRadius -= 90;
        
        }

      p5.endShape();
    }


  
  };
};

// Start the sketch
canvasSketch(sketch, settings);
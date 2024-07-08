import React, { useRef, useEffect } from 'react';

const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0, 1);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;

  vec3 colorA = vec3(0.5, 0.0, 0.5);
  vec3 colorB = vec3(0.0, 0.5, 0.5);
  vec3 colorC = vec3(0.8, 0.2, 0.3);
  vec3 colorD = vec3(0.1, 0.3, 0.6);

  // Simplex 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(0.0);

    // Create multiple layers of noise
    float n1 = snoise(st * 3.0 + u_time * 0.1);
    float n2 = snoise(st * 5.0 - u_time * 0.15);
    float n3 = snoise(st * 7.0 + u_time * 0.2);

    // Combine noise layers
    float n = (n1 + n2 + n3) / 3.0;

    // Create smooth transitions between colors
    vec3 gradient1 = mix(colorA, colorB, smoothstep(-1.0, 1.0, n + sin(u_time * 0.2)));
    vec3 gradient2 = mix(colorC, colorD, smoothstep(-1.0, 1.0, n - cos(u_time * 0.15)));
    
    // Combine gradients
    color = mix(gradient1, gradient2, smoothstep(-1.0, 1.0, sin(st.x * 3.14159 + u_time * 0.1) * sin(st.y * 3.14159 + u_time * 0.11)));

    // Add some subtle variation
    color += vec3(n * 0.1);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const AbstractFluidGradientShader = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl');

    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    // Create shader program
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    // Create a buffer for the position attribute
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // Get the attribute and uniform locations
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const timeUniformLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');

    // Use the program and set up attributes
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Set the resolution
    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

    // Animation loop
    let startTime = Date.now();
    function render() {
      const currentTime = (Date.now() - startTime) / 1000;
      gl.uniform1f(timeUniformLocation, currentTime);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    }
    render();
  }, []);

  return <canvas ref={canvasRef} width={2000} height={1000} className="w-screen h-screen" />;
};

export default AbstractFluidGradientShader;
function main() { 
  var VSHADER_SOURCE = document.getElementById( 'vertexShader' ).textContent;
  var FSHADER_SOURCE = document.getElementById( 'fragmentShader' ).textContent;

  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var heightWidthRatio = windowHeight / windowWidth;

  var canvas = document.getElementById('example');  
  canvas.width = windowWidth;
  canvas.height = windowHeight;

  var startTime = new Date().getTime()/1000;
  var uTime = 0;

  // Get the rendering context for WebGL
  var gl = canvas.getContext('webgl2');
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }     
   
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Set the vertex information
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  var u_HwRatio = gl.getUniformLocation(gl.program, 'u_HwRatio');
  gl.uniform1f(u_HwRatio, heightWidthRatio);

  var u_Time = gl.getUniformLocation(gl.program, 'u_Time');
  gl.uniform1f(u_Time, uTime);

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);   // Clear <canvas>

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle

  loop();

  function loop() {
    uTime = new Date().getTime()/1000 - startTime;
    gl.uniform1f(u_Time, uTime);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); 

    window.requestAnimationFrame(loop);
  }
}

function initVertexBuffers(gl) {
  var verticesTexCoords = new Float32Array([
    // Vertex coordinates, texture coordinate
    -1.0,  1.0,   0.0, 1.0,
    -1.0, -1.0,   0.0, 0.0,
     1.0,  1.0,   1.0, 1.0,
     1.0, -1.0,   1.0, 0.0,
  ]);
  var n = 4; // The number of vertices

  // Create the buffer object
  var vertexTexCoordBuffer = gl.createBuffer();
  if (!vertexTexCoordBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

  var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
  //Get the storage location of a_Position, assign and enable buffer
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
  gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object

  // Get the storage location of a_TexCoord
  var a_Uv = gl.getAttribLocation(gl.program, 'a_Uv');
  if (a_Uv < 0) {
    console.log('Failed to get the storage location of a_Uv');
    return -1;
  }
  // Assign the buffer object to a_Uv variable
  gl.vertexAttribPointer(a_Uv, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
  gl.enableVertexAttribArray(a_Uv);  // Enable the assignment of the buffer object

  return n;
}

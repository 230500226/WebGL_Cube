//display errors in the browser
//Link to this file
//http://localhost:3000/?script=CubeCustom
function showError(errorText) {
    const errorBoxDiv = document.getElementById('error-box'); //find error box
    const errorSpan = document.createElement('p');    //create span (paragraph element) to store error tex
    errorSpan.innerText = errorText; //add error text
    errorBoxDiv.appendChild(errorSpan); //add error text to the box
    console.error(errorText); //console.log(errorText) for redundant error message
}

function mainFunction(){
showError("this is CubeCustom");
    // Get canvas
    const canvas = document.getElementById("IDcanvas");
    if (!canvas){
        showError("Can't find canvas reference");
        return;
    }

    // Get context for webgl
    const gl = canvas.getContext("webgl2");
    if (!gl){
        showError("Can't find webgl2 support");
        return;
    }

    //  Shader source code
    const vSSC = `#version 300 es
    precision mediump float;
    in vec3 vertexPosition;
    in vec4 colorValue;
    uniform mat4 u_rotateX;
    uniform mat4 u_rotateY;
    uniform mat4 u_rotateZ;
    uniform mat4 u_scale;
    out vec4 varyColor;
    void main() {
        gl_Position = u_scale * u_rotateX * vec4(vertexPosition, 1.0);
        varyColor = colorValue;
    }
    `;

    // Create vertex shader
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vSSC);
    gl.compileShader(vertexShader);

    // Error checking vertex shader
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        const errorMessage = gl.getShaderInfoLog(vertexShader);
        showError('Compile vertex error: ' + errorMessage);
        return;
    }

    // Fragment shader source code for pentagon (neon green)
    const fSSCCube = `#version 300 es
    precision mediump float;
    in vec4 varyColor;
    out vec4 outColor;
    void main() {
        outColor = vec4(varyColor); 
    }`;

    // Create fragment shader
    const fragmentShaderCube = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShaderCube, fSSCCube);
    gl.compileShader(fragmentShaderCube);

    if (!gl.getShaderParameter(fragmentShaderCube, gl.COMPILE_STATUS)){
        const errorMessage = gl.getShaderInfoLog(fragmentShaderCube);
        showError('Compile fragment error: ' + errorMessage);
        return;
    }
    // Create shader program for cube
    const programCube = gl.createProgram();
    gl.attachShader(programCube, vertexShader);
    gl.attachShader(programCube, fragmentShaderCube);
    gl.linkProgram(programCube);

    if (!gl.getProgramParameter(programCube, gl.LINK_STATUS)) {
        const errorMessage = gl.getProgramInfoLog(programCube);
        showError(`Failed to link GPU program: ${errorMessage}`);
        return;
    }

    // Get attribLocation of vertexPosition initial positionVertex
    const positionVertex = gl.getAttribLocation(programCube, "vertexPosition");
    if (positionVertex < 0) {
        showError(`Failed to get attribute location for vertexPosition`);
        return;
    }

    const positionColor = gl.getAttribLocation(programCube, "colorValue");
    if (positionColor < 0) {
        showError(`Failed to get attribute location for colorValue`);
        showError(positionColor);
        return;
    }

    // Define the vertices for the cube

    const arrayCube = [
        // Vertices        // RGBA
        // Red (front face)
        -0.5, -0.5, 0,     1.0, 0.0, 0.0, 1.0,  
        -0.5, 0.5, 0,      0.1, 0.1, 0.1, 0.0,
        0.5, 0.5, 0,       0.1, 0.1, 0.1, 0.0,
        0.5, -0.5, 0,      0.1, 0.1, 0.1, 0.0,

        // Top face (Green)
        -0.5, 0.5, 0,      0.0, 1.0, 0.0, 1.0,
        -0.5, 0.5, 1,      0.0, 1.0, 0.0, 1.0,
        0.5, 0.5, 1,       0.0, 1.0, 0.0, 1.0,
        0.5, 0.5, 0,       0.0, 1.0, 0.0, 1.0,

        // Right face (Blue)
        0.5, -0.5, 0,      0.0, 0.0, 1.0, 1.0,
        0.5, 0.5, 0,       0.0, 0.0, 1.0, 1.0,
        0.5, 0.5, 1,       0.0, 0.0, 1.0, 1.0,
        0.5, -0.5, 1,      0.0, 0.0, 1.0, 1.0,

        // Back face (Yellow)
        0.5, -0.5, 1,      1.0, 1.0, 0.0, 1.0,
        0.5, 0.5, 1,       1.0, 1.0, 0.0, 1.0,
        -0.5, 0.5, 1,      1.0, 1.0, 0.0, 1.0,
        -0.5, -0.5, 1,     1.0, 1.0, 0.0, 1.0,
        
        // Bottom face (Purple)
        -0.5, -0.5, 1,     0.5, 0.0, 0.5, 1.0,
        -0.5, -0.5, 0,     0.5, 0.0, 0.5, 1.0,
        0.5, -0.5, 0,      0.5, 0.0, 0.5, 1.0,
        0.5, -0.5, 1,      0.5, 0.0, 0.5, 1.0,

        // Left face (Orange)
        -0.5, -0.5, 1,     1.0, 0.5, 0.0, 1.0,
        -0.5, 0.5, 1,      1.0, 0.5, 0.0, 1.0,
        -0.5, 0.5, 0,      1.0, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0,     1.0, 0.5, 0.0, 1.0 
    ];
    // Create the buffer for the cube
    const bufferTriangle = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferTriangle);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrayCube), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionVertex);
    gl.enableVertexAttribArray(positionColor);
    gl.enable(gl.DEPTH_TEST);

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const IdMatrix = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]

   const uniformLocations = {
        uRotateX : gl.getUniformLocation(programCube, "u_rotateX"),
        uRotateY : gl.getUniformLocation(programCube, "u_rotateY"),
        uRotateZ : gl.getUniformLocation(programCube, "u_rotateZ"),
        uScale : gl.getUniformLocation(programCube, "u_scale"),
   }

    if (uniformLocations.uRotateX == null) {
        showError(`Failed to get uniform location for u_rotateX`);
        return;
    }
    // if (uniformLocations.uRotateY == null) {
    //     showError(`Failed to get uniform location for u_rotateY`);
    //     return;
    // }
    // if (uniformLocations.uRotateZ == null) {
    //     showError(`Failed to get uniform location for u_rotateZ`);
    //     return;
    // }
    if (uniformLocations.uScale == null) {
        showError(`Failed to get uniform location for u_scale`);
        return;
    }
    
   function rotateX(matrix, theta){
       const cosTheta = Math.cos(theta);
       const sinTheta = Math.sin(theta);
       const result = matrix.slice();
       result[5] = cosTheta * matrix[5] - sinTheta * matrix[9];
       result[6] = sinTheta * matrix[5] + cosTheta * matrix[9];
       result[9] = -sinTheta * matrix[5] + cosTheta * matrix[9];
       result[10] = cosTheta * matrix[5] + sinTheta * matrix[9];
       return result;
   } 

   function rotateY(matrix, theta) {
       const cosTheta = Math.cos(theta);
       const sinTheta = Math.sin(theta);
       const result = matrix.slice(); // Create a copy of the matrix to modify the result
       // Apply the rotation transformation
       result[0] = cosTheta * matrix[0] + sinTheta * matrix[2];
       result[2] = -sinTheta * matrix[0] + cosTheta * matrix[2];
       result[8] = cosTheta * matrix[8] + sinTheta * matrix[10];
       result[10] = -sinTheta * matrix[8] + cosTheta * matrix[10];
       return result;
   }

   function rotateZ(matrix, theta){
       const cosTheta = Math.cos(theta);
       const sinTheta = Math.sin(theta);
       const result = matrix.slice();
       result[0] = cosTheta * matrix[0] - sinTheta * matrix[1];
       result[1] = sinTheta * matrix[0] + cosTheta * matrix[1];
       result[4] = cosTheta * matrix[4] - sinTheta * matrix[5];
       result[5] = sinTheta * matrix[4] + cosTheta * matrix[5];
       return result;
   }

   function scaleMatrix(matrix, scaleVector) {
       if (matrix.length !== 16 || scaleVector.length !== 4) {
           throw new Error('scaleMatrix Input matrix must be a 4x4 matrix, and scale vector must have 4 elements.');
           showError('scaleMatrix Input matrix must be a 4x4 matrix, and scale vector must have 4 elements.');
       }
       const scaledMatrix = matrix.map((value, index) => value * scaleVector[index % 4]);
       return scaledMatrix;
   }

    const scaleVector = [
        0.25, 0.25, 0.25, 1
    ]
    var theta = 0;
    function draw() {

        gl.clearColor(0.1, 0.3, 0.3, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Draw the cube
        gl.useProgram(programCube);

        gl.bindBuffer(gl.ARRAY_BUFFER, bufferTriangle);
        gl.vertexAttribPointer(positionVertex, 3, gl.FLOAT, false, 7*4, 0);
        gl.vertexAttribPointer(positionColor, 4, gl.FLOAT, false, 7*4, 3*4);

        theta = theta + Math.PI / 500;
        gl.uniformMatrix4fv(uniformLocations.uRotateX, false, rotateX(IdMatrix, theta)); //change values to 1 to stop 
        gl.uniformMatrix4fv(uniformLocations.uRotateY, false, rotateY(IdMatrix, 1));
        gl.uniformMatrix4fv(uniformLocations.uRotateZ, false, rotateX(IdMatrix, 1));
        gl.uniformMatrix4fv(uniformLocations.uScale, false, scaleMatrix(IdMatrix, scaleVector));
        
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
        gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
        gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
        gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
        gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    }

    function update() {

    }
    
    //not working
    var isAnimating = false;
    function toggleAnimation() {
        isAnimating = !isAnimating;
        if (isAnimating) {
            loop();
        }
    }
    function loop() {
        if (!isAnimating) {
            return;
        }
        update();
        draw();
        requestAnimationFrame(loop);
    }

    toggleAnimation();
}

try {
    mainFunction();
} catch (error) {
    showError('failed to run mainFunction() JS exception'+error);
}

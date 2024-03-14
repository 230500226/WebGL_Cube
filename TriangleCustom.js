//Link to this file
//http://localhost:3000/?script=TriangleCustom


function showError(errorText) {
    const errorBoxDiv = document.getElementById('error-box'); //find error box
    const errorSpan = document.createElement('p');    //create span (paragraph element) to store error tex
    errorSpan.innerText = errorText; //add error text
    errorBoxDiv.appendChild(errorSpan); //add error text to the box
    console.error(errorText); //console.log(errorText) for redundant error message
}

function mainFunction() {

    const canvas = document.getElementById("IDcanvas");
    if (!canvas) {
        showError("Can't find canvas reference");
        return;
    }

    const gl = canvas.getContext("webgl2");
    if (!gl) {
        showError("Can't find webgl2 support");
        return;
    }

    // Triangle Vertices
    const vertexData = [
        0, 1, 0,    // V1.position
        1, -1, 0,   // V2.position
        -1, -1, 0,  // V3.position
    ];

    // Color for each vertex
    const colorData = [
        1, 0, 0,    // V1.color
        0, 1, 0,    // V2.color
        0, 0, 1,    // V3.color
    ];

    // Vertex and Color buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);


    // Vertex Shader
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, `
        precision mediump float;

        attribute vec3 position;
        attribute vec3 color;
        varying vec3 vColor;

        uniform mat4 u_TranslateMatrix;
        uniform mat4 u_ScaleMatrix;
        uniform mat4 u_RotateMatrix;

        void main() {
            vColor = color;
            gl_Position = u_ScaleMatrix * u_RotateMatrix * u_TranslateMatrix * vec4(position, 1);
        }
    `);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        const errorMessage = gl.getShaderInfoLog(vertexShader);
        showError('Compile vertex error: ' + errorMessage);
        return;
    }

    //Fragment Shader
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, `
        precision mediump float;

        varying vec3 vColor;

        void main() {
            gl_FragColor = vec4(vColor, 1);
        }
    `);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
        const errorMessage = gl.getShaderInfoLog(fragmentShader);
        showError('Compile fragment error: ' + errorMessage);
        return;
    }

    // Create program 
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const errorMessage = gl.getProgramInfoLog(program);
        showError(`Failed to link GPU program: ${errorMessage}`);
        return;
    }

    //getAttribLaocation for vertex position
    const positionLocation = gl.getAttribLocation(program, `position`);
    if (positionLocation< 0) {
        showError(`Failed to get attribute location for position`);
        return;
    }
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    //getAttribLaocation for color position 
    const colorLocation = gl.getAttribLocation(program, `color`);
    if (colorLocation< 0) {
        showError(`Failed to get attribute location for position`);
        return;
    }
    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    gl.useProgram(program);

    // get UniformLocations for matricies
    const uniformLocations = {
       uTranslateMatrix: gl.getUniformLocation(program, `u_TranslateMatrix`),
       uScaleMatrix: gl.getUniformLocation(program, `u_ScaleMatrix`), 
       uRotateMatrix: gl.getUniformLocation(program, `u_RotateMatrix`),
    };

    if (uniformLocations.uTranslateMatrix == null) {
        showError(`Failed to get uniform location for u_TranslateMatrix`);
        return;
    }
    if (uniformLocations.uScaleMatrix == null) {
        showError(`Failed to get uniform location for u_ScaleMatrix`);
        return;
    }
    if (uniformLocations.uRotateMatrix == null) {
        showError(`Failed to get uniform location for u_RotateMatrix`);
        return;
    }

    // Start of matrix calculations
    // TRANSLATE matrix
        // gl.matrix
        // const matrix = mat4.create();
    
    const IdMatrix = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]; 
    
        // gl.matrix
        // mat3.translate(matrix, matrix, [.2, .5, 0]);
    
    const translationVector = [
        .4, .5, 0, 0
    ];
    
    function translateMatrix(matrix, translationVector) {
        if (matrix.length !== 16 || translationVector.length !== 4) {
            throw new Error("translateMatrix Input matrix must be a 4x4 matrix, and translation vector must have 4 elements.");
            showError("translateMatrix Input matrix must be a 4x4 matrix, and translation vector must have 4 elements.");
        }
        
        // Extract the existing translation from the input matrix
        const existingTranslation = [matrix[12], matrix[13], matrix[14]];
        
        // Add the new translation to the existing one
        const newTranslation = [
            existingTranslation[0] + translationVector[0],
            existingTranslation[1] + translationVector[1],
            existingTranslation[2] + translationVector[2]
        ];
        
        // Create the resulting translation matrix
        const resultMatrix = [
            matrix[0], matrix[1], matrix[2], matrix[3],
            matrix[4], matrix[5], matrix[6], matrix[7],
            matrix[8], matrix[9], matrix[10], matrix[11],
            newTranslation[0], newTranslation[1], newTranslation[2], matrix[15]
        ];
        
        return resultMatrix;
    }

    const translatedMatrix = translateMatrix(IdMatrix, translationVector);

    // SCALE matrix
        // gl.matrix
        // mat4.scale(matrix, matrix, [0.25, 0.25, 0.25]);

    const scaleVector = [0.25,0.25,0.25, 1];

    function scaleMatrix(matrix, scaleVector) {
        if (matrix.length !== 16 || scaleVector.length !== 4) {
            throw new Error("scaleMatrix Input matrix must be a 4x4 matrix, and scale vector must have 4 elements.");
            showError("scaleMatrix Input matrix must be a 4x4 matrix, and scale vector must have 4 elements.");
        }
        
        // Apply scaling to each row of the matrix
        const scaledMatrix = matrix.map((value, index) => value * scaleVector[index % 4]);
        
        return scaledMatrix;
    }

    const scaledMatrix = scaleMatrix(IdMatrix, scaleVector);

    // ROTATE matrix
        // Rotate Z axis (YAW)
    const rotationMatrixZ = [
        Math.cos(theta), -Math.sin(theta), 0, 0,
        Math.sin(theta), Math.cos(theta), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
        // Rotate Z function (YAW)
    function rotateZ(matrix, theta){
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);
        const result = matrix.slice(); // create a copy of matrix to modify the result

        // Applying the rotation transformation
        result[0] = cosTheta * matrix[0] - sinTheta * matrix[1];
        result[1] = sinTheta * matrix[0] + cosTheta * matrix[1];
        result[4] = cosTheta * matrix[4] - sinTheta * matrix[5];
        result[5] = sinTheta * matrix[4] + cosTheta * matrix[5];

        return result;
    }
        //Rotate X axis (Pitch)    
    const rotationMatrixX = [
        1, 0, 0, 0,
        0, Math.cos(theta), Math.sin(theta), 0,
        0, Math.sin(theta), Math.cos(theta), 0,
        0, 0, 0, 1
    ]
        // Rotate X function (Pitch)
    function rotateX(matrix, theta){
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);
        const result = matrix.slice(); // create a copy of matrix to modify the result

        // Applying the rotation transformation
        result[5] = cosTheta * matrix[5] - sinTheta * matrix[9];
        result[6] = sinTheta * matrix[5] + cosTheta * matrix[9];
        result[9] = -sinTheta * matrix[5] + cosTheta * matrix[9];
        result[10] = cosTheta * matrix[10] - sinTheta * matrix[14];

        return result;
    }
        //Rotate Y axis (Roll)
    const rotationMatrixY = [
        Math.cos(theta), 0, Math.sin(theta), 0,
        0, 1, 0, 0,
        -Math.sin(theta), 0, Math.cos(theta), 0,
        0, 0, 0, 1
    ];
        // Rotate Y function (Roll)
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
  
    // Animation loop
    var theta = Math.PI / 70;
    var IdRotationMatrix = IdMatrix;
    function animate() {
        requestAnimationFrame(animate);
        // gl.matrix
        // mat4.rotateZ(matrix, matrix, Math.PI / 2 / 70);

        var rotatedMatrix = rotateX(IdRotationMatrix, theta);
        // var rotatedMatrix = rotateY(IdRotationMatrix, theta);
        // var rotatedMatrix = rotateZ(IdRotationMatrix, theta);
        theta = theta + Math.PI / 500;

        gl.uniformMatrix4fv(uniformLocations.uTranslateMatrix, false, translatedMatrix);
        gl.uniformMatrix4fv(uniformLocations.uScaleMatrix, false, scaledMatrix);
        gl.uniformMatrix4fv(uniformLocations.uRotateMatrix, false, rotatedMatrix);
        gl.clearColor(0.1, 0.3, 0.3, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    animate();
}

try {
    mainFunction();
} catch (error) {
    showError('failed to run mainFunction() JS exception' + error);
}


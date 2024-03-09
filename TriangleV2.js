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

    const vertexData = [
        0, 1, 0,    // V1.position
        1, -1, 0,   // V2.position
        -1, -1, 0,  // V3.position
    ];

    const colorData = [
        1, 0, 0,    // V1.color
        0, 1, 0,    // V2.color
        0, 0, 1,    // V3.color
    ];

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

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
        const errorMessage = gl.getShaderInfoLog(fragmentShaderCube);
        showError('Compile fragment error: ' + errorMessage);
        return;
    }
    console.log(gl.getShaderInfoLog(fragmentShader));

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const errorMessage = gl.getProgramInfoLog(programCube);
        showError(`Failed to link GPU program: ${errorMessage}`);
        return;
    }

    const positionLocation = gl.getAttribLocation(program, `position`);
    if (positionLocation< 0) {
        showError(`Failed to get attribute location for position`);
        return;
    }

    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    const colorLocation = gl.getAttribLocation(program, `color`);
    if (colorLocation< 0) {
        showError(`Failed to get attribute location for position`);
        return;
    }

    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    gl.useProgram(program);

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
    
    // const matrix = mat4.create();
    
    const IdMatrix = [
        [1, 0, 0,],
        [0, 1, 0],
        [0, 0, 1]
    ]; 
    
    // mat3.translate(matrix, matrix, [.2, .5, 0]);
    
    const translationVector = [
        .4, .4, 0
    ];


    
    // function translateMatrixMathJS(matrix, vector){
    //     var result = math.clone(matrix);
    //     result = math.add(result, math.concat(vector, [0]));
    //     return result;
    // }

    function translateMatrix(matrix, vector) {
        var result = [];
        var numcols = Math.sqrt(matrix.length);
        for (var i = 0; i < matrix.length; i++) {
            result[i] = [];
            for (var j = 0; j < matrix[i].length; j++) {
                if (j === matrix[0].length - 1) {
                    result[i][j] = matrix[i][j] + vector[i];
                } else {
                    result[i][j] = matrix[i][j];
                }
            }
        }
        return result;
    }
    // const translatedMatrix = translateMatrixMathJS(IdMatrix, translationVector);
    const translatedMatrix = translateMatrix(IdMatrix, translationVector);
    // SCALE matrix

    // mat4.scale(matrix, matrix, [0.25, 0.25, 0.25]);

    const scaleVector = [0.25,0.25,0.25];

    // function scaleMatrixMathJS(matrix, vector){
    //     var result = math.clone(matrix);
    //     for(var i = 0; i < matrix.lengthl; i++){
    //         result[i][i] = result[i][i] * vector[i];
    //     }
    //     return result;
    // }

    function scaleMatrix(matrix, vector){
        var result = [];
        for(var i = 0; i < matrix.length; i++){
            result[i] = [];
            for (var j = 0; j < matrix[0].lengthl; j++){
                if (i === j){
                    result[i][i] = matrix[i][j] * vector[j];
                } else {
                    result[i][i] = matrix[i][j];
                }
            }
        }
        return result;
    }

    // const scaledMatrix = scaleMatrixMathJS(IdMatrix, scaleVector);
    const scaledMatrix = scaleMatrix(IdMatrix, scaleVector);

    // ROTATEZ matrix

    var theta = Math.PI / 100;
    const rotationMatrixZ = [
        [Math.cos(theta), -Math.sin(theta), 0],
        [Math.sin(theta), Math.cos(theta), 0],
        [0,0,1]
    ];
    const rotatedZMatrix = rotationMatrixZ;
   
    // bug fix translate
    function mat3ToMat4(mat3) {
        return [
        [mat3[0][0], mat3[0][1], mat3[0][2], 0],
        [mat3[1][0], mat3[1][1], mat3[1][2], 0],
        [mat3[2][0], mat3[2][1], mat3[2][2], 0],
        [0,          0,          0,          1] 
        ];
    }

    function transposeMatrix(matrix) {
        let transposed = [];
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (transposed[j] === undefined) transposed[j] = [];
                transposed[j][i] = matrix[i][j];
            }
        }
        return transposed.flat();
    }

    const mat4Matrix = mat3ToMat4(translatedMatrix);
    const transposedMatrix = transposeMatrix(mat4Matrix);

    const manualTranslateMatrix = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0.4, 0.4, 0, 1
    ]

    const manualScaleMatrix = [
        0.25, 0, 0, 0,
        0, 0.25, 0, 0,
        0, 0, 0.25, 0,
        0, 0, 0, 1
    ]

    const manualRotateMatrix = [
        Math.cos(theta), -Math.sin(theta), 0, 0,
        Math.sin(theta), Math.cos(theta), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]

    function animate() {
        requestAnimationFrame(animate);
        // mat4.rotateZ(matrix, matrix, Math.PI / 2 / 70);
        gl.uniformMatrix4fv(uniformLocations.uTranslateMatrix, false, manualTranslateMatrix);
        gl.uniformMatrix4fv(uniformLocations.uScaleMatrix, false, manualScaleMatrix);
        gl.uniformMatrix4fv(uniformLocations.uRotateMatrix, false, manualRotateMatrix);
        theta = theta + 1;
        gl.clearColor(0.1, 0.3, 0.3, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  // showError(transposedMatrix);
    animate();
}

try {
    mainFunction();
} catch (error) {
    showError('failed to run mainFunction() JS exception' + error);
}


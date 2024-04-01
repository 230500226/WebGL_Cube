function showError(errorText) {
    const errorBoxDiv = document.getElementById('error-box'); //find error box
    const errorSpan = document.createElement('p');    //create span (paragraph element) to store error tex
    errorSpan.innerText = errorText; //add error text
    errorBoxDiv.appendChild(errorSpan); //add error text to the box
    console.error(errorText); //console.log(errorText) for redundant error message
}

function mainFunction() {
    const canvas = document.getElementById("IDcanvas");
    if (!canvas){
        showError("Can't find canvas reference");
        return;
    }
    const gl = canvas.getContext("webgl2");
    if (!gl){
        showError("Can't find webgl2 support");
        return;
    }

    const vertexData = [
        0, 1, 0,
        1, -1, 0,
        -1, -1, 0,
    ]

    const colorData = [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1 
    ]

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

    const vertexShaderSourceCode =`
        precision mediump float;
    
        attribute vec3 position;
        attribute vec3 color;
        varying vec3 vColor;
    
        uniform mat4 u_TranslateMatrix;
        uniform mat4 u_ScaleMatrix;
        uniform mat4 u_RotateMatrix;
    
        void main() {
            vColor = color;
            gl_Position = 
            //u_ScaleMatrix * u_RotateMatrix * u_TranslateMatrix * 
            vec4(position, 1);
        }
    `;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSourceCode);
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
        const errorMessage = gl.getShaderInfoLog(fragmentShader);
        showError('Compile fragment error: ' + errorMessage);
        return;
    }

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const errorMessage = gl.getProgramInfoLog(program);
    showError(`Failed to link GPU program: ${errorMessage}`);
        return;
    }

    const positionLocation = gl.getAttribLocation(program, `position`);
    if (positionLocation < 0) {
        showError(`Failed to get attribute location for position`);
        return;
    }

    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
    gl.useProgram(program);

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

    // if (uniformLocations.uTranslateMatrix == null) {
    //     showError(`Failed to get uniform location for u_TranslateMatrix`);
    //     return;
    // }
    // if (uniformLocations.uScaleMatrix == null) {
    //     showError(`Failed to get uniform location for u_ScaleMatrix`);
    //     return;
    // }
    // if (uniformLocations.uRotateMatrix == null) {
    //     showError(`Failed to get uniform location for u_RotateMatrix`);
    //     return;
    // }

    const IdMatrix = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];

    //Animation loop

    var theta = Math.PI /70;

    function animate() {
        requestAnimationFrame(animate);
        gl.clearColor(0.1, 0.3, 0.3, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    animate();

    showError('hello')
}

try {
    mainFunction();
} catch (error) {
    showError('failed to run mainFunction() JS exception' + error);
}
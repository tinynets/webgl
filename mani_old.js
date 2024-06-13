import './style.css'

const canvas = document.getElementById('canvas');


const gl = canvas.getContext('webgl2');

import { vertexShaderSource } from './shaders/vertexShaderSource';
import { fragmentShaderSource } from './shaders/fragmentShaderSource';

if(!gl) {
    console.log('WebGL not supported, falling back on experimental-webgl');
}


// create GLSL shaders, upload the GLSL source, compile the shaders
const createShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if(success) {
    return shader;
  }
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

// create 2 shaders

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

// need to link the 2 shaders into a program

const createProgram = (gl, vertexShader, fragmentShader) => {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if(success) {
    return program;
  }
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

const program = createProgram(gl, vertexShader, fragmentShader);

// so we created a program on the GPU, we need to suppy it with data
// for now the only input into the program is a_position (an attribute)


const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');


// attributes get data from buffers
const positionBuffer = gl.createBuffer();
// creates a sort of global bind point that all other functions will use it to access the variable
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);


// put data in the buffer by referencing it through bind points

const positions = [
  0, 0,
  0, 0.5,
  0.7, 0,
];

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// we put data in a buffer and we need to get data out

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

// attribute needs to be "tured on"
gl.enableVertexAttribArray(positionAttributeLocation);

// tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)

const size = 2; // 2 components per iteration
const type = gl.FLOAT; // the data is 32bit floats
const normalize = false; // don't normalize the data
const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
const offset = 0; // start at the beginning of the buffer
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

// tell gl which shader program to execute

gl.useProgram(program);

// bind the attribute/buffer we set up
gl.bindVertexArray(vao);

// ask gl to execute our program
const primitiveType = gl.TRIANGLES;
const count = 3;

gl.drawArrays(primitiveType, offset, count);

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {memo, useEffect, useRef, useState} from 'react'
import {outputWidth} from '../lib/consts'
import c from 'clsx'

const scaffolds = {
  p5: code => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.8/p5.js"></script>
  <style>
    body {
      padding: 0;
      margin: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background: #fff;
    }
    body, main, canvas {
      width: 100vw;
      height: 100vh;
    }
  </style>
</head>
<body>
  <script>
    ${code}

    if (typeof window.setup === 'function') {
      new p5()
    }

    function windowResized() {
      const canvas = document.querySelector('canvas')

      if (canvas) {
        canvas.style.scale = windowWidth / ${outputWidth}
        canvas.style.transformOrigin = '0 0'
      }
    }

    setTimeout(windowResized, 10)
  </script>
</body>
</html>`,

  svg: code => `
<style>
  body {
    margin: 0;
    padding: 0;
    background: #fff;
    overflow: hidden;
  }
  svg {
    width: 100%;
    height: 100%;
  }
</style>
${code}`
}

const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

function ShaderRenderer({code, onCompileError}) {
  const canvasRef = useRef(null)
  const glRef = useRef(null)
  const programRef = useRef(null)
  const startTimeRef = useRef(Date.now())
  const animationFrameId = useRef(null)
  const resolutionRef = useRef([0, 0])

  const compileShader = (gl, source, type) => {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(shader)
      onCompileError?.(`Shader compile error: ${error}`)
      gl.deleteShader(shader)
      return null
    }
    return shader
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl', {preserveDrawingBuffer: true})
    if (!gl) {
      console.error('WebGL not supported')
      return
    }
    glRef.current = gl

    const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER)
    if (!vertexShader) return

    const fragmentShader = compileShader(gl, code, gl.FRAGMENT_SHADER)
    if (!fragmentShader) return

    onCompileError?.(null)

    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program))
      return
    }

    programRef.current = program
    gl.useProgram(program)

    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    )
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(positionAttributeLocation)
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)

    const resize = () => {
      const {clientWidth, clientHeight} = gl.canvas
      gl.viewport(0, 0, clientWidth, clientHeight)
      resolutionRef.current = [clientWidth, clientHeight]
    }
    resize()
    window.addEventListener('resize', resize)

    const renderLoop = () => {
      if (!glRef.current || !programRef.current) return
      const time = (Date.now() - startTimeRef.current) / 1000
      gl.useProgram(programRef.current)

      const resolutionLocation = gl.getUniformLocation(
        programRef.current,
        'u_resolution'
      )
      gl.uniform2fv(resolutionLocation, resolutionRef.current)

      const timeLocation = gl.getUniformLocation(programRef.current, 'u_time')
      gl.uniform1f(timeLocation, time)

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      animationFrameId.current = requestAnimationFrame(renderLoop)
    }

    renderLoop()

    return () => {
      cancelAnimationFrame(animationFrameId.current)
      window.removeEventListener('resize', resize)
      if (glRef.current && programRef.current) {
        glRef.current.deleteProgram(programRef.current)
      }
    }
  }, [code, onCompileError])

  return <canvas ref={canvasRef} />
}

function Renderer({mode, code}) {
  const iframeRef = useRef(null)
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.onerror = () => setShowError(true)
    }
  }, [iframeRef])

  return (
    <div className={c('renderer', `${mode}Renderer`)}>
      {mode === 'shader' ? (
        <ShaderRenderer code={code} />
      ) : mode === 'image' ? (
        <img src={code} alt="Generated image" />
      ) : (
        <iframe
          sandbox="allow-same-origin allow-scripts"
          loading="lazy"
          srcDoc={scaffolds[mode] ? scaffolds[mode](code) : code}
          ref={iframeRef}
        />
      )}

      {showError && (
        <div className="error">
          <p>
            <span className="icon">error</span> This code produced an error.
          </p>
        </div>
      )}
    </div>
  )
}

export default memo(Renderer)
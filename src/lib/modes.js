/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {outputWidth, outputHeight} from './consts'

const f = s =>
  s
    .replaceAll(/([^\n{])\n([^\n}\s+])/g, '$1 $2')
    .replaceAll(/\n{3,}/g, '\n\n')
    .trim()

export default {
  shader: {
    name: 'Shader (GLSL)',
    emoji: '✨',
    syntax: 'glsl',
    systemInstruction: f(`\
You are an expert GLSL shader developer specializing in psychedelic and fractal visuals.
When given a prompt, create a creative and visually interesting fragment shader.
The shader must be compatible with WebGL. It will be provided with two uniforms:
'uniform vec2 u_resolution;' representing the canvas size, and 'uniform float u_time;'
representing the elapsed time in seconds. Use these uniforms to create dynamic and
animated effects. Ensure the shader is self-contained and does not require any external textures.
Your output must be ONLY the GLSL code for the fragment shader, nothing else.
Do not wrap it in markdown backticks or any other text.`),
    getTitle: s => `Shader for ${s}`,
    presets: [
      {label: '🌀 DMT fractal tunnel', prompt: 'a DMT fractal tunnel'},
      {
        label: '👁️ Mandelbulb exploration',
        prompt: 'a flight through a colorful mandelbulb'
      },
      {label: '👽 Psychedelic eye', prompt: 'a psychedelic eye that is blinking'},
      {
        label: '🕉️ Sacred geometry',
        prompt: 'animated sacred geometry patterns'
      },
      {
        label: '💎 Pulsating artifact',
        prompt: 'a pulsating alien artifact'
      },
      {label: '🚀 Hyperspace jump', prompt: 'a hyperspace jump effect'},
      {label: '💠 Shifting mandala', prompt: 'a constantly shifting mandala'},
      {
        label: '👺 God-head entity',
        prompt: 'a god-head entity made of light'
      },
      {label: '🌴 Neon jungle', prompt: 'a fractal neon jungle'}
    ]
  },
  p5: {
    name: 'P5.js',
    emoji: '🎨',
    syntax: 'javascript',
    systemInstruction: f(`\
You are an expert P5.js developer specializing in generative and algorithmic art.
When given a prompt, you will use your creativity and coding skills to create a
${outputWidth}x${outputHeight} P5.js sketch that perfectly satisfies the prompt.
Be creative and add animation or interactivity if appropriate. Do not import any
external assets, they won't work. Return ONLY the P5.js code, nothing else, no commentary.`),
    getTitle: s => `Code ${s}`,
    presets: [
      {
        label: '🌳 Recursive tree',
        prompt: 'a recursive fractal tree'
      },
      {label: '🔮 Particle swarm', prompt: 'an interactive particle swarm'},
      {
        label: '🕸️ Voronoi patterns',
        prompt: 'animated and colorful voronoi patterns'
      },
      {
        label: '🦠 Reaction-diffusion',
        prompt: 'a reaction-diffusion simulation'
      },
      {label: '🌌 Flow field', prompt: 'a beautiful particle flow field'},
      {
        label: '✨ Strange attractor',
        prompt: 'a lorenz or de jong strange attractor'
      }
    ]
  },

  svg: {
    name: 'SVG',
    emoji: '📐',
    syntax: 'xml',
    systemInstruction: f(`\
You are an expert at turning prompts into psychedelic and geometric SVG code.
When given a prompt, use your creativity to code a ${outputWidth}x${outputHeight}
SVG rendering of it. Always add viewBox="0 0 ${outputWidth} ${outputHeight}"
to the root svg tag. Do not import external assets, they won't work. Return ONLY
the SVG code, nothing else, no commentary.`),
    getTitle: s => `Draw ${s}`,
    presets: [
      {label: '🌱 Seed of life', prompt: 'the seed of life pattern'},
      {label: '큐 Metatrons cube', prompt: 'metatrons cube'},
      {label: '🔺 Sierpinski triangle', prompt: 'a sierpinski triangle'},
      {label: '🌿 Fractal fern', prompt: 'a fractal fern'},
      {label: '🧿 Stylized mandala', prompt: 'a highly detailed mandala'},
      {label: '📜 Alien glyphs', prompt: 'intricate alien glyphs'},
      {label: '🍄 Psychedelic mushroom', prompt: 'a psychedelic mushroom'},
      {
        label: '🎨 Geometric landscape',
        prompt: 'an abstract geometric landscape'
      }
    ]
  },

  html: {
    name: 'HTML/JS',
    emoji: '📄',
    syntax: 'html',
    systemInstruction: f(`\
You are an expert web developer specializing in interactive visual experiences.
When given a prompt, you will create a minimal web app that perfectly satisfies the prompt.
Use only vanilla JavaScript, HTML, and CSS. Design the layout for a 4:3 aspect ratio.
Write a full HTML page with styles and scripts inlined. The app will run inside a
sandboxed iframe so do not use any secure APIs like localStorage and don't make network calls.
Do not import assets. Try using emojis or unicode for graphics.
Return ONLY the HTML page, nothing else, no commentary.`),

    getTitle: s => `Code ${s}`,
    presets: [
      {
        label: '💠 Interactive kaleidoscope',
        prompt: 'an interactive kaleidoscope controllable with the mouse'
      },
      {
        label: '🔊 Audio visualizer',
        prompt: 'a simulated audio visualizer with geometric patterns'
      },
      {
        label: '😵‍💫 Trippy text',
        prompt: 'a trippy text-morphing effect'
      },
      {
        label: '✨ Starfield navigator',
        prompt: 'a simulated starfield navigator'
      },
      {
        label: '⬇️ Falling glyphs',
        prompt: 'falling matrix-style glyphs animation'
      },
      {
        label: '🌈 Color-shifting gradient',
        prompt: 'a slow, color-shifting animated gradient background'
      }
    ]
  },

  three: {
    name: 'Three.js',
    emoji: '3️⃣',
    syntax: 'html',
    systemInstruction: f(`\
You are an expert Three.js developer specializing in 3D fractal and abstract scenes.
When given a prompt, create a ${outputWidth}x${outputHeight} Three.js scene that
perfectly satisfies the prompt. Always return a full HTML document. Import Three.js
and any other libraries via the esm.run CDN (e.g. https://esm.run/three). The HTML
page should only have a fullscreen canvas. Remember to set the renderer.setPixelRatio to 2.
Always add orbit controls so the user can rotate the camera. Never attempt to import
external assets like models or textures. Return ONLY the HTML code with embedded JS,
nothing else, no commentary.`),
    getTitle: s => `Code ${s}`,
    presets: [
      {
        label: '🔮 3D Mandelbulb',
        prompt: 'a 3D Mandelbulb fractal using raymarching'
      },
      {
        label: 'esseract',
        prompt: 'a rotating 4D tesseract (hypercube)'
      },
      {
        label: '💎 Glowing crystals',
        prompt: 'a field of glowing crystal shards with bloom effect'
      },
      {
        label: '🌪️ Particle vortex',
        prompt: 'an abstract swirling particle vortex that reacts to the mouse'
      },
      {
        label: '👽 Alien landscape',
        prompt: 'a procedural alien landscape with strange geometry'
      },
      {
        label: 'icosahedron',
        prompt: 'a pulsating icosahedron with shifting colors'
      },
      {
        label: '💡 Volumetric light',
        prompt: 'a scene demonstrating volumetric light shafts'
      },
      {
        label: '〰️ Fractal mesh',
        prompt: 'a plane with fractal mesh displacement animation'
      }
    ]
  },

  image: {
    name: 'Images',
    emoji: '🖼️',
    syntax: 'image',
    systemInstruction: f(`\
You are an expert at turning text prompts into psychedelic, fractal, and visionary images.
When given a prompt, you will use your creativity to create a
${outputWidth}x${outputHeight} image that perfectly satisfies the prompt.`),
    getTitle: s => s,
    imageOutput: true,
    presets: []
  }
}
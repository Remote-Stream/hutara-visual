/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import modes from '../lib/modes'
import {
  addRound,
  setOutputMode,
  setBatchModel,
  setBatchMode
} from '../lib/actions'
import models from '../lib/models'
import useStore from '../lib/store'

export default function Intro() {
  const batchModel = useStore.use.batchModel()

  const handleModeSelect = (key, prompt) => {
    setOutputMode(key)
    if (key === 'image') {
      setBatchMode(true)
      setBatchModel(Object.keys(models).find(k => models[k].imageOutput))
    } else if (models[batchModel].imageOutput) {
      setBatchModel(Object.keys(models)[1])
    }
    addRound(prompt)
  }

  return (
    <section className="intro">
      <div className="introHeader">
        <h2>
          <span className="icon">neurology</span>
          Welcome to Hutara Visual live coder
        </h2>
        <p>
          Your personal AI-powered lab for psychedelic and fractal art.
          Describe a concept, and watch as generative models bring it to life
          in code. Start by exploring one of the modes below.
        </p>
      </div>

      <div className="modesGrid">
        {Object.entries(modes)
          .filter(([key]) => key !== 'image')
          .map(([key, mode]) => (
            <div className="modeCard" key={key}>
              <h3>
                {mode.emoji} {mode.name}
              </h3>
              <p className="modeDescription">
                {mode.systemInstruction.split('.')[0]}.
              </p>
              <h4>Try these presets:</h4>
              <ul>
                {mode.presets.slice(0, 4).map(({label, prompt}) => (
                  <li key={label}>
                    <button onClick={() => handleModeSelect(key, prompt)}>
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </section>
  )
}
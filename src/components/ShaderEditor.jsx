/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {useState, useEffect, useCallback, useRef} from 'react'
import Renderer from './Renderer'
import llmGen from '../lib/llm'
import models from '../lib/models'

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  return debouncedValue
}

const ChatMessage = ({message}) => (
  <div className={`chatMessage ${message.role}`}>
    <span className="icon">{message.role === 'user' ? 'person' : 'robot_2'}</span>
    <p>{message.content}</p>
  </div>
)

export default function ShaderEditor({initialCode, modelInfo, modelKey, onClose}) {
  const [code, setCode] = useState(initialCode)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const debouncedCode = useDebounce(code, 300)

  const [chatHistory, setChatHistory] = useState([
    {
      role: 'bot',
      content: 'I can help you edit this shader. What would you like to change?'
    }
  ])
  const [chatInput, setChatInput] = useState('')
  const [isBotBusy, setIsBotBusy] = useState(false)
  const chatHistoryRef = useRef(null)

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight
    }
  }, [chatHistory])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }, [code])

  const handleChatSubmit = async e => {
    e.preventDefault()
    if (!chatInput.trim() || isBotBusy) return

    const newUserMessage = {role: 'user', content: chatInput}
    setChatHistory(prev => [...prev, newUserMessage])
    setChatInput('')
    setIsBotBusy(true)

    const systemInstruction = `You are an expert GLSL shader developer acting as a coding assistant. The user will provide you with their current shader code and a request to modify it. Your task is to return the complete, modified shader code that implements their request. Output ONLY the raw GLSL code, without any markdown backticks or explanatory text.`
    const prompt = `The current GLSL code is:\n\n\`\`\`glsl\n${code}\n\`\`\`\n\nMy request is: "${chatInput}".\nPlease provide the complete, updated GLSL code.`

    try {
      const modelString = models[modelKey]?.modelString || 'gemini-2.5-flash'
      const res = await llmGen({model: modelString, systemInstruction, prompt})
      const newCode = res
        .replace(/```\w+/gm, '')
        .replace(/```\n?$/gm, '')
        .trim()
      setCode(newCode)
      setChatHistory(prev => [
        ...prev,
        {
          role: 'bot',
          content: "I've updated the code for you. How does it look?"
        }
      ])
    } catch (err) {
      console.error(err)
      setChatHistory(prev => [
        ...prev,
        {
          role: 'bot',
          content: "Sorry, I encountered an error and couldn't modify the code."
        }
      ])
    } finally {
      setIsBotBusy(false)
    }
  }

  return (
    <div className="shaderEditor">
      <div className="shaderEditorHeader">
        <h3>
          <span className="icon">edit_square</span>
          Live Shader Editor
          <div className="modelInfo">
            ({modelInfo.name} - {(modelInfo.totalTime / 1000).toFixed(2)}s)
          </div>
        </h3>
        <div className="actions">
          <button className="iconButton" onClick={handleCopy}>
            <span className="icon">content_copy</span>
            <span className="tooltip">{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
          <button className="iconButton" onClick={onClose}>
            <span className="icon">close</span>
            <span className="tooltip">Close Editor</span>
          </button>
        </div>
      </div>
      <div className="shaderEditorBody">
        <div className="editor">
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck="false"
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
          />
        </div>
        <div className="preview">
          <Renderer
            mode="shader"
            code={debouncedCode}
            onCompileError={setError}
          />
          {error && <div className="compileError">{error}</div>}
        </div>
        <div className="chatPanel">
          <div className="chatHistory" ref={chatHistoryRef}>
            {chatHistory.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}
            {isBotBusy && (
              <div className="chatMessage bot thinking">
                <span className="icon">hourglass</span>
                <p>Thinking...</p>
              </div>
            )}
          </div>
          <form className="chatInputArea" onSubmit={handleChatSubmit}>
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="e.g., make it more blue"
              disabled={isBotBusy}
            />
            <button type="submit" disabled={isBotBusy || !chatInput.trim()}>
              <span className="icon">send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
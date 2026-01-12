import { useState, useEffect } from 'react'
import './App.css'

const pipelineStages = [
  { id: 'checkout', name: 'Checkout', icon: '🔍', duration: '5s' },
  { id: 'build', name: 'Build', icon: '🔨', duration: '45s' },
  { id: 'test', name: 'Test', icon: '🧪', duration: '2m 30s' },
  { id: 'analysis', name: 'Code Analysis', icon: '📊', duration: '1m 15s' },
  { id: 'package', name: 'Package', icon: '📦', duration: '30s' },
  { id: 'deploy', name: 'Deploy', icon: '🚀', duration: '1m' }
]

const buildHistory = [
  { id: 42, branch: 'main', status: 'success', commit: 'a1b2c3d', time: '5 min ago', duration: '5m 45s' },
  { id: 41, branch: 'feature/auth', status: 'success', commit: 'e4f5g6h', time: '1 hour ago', duration: '6m 12s' },
  { id: 40, branch: 'develop', status: 'failed', commit: 'i7j8k9l', time: '2 hours ago', duration: '3m 22s' },
  { id: 39, branch: 'main', status: 'success', commit: 'm0n1o2p', time: '3 hours ago', duration: '5m 58s' },
  { id: 38, branch: 'hotfix/bug-123', status: 'success', commit: 'q3r4s5t', time: '5 hours ago', duration: '4m 30s' }
]

const environments = [
  { id: 'dev', name: 'Development', status: 'deployed', version: 'v1.4.2-dev', url: 'dev.myapp.com' },
  { id: 'staging', name: 'Staging', status: 'deployed', version: 'v1.4.1', url: 'staging.myapp.com' },
  { id: 'prod', name: 'Production', status: 'deployed', version: 'v1.4.0', url: 'myapp.com' }
]

function PipelineVisualization({ activeStage, stageStatuses }) {
  return (
    <div className="pipeline-viz">
      <h3>🔧 Pipeline Stages</h3>
      <div className="stages-container">
        {pipelineStages.map((stage, index) => (
          <div key={stage.id} className="stage-wrapper">
            <div
              className={`stage ${stageStatuses[stage.id] || ''} ${activeStage === stage.id ? 'active' : ''}`}
            >
              <div className="stage-icon">{stage.icon}</div>
              <div className="stage-info">
                <span className="stage-name">{stage.name}</span>
                <span className="stage-duration">{stage.duration}</span>
              </div>
              {stageStatuses[stage.id] === 'success' && <span className="stage-check">✓</span>}
              {stageStatuses[stage.id] === 'failed' && <span className="stage-x">✗</span>}
              {stageStatuses[stage.id] === 'running' && <span className="stage-spinner">⏳</span>}
            </div>
            {index < pipelineStages.length - 1 && (
              <div className={`stage-connector ${stageStatuses[pipelineStages[index + 1]?.id] ? 'active' : ''}`}>
                <span>→</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function BuildHistory({ builds, onSelectBuild }) {
  return (
    <div className="build-history">
      <h3>📜 Build History</h3>
      <div className="builds-list">
        {builds.map(build => (
          <div
            key={build.id}
            className={`build-item status-${build.status}`}
            onClick={() => onSelectBuild(build)}
          >
            <div className="build-status-icon">
              {build.status === 'success' ? '✅' : '❌'}
            </div>
            <div className="build-info">
              <div className="build-main">
                <span className="build-number">#{build.id}</span>
                <span className="build-branch">{build.branch}</span>
              </div>
              <div className="build-meta">
                <span className="build-commit">{build.commit}</span>
                <span className="build-time">{build.time}</span>
              </div>
            </div>
            <div className="build-duration">{build.duration}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EnvironmentCards({ envs, selectedEnv, onSelect }) {
  return (
    <div className="environments">
      <h3>🌍 Environments</h3>
      <div className="env-grid">
        {envs.map(env => (
          <div
            key={env.id}
            className={`env-card ${selectedEnv === env.id ? 'selected' : ''}`}
            onClick={() => onSelect(env.id)}
          >
            <div className="env-header">
              <span className="env-name">{env.name}</span>
              <span className={`env-status ${env.status}`}>{env.status}</span>
            </div>
            <div className="env-details">
              <span className="env-version">{env.version}</span>
              <span className="env-url">{env.url}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ConsoleOutput({ logs }) {
  return (
    <div className="console">
      <div className="console-header">
        <span className="console-dot red"></span>
        <span className="console-dot yellow"></span>
        <span className="console-dot green"></span>
        <span className="console-title">Console Output</span>
      </div>
      <pre className="console-output">{logs}</pre>
    </div>
  )
}

function App() {
  const [selectedEnv, setSelectedEnv] = useState('dev')
  const [isRunning, setIsRunning] = useState(false)
  const [activeStage, setActiveStage] = useState(null)
  const [stageStatuses, setStageStatuses] = useState({})
  const [logs, setLogs] = useState('$ Waiting for build...\n\nClick "Run Pipeline" to start a new build.')

  const runPipeline = () => {
    setIsRunning(true)
    setStageStatuses({})
    setLogs('$ Starting pipeline...\n\n')

    const stages = [...pipelineStages]
    let currentIndex = 0

    const runNextStage = () => {
      if (currentIndex >= stages.length) {
        setIsRunning(false)
        setActiveStage(null)
        setLogs(prev => prev + '\n✅ Pipeline completed successfully!\n')
        return
      }

      const stage = stages[currentIndex]
      setActiveStage(stage.id)
      setStageStatuses(prev => ({ ...prev, [stage.id]: 'running' }))
      setLogs(prev => prev + `[${stage.icon}] Running ${stage.name}...\n`)

      setTimeout(() => {
        setStageStatuses(prev => ({ ...prev, [stage.id]: 'success' }))
        setLogs(prev => prev + `    ✓ ${stage.name} completed (${stage.duration})\n`)
        currentIndex++
        runNextStage()
      }, 800)
    }

    setTimeout(runNextStage, 500)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🔧</span>
          <h1>Jenkins CI/CD Pipeline</h1>
        </div>
        <div className="header-actions">
          <button
            className={`run-btn ${isRunning ? 'running' : ''}`}
            onClick={runPipeline}
            disabled={isRunning}
          >
            {isRunning ? '⏳ Running...' : '▶ Run Pipeline'}
          </button>
        </div>
      </header>

      <main className="main">
        <PipelineVisualization
          activeStage={activeStage}
          stageStatuses={stageStatuses}
        />

        <div className="middle-section">
          <BuildHistory
            builds={buildHistory}
            onSelectBuild={(build) => console.log('Selected build:', build)}
          />
          <EnvironmentCards
            envs={environments}
            selectedEnv={selectedEnv}
            onSelect={setSelectedEnv}
          />
        </div>

        <ConsoleOutput logs={logs} />
      </main>

      <footer className="footer">
        <p>Jenkins Pipeline Template • Author: Santanu Dhali</p>
      </footer>
    </div>
  )
}

export default App

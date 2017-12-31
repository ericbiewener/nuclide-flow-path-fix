/** @babel */
import path from 'path'
import fs from 'fs'

function setFlowDir(flowDir) {
  fs.readdir(flowDir, (e, files) => {
    if (e) console.log({e})
    const flowPath = files.filter(f => f.includes('osx'))[0]
    if (flowPath) atom.config.set('nuclide.nuclide-flow.pathToFlow', path.join(flowDir, flowPath, 'flow'))
  })
}

export default {
  activate() {
    const roots = atom.project.getPaths()
    if (roots.length !== 1) return

    const flowDir = path.join(roots[0], 'node_modules', 'flow-bin')
    if (!fs.existsSync(flowDir)) return

    setFlowDir(flowDir)

    this.watcher = fs.watch(flowDir, (eventType, filename) => {
      if (eventType !== 'rename') return

      const filepath = path.join(flowDir, filename)
      try {
        fs.statSync(filepath)
        setFlowDir(flowDir)
      } catch(e) {} // eslint-disable-line no-empty
    })
  },

  deactivate() {
    this.watcher.close()
  }
}

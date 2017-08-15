/** @babel */
const babylon = require('babylon') // doesn't work with `import` syntax

const BABYLON_CONFIG = {
  sourceType: 'module',
  plugins: [
    'estree',
    'jsx',
    'flow',
    'typescript',
    'doExpressions',
    'objectRestSpread',
    'decorators',
    'classProperties',
    'classPrivateProperties',
    'exportExtensions',
    'asyncGenerators',
    'functionBind',
    'functionSent',
    'dynamicImport',
    'numericSeparator',
    'optionalChaining',
    'importMeta',
    'bigInt',
  ]
}

/**
 * Upon encountering an error, we'll make one attempt to trim the code to the lines above that error. If we still
 * encounter an error (which could easily happened if the trimmed off code ends in the middle of a mult-line statement),
 * we just log it for debugging purposes. The `file` argument is used solely for this debugging as well.
 *
 * We could instead choose to make this function continue trimming off one line at a time until it parses successfully.
 * Hopefully instead babylon begins to allow for error recovery: https://github.com/babel/babylon/issues/347
 */
export default function babylonParse(code, filepath, errorMsg) {
  try {
    return babylon.parse(code, BABYLON_CONFIG)
  }
  catch (e) {
    try {
      code = atom.workspace.getActiveTextEditor().getTextInBufferRange([[0, 0], [e.loc.line - 2, 0]])
      return babylon.parse(code, BABYLON_CONFIG)
    }
    catch (e2) {
      console.log({e2, filepath})
      if (errorMsg) {
        errorMsg += ' Encountered an error when parsing the file ' + filepath + ':\n\n' + e.toString()
        atom.notifications.addWarning(errorMsg.trim())
      }
      return null
    }
  }
}

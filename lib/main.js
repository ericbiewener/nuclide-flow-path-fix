/** @babel */
import {CompositeDisposable} from 'atom'
import _ from 'lodash'
import babylonParse from './babylonParse'
import {locationToRange} from './utils'

export default {
  activate() {
    this.disposables = new CompositeDisposable()
    this.disposables.add(
      atom.commands.add('atom-workspace', 'shapeshifter:toggle-arrow-return', explicitArrowReturn)
    )
  },

  deactivate() {
    this.disposables.dispose()
  }
}

function explicitArrowReturn() {
  const editor = atom.workspace.getActiveTextEditor()
  if (!editor) return

  const text = editor.getText()
  const ats = babylonParse(text)

  for (const range of editor.getSelectedBufferRanges()) {
    const line = range.start.row + 1
    const nodeForLine = _.find(ats.program.body, n => n.loc.start.line <= line && n.loc.end.line >= line)
    // d.init.expression ensures that it's an implicitly returning arrow function
    const node = _.find(nodeForLine.declarations, d => d.init.expression && d.init.type === 'ArrowFunctionExpression')
    if (!node) continue

    const {body} = node.init

    const indentationLevel = editor.indentationForBufferRow(node.loc.start.line - 1) + 1
    const bodyText = _.repeat(editor.getTabText(), indentationLevel) + 'return ' + text.slice(body.start, body.end)

    // There will be no `extra` property if it's a 1-liner not wrapped in parentheses
    const blockStart = body.extra ? body.extra.parenStart : body.start
    const finalText = text.slice(node.start, blockStart) + '{\n' + bodyText + '\n}'

    editor.setTextInBufferRange(locationToRange(node.loc), finalText)
  }
}

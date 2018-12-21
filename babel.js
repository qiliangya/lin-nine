export default function({ types: t }) {
  return {
    visitor: {
      JSXIdentifier(path, state) {
        if (t.isJSXIdentifier(node.path, { name: 'v-if' })) {
          return false
        }
        path.remove()
      }
    }
  }
}
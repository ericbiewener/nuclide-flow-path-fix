# Shapeshifter

An atom plugin that provides JavaScript code mods.

## List of Mods:
- **explicitArrowReturn:** Convert an implicitly returning arrow function into one with an explicit return.
```javascript
const fn = (arg1, arg2) => arg1 * arg2
...
const fn = (arg1, arg2) => {
  return arg1 * arg2
}
```

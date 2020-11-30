// @see https://www.bilibili.com/video/BV1KJ411s7QJ?p=45 5:55

const dest = ['A', 'M', 'D']
const comp = ['0', '1', '-', 'D', 'A', 'M', '!']

export type Token =
  | {
      type: 'A' | 'L' //  A instructions | C instructions | Label
      mark: string
      line: number
    }
  | {
      type: 'C' //  C instructions
      dest: string
      comp: string
      jump: string
      line: number
    }

function hasDest(pos: number, code_str: string): boolean {
  let pos_ = pos
  let result = false

  while (pos_ < code_str.length) {
    pos_++
    const char = code_str.charAt(pos_)

    if (char === '\n') break
    if (char === '=') {
      result = true
      break
    }
  }

  return result
}

function tokenization(code_str: string): Token[] {
  const tokens: Token[] = []
  const state = {
    line: 1,
  }

  for (let pos = 0; pos < code_str.length; pos++) {
    const char = code_str.charAt(pos)

    // skip space
    if (char === ' ') continue

    // skip enter
    if (char === '\n') {
      state.line++
      continue
    }

    // skip comments
    if (char === '/' && code_str.charAt(pos + 1) === '/') {
      while (pos < code_str.length) {
        pos++
        const char = code_str.charAt(pos)
        if (char !== '\n') {
          continue
        } else {
          state.line++
          break
        }
      }
      continue
    }

    // A instructions
    if (char === '@') {
      const token: Token = {
        type: 'A',
        mark: '',
        line: state.line,
      }

      while (pos < code_str.length) {
        pos++
        const char = code_str.charAt(pos)
        if (char !== '\n') {
          token.mark += char
          continue
        } else {
          state.line++
          break
        }
      }

      tokens.push(token)
      continue
    }

    // loop symbols
    if (char === '(') {
      const token: Token = {
        type: 'L',
        mark: '',
        line: state.line,
      }

      while (pos < code_str.length) {
        pos++
        const char = code_str.charAt(pos)
        if (char !== ')') {
          token.mark += char
          continue
        } else {
          // error
          break
        }
      }

      tokens.push(token)
      continue
    }

    // dest = comp ; jump
    // dest
    if (dest.includes(char) && hasDest(pos, code_str)) {
      const token: Token = {
        type: 'C',
        dest: char,
        comp: '',
        jump: '',
        line: state.line,
      }

      while (pos < code_str.length) {
        pos++
        const char = code_str.charAt(pos)
        // comp
        if (char === '=') {
          while (pos < code_str.length) {
            pos++
            const char = code_str.charAt(pos)
            // jump
            if (char === ';') {
              while (pos < code_str.length) {
                pos++
                const char = code_str.charAt(pos)
                if (char === '\n') {
                  pos--
                  break
                } else if (char === '/' && code_str.charAt(pos + 1) === '/') {
                  while (pos < code_str.length) {
                    pos++
                    const char = code_str.charAt(pos)
                    if (char !== '\n') {
                      continue
                    } else {
                      pos--
                      break
                    }
                  }
                  continue
                } else {
                  token.jump += char
                  continue
                }
              }
              continue
            } else if (char === '\n') {
              pos--
              break
            } else if (char === '/' && code_str.charAt(pos + 1) === '/') {
              while (pos < code_str.length) {
                pos++
                const char = code_str.charAt(pos)
                if (char !== '\n') {
                  continue
                } else {
                  pos--
                  break
                }
              }
              continue
            } else {
              token.comp += char
              continue
            }
          }
          continue
        } else if (char === '\n') {
          state.line++
          break
        } else if (char === '/' && code_str.charAt(pos + 1) === '/') {
          while (pos < code_str.length) {
            pos++
            const char = code_str.charAt(pos)
            if (char !== '\n') {
              continue
            } else {
              pos--
              break
            }
          }
          continue
        } else {
          token.dest += char
          continue
        }
      }

      tokens.push({
        ...token,
        jump: token.jump.trim(),
        comp: token.comp.trim(),
      })
      continue
    }

    // C instructions
    // comp
    if (comp.includes(char)) {
      const token: Token = {
        type: 'C',
        dest: '',
        comp: char,
        jump: '',
        line: state.line,
      }

      while (pos < code_str.length) {
        pos++
        const char = code_str.charAt(pos)
        // jump
        if (char === ';') {
          while (pos < code_str.length) {
            pos++
            const char = code_str.charAt(pos)
            if (char === '\n') {
              pos--
              break
            } else if (char === '/' && code_str.charAt(pos + 1) === '/') {
              while (pos < code_str.length) {
                pos++
                const char = code_str.charAt(pos)
                if (char !== '\n') {
                  continue
                } else {
                  pos--
                  break
                }
              }
              continue
            } else {
              token.jump += char
              continue
            }
          }
          continue
        } else if (char === '\n') {
          state.line++
          break
        } else if (char === '/' && code_str.charAt(pos + 1) === '/') {
          while (pos < code_str.length) {
            pos++
            const char = code_str.charAt(pos)
            if (char !== '\n') {
              continue
            } else {
              pos--
              break
            }
          }
          continue
        } else {
          token.comp += char
          continue
        }
      }

      tokens.push({
        ...token,
        jump: token.jump.trim(),
        comp: token.comp.trim(),
      })
      continue
    }
  }
  return tokens
}

function parse(code_str: string): Token[] {
  return tokenization(code_str.replace('\r\n', '\n'))
}

export default parse

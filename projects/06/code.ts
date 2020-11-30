import createTable from './table'
import type { Token } from './parse'

const table = createTable()
const bit = (bool: boolean) => (bool ? '1' : '0')
const bit_15 = (num: number) => {
  let result = num.toString(2)

  if (result.length > 15) {
    result = result.substr(result.length - 14)
  } else {
    result = '0'.repeat(15 - result.length) + result
  }

  return result
}

const a_0: Array<[string, string]> = [
  ['0', '101010'],
  ['1', '111111'],
  ['-1', '111010'],
  ['D', '001100'],
  ['A', '110000'],
  ['!D', '001101'],
  ['!A', '110001'],
  ['-D', '001111'],
  ['-A', '110011'],
  ['D+1', '011111'],
  ['A+1', '110111'],
  ['D-1', '001110'],
  ['A-1', '110010'],
  ['D+A', '000010'],
  ['D-A', '010011'],
  ['A-D', '000111'],
  ['D&A', '000000'],
  ['D|A', '010101'],
]

const a_0_table = new Map<string, string>(a_0)

const a_1: Array<[string, string]> = [
  ['M', '110000'],
  ['!M', '110001'],
  ['-M', '110011'],
  ['M+1', '110111'],
  ['M-1', '110010'],
  ['D+M', '000010'],
  ['D-M', '010011'],
  ['M-D', '000111'],
  ['D&M', '000000'],
  ['D|M', '010101'],
]

const comp_table = new Map<string, string>([...a_0, ...a_1])
const jump_table = new Map<string, string>([
  ['JGT', '001'],
  ['JEQ', '010'],
  ['JGE', '011'],
  ['JLT', '100'],
  ['JNE', '101'],
  ['JLE', '110'],
  ['JMP', '111'],
  ['', '000'],
])

function generate_code(tokens: Token[]): string[] {
  const op_codes: string[] = []
  const addr_base = tokens.length
  let addr_variable = addr_base
  let pc = 0

  for (const token of tokens) {
    if (token.type === 'L') {
      table.set(token.mark, pc)
    } else if (token.type === 'A') {
      const index_L = tokens.findIndex(it => it.type === 'L' && it.mark === token.mark)

      if (!Number.isNaN(Number(token.mark))) {
        pc++
        op_codes.push(`0${bit_15(Number(token.mark))}`)
      } else if (table.has(token.mark)) {
        pc++
        op_codes.push(`0${bit_15(Number(table.get(token.mark)))}`)
      } else if (index_L !== -1) {
        console.log(token.mark, tokens.filter((it, index) => index < index_L && it.type !== 'L').length)
        pc++
        op_codes.push(`0${bit_15(tokens.filter((it, index) => index < index_L && it.type !== 'L').length)}`)
      } else {
        addr_variable++
        table.set(token.mark, addr_variable)
      }
    } else if (token.type === 'C') {
      const a = bit(!a_0_table.has(token.comp))
      const dest = `${bit(token.dest.includes('A'))}${bit(
        token.dest.includes('D')
      )}${bit(token.dest.includes('M'))}`
      const comp = comp_table.get(token.comp)
      const jump = jump_table.get(token.jump)

      pc++
      op_codes.push(`111${a}${comp}${dest}${jump}`)
    }
  }

  return op_codes
}

export default generate_code

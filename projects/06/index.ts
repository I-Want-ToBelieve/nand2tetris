// @see http://nodejs.cn/api/process.html#process_process_argv
import * as fs from 'fs/promises'
import * as path from 'path'
import generate_code from './code'
import parse from './parse'

async function main() {
  const file_path = process.argv[2]
  console.log('======================================================')
  console.log('======================================================')
  console.log('======================================================')
  console.log('file path: ', file_path)
  const code_str = (await fs.readFile(file_path)).toString()
  console.log('======================================================')
  console.log('======================================================')
  console.log('======================================================')
  console.log('source code: ', code_str)
  const tokens = parse(code_str)
  console.log('======================================================')
  console.log('======================================================')
  console.log('======================================================')
  console.log('tokens:', tokens)

  const op_codes = generate_code(tokens)
  const { dir, name } = path.parse(file_path)
  console.log(dir, name)
  fs.writeFile(`${dir}/${name}.hack`, op_codes.join('\n'))

  console.log('======================================================')
  console.log('======================================================')
  console.log('======================================================')
  console.log('op_codes:', op_codes)
}

main()

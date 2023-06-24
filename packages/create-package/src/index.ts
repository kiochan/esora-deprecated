import './ignore.d.ts'
import type { PromptAnswers } from './PromptAnswers'

import * as fs from 'fs'
import * as path from 'path'

import { ncp } from 'ncp'
import ignore from 'ignore'

function cwdRelative(...args: string[]): string {
  return path.join(process.cwd(), ...args)
}

function packageRelative(...args: string[]): string {
  return path.join(cwdRelative('packages'), ...args)
}

const packagePath = packageRelative()

const templateMatching = /^template-(.*)$/

let templates: string[] = []

try {
  templates = fs
    .readdirSync(packagePath)
    .filter((packageName) => packageName.match(templateMatching))
    .map((packageName) => packageName.replace(templateMatching, '$1'))
} catch (error) {
  console.error('[ERROR] Cannot open packages.')
  console.error(error)
  process.exit(1)
}

if (templates.length < 1) {
  console.error('[ERROR] No templates found.')
  process.exit(1)
}

const QUESTIONS = [
  {
    name: 'template',
    type: 'list',
    message: 'What project template would you like to generate?',
    choices: templates
  },
  {
    name: 'name',
    type: 'input',
    message: 'Package name:'
  },
  {
    name: 'description',
    type: 'input',
    message: 'Descripe your package:'
  }
] as const

async function askQuestions(): Promise<PromptAnswers> {
  const { default: inquirer } = await import('inquirer')
  return { ...(await inquirer.prompt<PromptAnswers>(QUESTIONS)) }
}

let _scope: string | null = null
async function getScope(): Promise<string> {
  if (_scope === null) {
    const projectPackageJsonObject = JSON.parse(
      await fs.promises.readFile(cwdRelative('package.json'), 'utf-8')
    )
    _scope = projectPackageJsonObject.name
  }
  return _scope as string
}

async function getPackageName(fileName: string): Promise<string> {
  return `@${await getScope()}/${fileName}`
}

async function main(): Promise<void> {
  const answers = await askQuestions()

  const scope: string = await getScope()

  const packageName = await getPackageName(answers.name)

  console.log(`Creating package "${packageName}"...`)

  const templateDirname = `template-${answers.template}`
  const templatePath = packageRelative(templateDirname)
  const templatePackageName = `@${scope}/${templateDirname}`

  console.log(`Copying files from "${templatePackageName}"...`)

  const tartgetPath = packageRelative(answers.name)

  if (fs.existsSync(tartgetPath)) {
    console.error(
      `[ERROR] Package "${packageName}" already exists in path "${tartgetPath}".`
    )
    return
  }

  const ignoreRuls = (
    await fs.promises.readFile(cwdRelative('.gitignore'), 'utf-8')
  )
    .replace(/\r|\n/g, '\n')
    .split('\n')
    .filter(Boolean)

  const ignoreInstance = ignore().add(ignoreRuls)

  try {
    await new Promise<void>((resolve, reject) => {
      ncp(
        templatePath,
        tartgetPath,
        {
          filter: (fileName) => !ignoreInstance.ignores(cwdRelative(fileName))
        },
        (error) => {
          if (error != null) {
            reject(error)
            return
          }
          resolve()
        }
      )
    })
  } catch (error) {
    console.error('[ERROR] Failed to copy template files.')
    throw error
  }

  console.log('Updating package.json...')

  const pathToPackageJson = path.join(tartgetPath, 'package.json')
  const packageJsonObject = JSON.parse(
    await fs.promises.readFile(pathToPackageJson, 'utf-8')
  )
  packageJsonObject.name = packageName
  packageJsonObject.description = answers.description
  await fs.promises.writeFile(
    pathToPackageJson,
    JSON.stringify(packageJsonObject, null, 2)
  )

  console.log('success! \nto install dependencies, run: \n    npm install')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

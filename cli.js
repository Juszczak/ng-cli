const {resolve} = require('path')
const {readFileSync, writeFileSync} = require('fs')

const render = (template, model) => {
  Object.keys(model)
    .map(key => ({pattern: key, variable: model[key]}))
    .forEach(({pattern, variable}) => {
      const regexp = new RegExp(`#${pattern}#`, 'g')
      template = template.replace(regexp, variable)
    })
  return template
}

const getTemplatePath = (templateType) => resolve(__dirname, `./templates/${templateType.toLowerCase()}.tts`)

const generateFile = (path, elementType, elementName) => {
  const template = readFileSync(getTemplatePath(elementType), 'utf8')
  const content = render(template, {
    name: elementName,
    componentString: elementName,
    moduleId: elementName,
    controllerAs: elementName,
  })
  writeFileSync(resolve(path, `./${elementName}${elementType}.ts`), content)
}

const generate = (path, name) => {
  const types = ['Component', 'Controller', 'Module']
  types.forEach(type => generateFile(path, type, name))
  writeFileSync(resolve(path, `./${name}.html`))
}

method = process.argv.length > 3
  ? () => {
    const name = process.argv[2]
    const path = resolve(process.argv[3])
    generate(path, name)
  }
  : () => console.log(`
  ng-cli

  usage:

    ng [name] [path]
`)

method()

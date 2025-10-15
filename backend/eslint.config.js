import { configApp } from '@adonisjs/eslint-config'
export default configApp({
  extends: ['plugin:adonis/typescriptApp', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'eslint.workingDirectories': ['api', 'web'],
  },
})

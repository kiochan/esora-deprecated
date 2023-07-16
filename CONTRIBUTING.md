# How to Contribute

## Getting Started

1. Fork the repository on GitHub
2. Clone the forked repository to your local machine
3. Create a new branch for your feature or bug fix
4. Make changes to your forked repository
5. Commit your changes use `npm run commit` instead of `git commit`
6. Push your changes to your forked repository
7. Open a Pull Request in GitHub

## Commit Message Format

We use [commitizen](https://github.com/commitizen/cz-cli) to format our commit messages. To commit your changes, run `npm run commit` instead of `git commit`. This will prompt you to fill in any required fields and will format your commit message for you.

## Code Style

We use JavaScript Standard Style. To check your code style, run `npm run lint`. To automatically fix any style errors, run `npm run lint:fix`. We also use [Prettier](https://prettier.io/) to format our code. To format your code, run `npm run format`. `npm run commit` will also format your code for you. If you're using VS Code, you can install the [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) to automatically format your code on save.

## Testing

We use [Jest](https://jestjs.io/) for testing. To run the tests, run `npm test`. To run the tests in watch mode, run `npm run test:watch`.

We don't have a minimum code coverage requirement, but we do expect you to write tests for your code. If you're not sure how to write tests for your code, please ask for help.

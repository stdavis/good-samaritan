const { Command, flags } = require('@oclif/command');

class GoodSamaritanCommand extends Command {
  async run() {
    const name = flags.name || 'world';
    this.log(`hello ${name} from ./src/index.js`);
  }
}

GoodSamaritanCommand.description = `Find open issues from open source dependencies of your project.
...
Only issues that are marked as help wanted are shown by default.
`;

GoodSamaritanCommand.flags = {
  // add --version flag to show CLI version
  version: flags.version({ char: 'v' }),
  // add --help flag to show CLI version
  help: flags.help({ char: 'h' })
};

module.exports = GoodSamaritanCommand;

import { App, Plugin } from 'obsidian';

import {
  formatFrontMater,
  formatHeadings,
  fuzzyFindBackLinks,
  fuzzyFindOutgoingLinks,
  goToToday,
  goToYesterday,
  renameFile,
} from './features';
import { ctx, logger, wait } from './lib';
import { getCommand, getIsSuggestionElementActive, ICommand } from './obsidian';

export default class PWE extends Plugin {
  readonly app: App;

  async onload(): Promise<void> {
    logger.info({ msg: 'Personalized Writing Environment is ON' });

    ctx.setApp(this.app);

    this.setCommands();
    this.setEvents();
  }

  async onunload(): Promise<void> {
    ctx.setApp(null);
    console.clear();

    logger.info({ msg: 'Personalized Writing Environment is OFF' });
  }

  private setCommands(): void {
    const commands: ICommand[] = [
      { name: 'Format Front Matter', callback: formatFrontMater },
      { name: 'Format Heading', callback: formatHeadings },
      { name: 'Fuzzy Find BackLinks', callback: fuzzyFindBackLinks },
      { name: 'Fuzzy Find Outgoing Links', callback: fuzzyFindOutgoingLinks },
      { name: 'Go To Today', callback: goToToday },
      { name: 'Go To Yesterday', callback: goToYesterday },
      { name: 'Rename File', callback: renameFile },
    ];

    commands.forEach((command) => {
      this.addCommand(getCommand(command));
    });
  }

  private setEvents(): void {
    const enableAutocmds = false;
    if (enableAutocmds) {
      this.registerEvent(
        this.app.metadataCache.on('changed', async () => {
          await formatHeadings();
          await formatFrontMater();

          // Delay to prevent modify and old cached file
          await wait(200);
          await renameFile();
        }),
      );
    }

    // Select next item in an autocomplete DOM Element
    this.registerDomEvent(document, 'keydown', (evt: KeyboardEvent) => {
      const isKeyPattern = evt.ctrlKey && evt.key === 'j';
      if (!isKeyPattern) return;

      const isSuggestionElement = getIsSuggestionElementActive();
      if (!isSuggestionElement) return;

      evt.stopPropagation();
      evt.preventDefault();

      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown' }),
      );
    });

    // Select next item in an autocomplete DOM Element
    this.registerDomEvent(document, 'keydown', (evt: KeyboardEvent) => {
      const isKeyPattern = evt.ctrlKey && evt.key === 'k';
      if (!isKeyPattern) return;

      const isSuggestionElement = getIsSuggestionElementActive();

      evt.stopPropagation();
      evt.preventDefault();

      // To also use <C-k> for open find lines
      if (!isSuggestionElement) {
        document.dispatchEvent(
          new KeyboardEvent('keydown', { ctrlKey: true, key: 'p' }),
        );
        return;
      }

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    });
  }
}

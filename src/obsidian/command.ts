import { Command } from 'obsidian';

import { toKebabCase, toTitleCase } from 'src/lib';

export interface ICommand {
  name: string;

  callback: () => any;
}

export function getCommand(payload: ICommand): Command {
  return {
    callback: payload.callback,
    id: `${toKebabCase(payload.name)}`,
    name: `${toTitleCase(payload.name)} Command`,
  };
}

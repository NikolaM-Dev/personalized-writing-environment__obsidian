import { Notice } from 'obsidian';
import { removeConsecutiveSpaces } from './string';

interface ILogPayload {
  extra?: string;
  icon?: string;
  msg: string;
  showToast?: boolean;
}

const DEBUG_MODE = false;
const PLUGIN_PREFIX = '[PWE]:';

export const logger = {
  debug: (payload: ILogPayload) => log({ icon: '🐞', ...payload }),
  error: (payload: ILogPayload) => log({ icon: '❌', ...payload }),
  info: (payload: ILogPayload) => log({ icon: 'ℹ️', ...payload }),
  warn: (payload: ILogPayload) => log({ icon: '⚠️', ...payload }),
};

function toast(msg: string, icon?: string): void {
  if (!DEBUG_MODE) return;

  const message = removeConsecutiveSpaces(`${PLUGIN_PREFIX} ${icon} ${msg}`);

  new Notice(message);
}

function log(payload: ILogPayload): void {
  const { extra, icon, msg, showToast = true } = payload;

  console.log(`${PLUGIN_PREFIX} ${msg}`);

  if (extra) console.log({ extra });
  if (showToast) toast(msg, icon);
}

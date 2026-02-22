import { TFile } from 'obsidian';
import { addDay, format } from '@formkit/tempo';

import { ctx, logger } from 'src/lib';

export async function goToToday(): Promise<void> {
  const today = format(new Date(), 'YYYY-MM-DD');

  await goToJournalEntry(today);
}

export async function goToYesterday(): Promise<void> {
  const yesterday = addDay(new Date(), -1);
  const basename = format(yesterday, 'YYYY-MM-DD');

  await goToJournalEntry(basename);
}

async function goToJournalEntry(basename: string): Promise<void> {
  const appResult = ctx.getApp();
  if (appResult.isErr()) {
    logger.error({ msg: appResult.error });

    return;
  }
  const { value: app } = appResult;

  const files = app.vault.getMarkdownFiles();

  const file = files.find((f: TFile) => f.basename === basename);
  if (!file) {
    logger.warn({ msg: `File ${basename}.md not found` });
    return;
  }

  await app.workspace.getLeaf().openFile(file);
}


export async function goToToday(): Promise<void> {
  const today = format(new Date(), 'YYYY-MM-DD');

  await goToJournalEntry(today);
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

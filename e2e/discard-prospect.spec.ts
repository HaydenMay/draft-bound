import { expect, Page, test } from '@playwright/test';
import { createRun } from '../src/app/domain/engine';
import { cosmeticProfile } from '../src/app/domain/eligibility';
import { completeRun, createCollege } from '../src/app/domain/test-fixtures';
import { emptySave } from '../src/app/persistence/save';
import { readSave, writeSave } from './storage-helper';

async function loadProspect(page: Page, phase: 'creation' | 'college') {
  const save = emptySave();
  save.run = phase === 'creation' ? createRun('Restart Test', 11, 918, '2026-10-24T00:00:00Z') : createCollege(919);
  save.entries = [completeRun(920).entry!];
  save.profile = cosmeticProfile(save.entries, save.profile);
  save.settings = { fastForward: true, theme: 'dark', palette: 'navy' };
  await page.goto('/');
  await writeSave(page, save);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Resume your prospect', exact: true })).toBeVisible();
  return save;
}

for (const phase of ['creation', 'college'] as const) {
  test(`Settings can discard a ${phase} prospect, preserve the collection and start fresh`, async ({ page }) => {
    if (phase === 'creation') await page.setViewportSize({ width: 390, height: 844 });
    const before = await loadProspect(page, phase);
    await page.getByRole('button', { name: 'Settings', exact: true }).click();
    await page.screenshot({ path: test.info().outputPath('discard-settings.png') });
    await page.getByRole('button', { name: /Discard current prospect/ }).click();
    const confirmation = page.getByRole('dialog', { name: 'Discard current prospect?', exact: true });
    await expect(confirmation).toContainText(before.run!.name);
    await page.screenshot({ path: test.info().outputPath('discard-confirmation.png') });
    expect((await readSave(page)).run).toEqual(before.run);
    await confirmation.getByRole('button', { name: 'Keep prospect', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Saves & settings', exact: true })).toBeVisible();
    expect((await readSave(page)).run).toEqual(before.run);

    await page.getByRole('button', { name: /Discard current prospect/ }).click();
    await confirmation.getByRole('button', { name: 'Discard & start new', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'New prospect', exact: true })).toBeVisible();
    const after = await readSave(page);
    expect(after.run).toBeNull();
    expect(after.entries).toEqual(before.entries);
    expect(after.profile).toEqual(before.profile);
    expect(after.settings).toEqual(before.settings);
    await page.getByRole('button', { name: 'Close dialog', exact: true }).click();
    await page.reload();
    await expect(page.getByRole('button', { name: 'Create your prospect', exact: true })).toBeVisible();
    expect((await readSave(page)).run).toBeNull();
    await page.getByRole('button', { name: 'Settings', exact: true }).click();
    await expect(page.getByRole('button', { name: /Discard current prospect/ })).toHaveCount(0);
    await page.getByRole('button', { name: 'Close dialog', exact: true }).click();
    await page.getByRole('button', { name: 'Create your prospect', exact: true }).click();
    await page.getByRole('button', { name: 'Create prospect', exact: true }).click();
    await expect.poll(async () => (await readSave(page)).run?.phase).toBe('gift');
    expect((await readSave(page)).run!.id).not.toBe(before.run!.id);
    expect((await readSave(page)).entries).toEqual(before.entries);
  });
}

for (const source of ['settings', 'binder'] as const) {
  test(`failed deletion from ${source} keeps the current prospect and confirmation intact`, async ({ page }) => {
    const before = await loadProspect(page, 'college');
    if (source === 'settings') {
      await page.getByRole('button', { name: 'Settings', exact: true }).click();
      await page.getByRole('button', { name: /Discard current prospect/ }).click();
    } else {
      await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('button', { name: /My binder/ }).click();
      await page.getByRole('button', { name: 'New prospect', exact: true }).click();
    }
    await page.evaluate(() => { IDBObjectStore.prototype.put = function () { throw Error('Simulated storage failure'); }; });
    await page.getByRole('button', { name: source === 'settings' ? 'Discard & start new' : 'Discard run & start fresh', exact: true }).click();
    await expect(page.getByRole('dialog').getByRole('alert')).toContainText('Your current prospect is unchanged');
    await expect(page.getByRole('heading', { name: 'New prospect', exact: true })).toHaveCount(0);
    expect((await readSave(page)).run).toEqual(before.run);
    await page.getByRole('button', { name: 'Close dialog', exact: true }).click();
    await expect(page.getByRole('button', { name: source === 'settings' ? 'Resume your prospect' : 'New prospect', exact: true })).toBeVisible();
    await page.reload();
    expect((await readSave(page)).run).toEqual(before.run);
    expect((await readSave(page)).entries).toEqual(before.entries);
  });
}

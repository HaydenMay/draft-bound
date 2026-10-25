import { expect, test, Page } from '@playwright/test';
import { RECEIVER_TEAMS, eligibleReceiversForTeam, receiverProfile, receiverTeam } from '../src/app/data/receiver-catalog';
import { readSave } from './storage-helper';

async function phase(page: Page, value: string): Promise<void> {
  await expect.poll(async () => (await readSave(page)).run?.phase).toBe(value);
}

async function skipGenericReveal(page: Page): Promise<void> {
  const skip = page.getByRole('button', { name: /Skip reveal/ });
  if (await skip.isVisible().catch(() => false)) await skip.click();
}

async function startPotential(page: Page, mode: 'quick' | 'full' = 'quick'): Promise<void> {
  await page.goto('/');
  await page.getByRole('button', { name: /Create your prospect/ }).click();
  await page.getByRole('radio', { name: mode === 'quick' ? 'Quick · 3 picks' : 'Full · 8 picks' }).check();
  await page.getByRole('button', { name: /Create prospect/ }).click();
  await phase(page, 'gift');
  await skipGenericReveal(page);
  await page.locator('.gift-card').first().click();
  await phase(page, 'size');
  await skipGenericReveal(page);
  await page.getByRole('button', { name: /This is my build/ }).click();
  await phase(page, 'potential');
}

async function waitForReceiverStage(page: Page): Promise<void> {
  await expect(page.getByTestId('spotlight-team-board')).toBeVisible();
  await expect(page.getByTestId('spotlight-receiver-board')).toBeVisible({ timeout: 5000 });
}

test('spotlight displays all teams, then only eligible receivers, and both skips preserve the selected result', async ({ page }) => {
  await startPotential(page);
  const selected = (await readSave(page)).run!.creation.currentRoll!;
  const team = receiverTeam(selected.teamId)!;
  const receiver = receiverProfile(selected.receiverId)!;

  await expect(page.getByTestId('spotlight-team-board').locator('[data-spotlight-id]')).toHaveCount(32);
  await waitForReceiverStage(page);

  const eligibleIds = eligibleReceiversForTeam(selected.teamId).map(profile => profile.id);
  const shownIds = await page.getByTestId('spotlight-receiver-board').locator('[data-spotlight-id]').evaluateAll(nodes => nodes.map(node => node.getAttribute('data-spotlight-id')));
  expect(shownIds).toEqual(eligibleIds);
  expect(await readSave(page).then(save => save.run!.creation.currentRoll)).toEqual(selected);
  await expect(page.locator('.receiver-roll-heading h2')).toHaveText(receiver.name);
  await expect(page.getByText(team.displayName, { exact: true }).first()).toBeVisible();
});

test('skipping during the team stage immediately reveals the same preselected receiver', async ({ page }) => {
  await startPotential(page);
  const selected = (await readSave(page)).run!.creation.currentRoll!;
  const receiver = receiverProfile(selected.receiverId)!;

  await expect(page.getByTestId('spotlight-team-board')).toBeVisible();
  await page.getByRole('button', { name: /Skip reveal/ }).click();
  await expect(page.getByTestId('spotlight-team-board')).toHaveCount(0);
  await expect(page.locator('.receiver-roll-heading h2')).toHaveText(receiver.name);
  expect((await readSave(page)).run!.creation.currentRoll).toEqual(selected);
});

test('keyboard users can skip the spotlight and focus returns to the selected receiver', async ({ page }) => {
  await startPotential(page);
  const selected = (await readSave(page)).run!.creation.currentRoll!;
  const skip = page.getByRole('button', { name: /Skip reveal/ });

  await expect(skip).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(skip).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('.receiver-roll-heading h2')).toHaveText(receiverProfile(selected.receiverId)!.name);
  await expect(page.locator('.receiver-roll-heading h2')).toBeFocused();
  expect((await readSave(page)).run!.creation.currentRoll).toEqual(selected);
});

test('leaving the page during the spotlight cleans up its active animation timer', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await startPotential(page);
  await expect(page.getByTestId('spotlight-team-board')).toBeVisible();

  await page.goto('/');
  await page.waitForTimeout(1400);
  expect(pageErrors).toEqual([]);
});

test('the spotlight completes naturally without changing the preselected receiver', async ({ page }) => {
  await startPotential(page, 'full');
  const selected = (await readSave(page)).run!.creation.currentRoll!;
  const receiver = receiverProfile(selected.receiverId)!;

  await expect(page.getByTestId('spotlight-team-board')).toBeVisible();
  await expect(page.getByTestId('spotlight-receiver-board')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('.receiver-roll-heading h2')).toHaveText(receiver.name, { timeout: 5000 });
  expect((await readSave(page)).run!.creation.currentRoll).toEqual(selected);
});

test('reduced motion bypasses the spotlight and leaves the selected receiver readable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await startPotential(page);
  const selected = (await readSave(page)).run!.creation.currentRoll!;

  await expect(page.getByTestId('spotlight-team-board')).toHaveCount(0);
  await expect(page.locator('.receiver-roll-heading h2')).toHaveText(receiverProfile(selected.receiverId)!.name);
});

test('the team board remains legible without horizontal overflow on a phone viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await startPotential(page);
  await expect(page.getByTestId('spotlight-team-board')).toBeVisible();
  await expect(page.getByTestId('spotlight-team-board').locator('[data-spotlight-id]')).toHaveCount(RECEIVER_TEAMS.length);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('Quick mode animates manual rolls and moves to autofill without another spotlight', async ({ page }) => {
  await startPotential(page);
  for (let pick = 0; pick < 3; pick++) {
    await expect(page.getByTestId('spotlight-team-board')).toBeVisible();
    await page.getByRole('button', { name: /Skip reveal/ }).click();
    await page.locator('.receiver-grade:not(.assigned)').first().click();
    await phase(page, pick === 2 ? 'reveal' : 'potential');
    if (pick < 2) await expect(page.getByTestId('spotlight-team-board')).toBeVisible();
  }
  await skipGenericReveal(page);
  await expect(page.getByTestId('spotlight-team-board')).toHaveCount(0);
  expect((await readSave(page)).run!.creation.manualCount).toBe(3);
  expect((await readSave(page)).run!.creationFlowVersion).toBe('single-receiver-v1.4.2');
});

test('Full mode shows eight manual spotlights and stops before college progression', async ({ page }) => {
  await startPotential(page, 'full');
  for (let pick = 0; pick < 8; pick++) {
    await expect(page.getByTestId('spotlight-team-board')).toBeVisible();
    await page.getByRole('button', { name: /Skip reveal/ }).click();
    await page.locator('.receiver-grade:not(.assigned)').first().click();
    await phase(page, pick === 7 ? 'reveal' : 'potential');
  }
  await skipGenericReveal(page);
  await expect(page.getByTestId('spotlight-team-board')).toHaveCount(0);
  const run = (await readSave(page)).run!;
  expect(run.creation.manualCount).toBe(8);
  expect(run.creationMode).toBe('full');
});

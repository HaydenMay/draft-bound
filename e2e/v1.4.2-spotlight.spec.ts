import { expect, test, Page } from '@playwright/test';
import { RECEIVER_TEAMS, eligibleReceiversForTeam, receiverProfile, receiverTeam } from '../src/app/data/receiver-catalog';
import { readSave, writeSave } from './storage-helper';
import { createRun } from '../src/app/domain/engine';
import { step } from '../src/app/domain/test-fixtures';
import { emptySave } from '../src/app/persistence/save';

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
  await page.getByRole('button', { name: /Skip reveal/ }).click();
  expect(await readSave(page).then(save => save.run!.creation.currentRoll)).toEqual(selected);
  expect((await readSave(page)).run!.rerolls).toBe(3);
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
  await expect(page.getByRole('dialog')).toHaveCount(0, { timeout: 7000 });
  await expect(page.locator('.receiver-roll-heading h2')).toHaveText(receiver.name, { timeout: 5000 });
  expect((await readSave(page)).run!.creation.currentRoll).toEqual(selected);
});

test('winning team and receiver names pause long enough to read before moving on', async ({ page }) => {
  await startPotential(page);
  const selected = (await readSave(page)).run!.creation.currentRoll!;
  const teamBoard = page.getByTestId('spotlight-team-board');
  const receiverBoard = page.getByTestId('spotlight-receiver-board');
  await expect(page.getByRole('heading', { name: receiverTeam(selected.teamId)!.displayName, exact: true })).toBeVisible();
  await page.waitForTimeout(350);
  await expect(teamBoard).toBeVisible();
  await expect(receiverBoard).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('heading', { name: receiverProfile(selected.receiverId)!.name, exact: true })).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('receiver-winner.png') });
  await page.waitForTimeout(650);
  await expect(receiverBoard).toBeVisible();
  await expect(page.getByRole('dialog', { name: receiverProfile(selected.receiverId)!.name, exact: true })).toHaveCount(0);
  expect((await readSave(page)).run!.creation.currentRoll).toEqual(selected);
});

for (const mode of ['quick', 'full'] as const) {
  test(`${mode} restores three receiver rerolls with replay, exhaustion and reload safety`, async ({ page }) => {
    if (mode === 'quick') await page.setViewportSize({ width: 390, height: 844 });
    await startPotential(page, mode);
    await page.getByRole('button', { name: /Skip reveal/ }).click();
    const initial = (await readSave(page)).run!;
    for (let left = 3; left > 0; left--) {
      const reroll = page.getByRole('button', { name: `Reroll receiver ${left} left`, exact: true });
      await expect(reroll).toBeEnabled();
      await reroll.click();
      await expect(page.getByTestId('spotlight-team-board')).toBeVisible();
      const run = (await readSave(page)).run!;
      expect(run.rerolls).toBe(left - 1);
      expect(run.creation.manualCount).toBe(initial.creation.manualCount);
      expect(run.creation.traits).toEqual(initial.creation.traits);
      await page.getByRole('button', { name: /Skip reveal/ }).click();
    }
    await expect(page.getByRole('button', { name: 'Reroll receiver 0 left', exact: true })).toBeDisabled();
    await page.getByRole('button', { name: 'Reroll receiver 0 left', exact: true }).scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: test.info().outputPath(`${mode}-reroll-budget.png`) });
    const exhausted = (await readSave(page)).run!;
    await page.reload();
    await expect(page.getByRole('button', { name: 'Reroll receiver 0 left', exact: true })).toBeDisabled();
    expect((await readSave(page)).run).toEqual(exhausted);
  });
}

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

for (const viewport of [{width:320,height:568}, {width:390,height:664}, {width:1280,height:800}]) {
  test(`ten receiver names fit without scrolling at ${viewport.width}×${viewport.height}`, async ({page}) => {
    await page.setViewportSize(viewport);
    // Cincinnati includes T.J. Houshmandzadeh: exercise wrapping, not just short names.
    let sizeRun;
    for (let seed=1;seed<500;seed++) {
      const candidate=step(createRun('Board Fit',11,seed,'2026-10-25T00:00:00Z'),{type:'choose-gift',index:0});
      if(step(candidate,{type:'accept-size'}).creation.currentRoll!.teamId==='cin'){sizeRun=candidate;break;}
    }
    expect(sizeRun).toBeDefined();
    await page.goto('/');
    await expect(page.getByRole('button',{name:'Settings',exact:true})).toBeVisible();
    const save=emptySave();save.run=sizeRun!;
    await writeSave(page,save);await page.goto('/#play');await page.reload();
    await page.getByRole('button',{name:/This is my build/}).click();
    await waitForReceiverStage(page);
    const board=page.getByTestId('spotlight-receiver-board');
    await expect(board.locator('[data-spotlight-id]')).toHaveCount(10);
    const initial=await board.evaluate(el=>{
      const panel=el.closest('.spotlight-panel')!;
      const tiles=[...el.children].map(tile=>{const r=tile.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right};});
      return {columns:getComputedStyle(el).gridTemplateColumns.split(' ').length,
        boardFits:el.scrollHeight<=el.clientHeight+1,panelFits:panel.scrollHeight<=panel.clientHeight+1,
        allVisible:tiles.every(r=>r.top>=0&&r.bottom<=innerHeight&&r.left>=0&&r.right<=innerWidth),
        boardScroll:el.scrollTop,panelScroll:panel.scrollTop,windowScroll:scrollY};
    });
    expect(initial.columns).toBe(viewport.width<=560?2:5);
    expect(initial.boardFits).toBe(true);expect(initial.panelFits).toBe(true);expect(initial.allVisible).toBe(true);
    const selected=(await readSave(page)).run!.creation.currentRoll!;
    await expect(page.getByRole('dialog').getByRole('heading',{name:receiverProfile(selected.receiverId)!.name,exact:true})).toBeVisible();
    const after=await board.evaluate(el=>({boardScroll:el.scrollTop,panelScroll:el.closest('.spotlight-panel')!.scrollTop,windowScroll:scrollY}));
    expect(after).toEqual({boardScroll:initial.boardScroll,panelScroll:initial.panelScroll,windowScroll:initial.windowScroll});
    await page.screenshot({path:test.info().outputPath('ten-receiver-board.png')});
  });
}


test('upcoming receiver details stay concealed until the spotlight finishes or is skipped',async({page})=>{
 await startPotential(page,'full');
 await expect(page.getByTestId('spotlight-team-board')).toBeVisible();
 await expect(page.locator('.receiver-roll')).toBeHidden();
 await page.getByRole('button',{name:/Skip reveal/}).click();
 await expect(page.locator('.receiver-roll')).toBeVisible();
 await page.getByRole('button',{name:'Reroll receiver 3 left',exact:true}).click();
 await expect(page.getByTestId('spotlight-team-board')).toBeVisible();
 await expect(page.locator('.receiver-roll')).toBeHidden();
 const selected=(await readSave(page)).run!.creation.currentRoll!;
 await page.getByRole('button',{name:/Skip reveal/}).click();
 await expect(page.locator('.receiver-roll-heading h2')).toHaveText(receiverProfile(selected.receiverId)!.name);
 await expect(page.locator('.receiver-roll-heading h2')).toBeFocused();
});

test('a manual pick conceals its next receiver even while the save is still pending',async({page})=>{
 await startPotential(page,'full');await page.getByRole('button',{name:/Skip reveal/}).click();
 await page.evaluate(()=>{
  const descriptor=Object.getOwnPropertyDescriptor(IDBTransaction.prototype,'oncomplete')!;
  Object.defineProperty(IDBTransaction.prototype,'oncomplete',{configurable:true,get:descriptor.get,set(handler){
   descriptor.set!.call(this,typeof handler==='function'?function(this:IDBTransaction,event:Event){setTimeout(()=>handler.call(this,event),1200);}:handler);
  }});
 });
 await page.locator('.receiver-grade:not(.assigned)').first().click();
 await expect(page.locator('.receiver-roll')).toBeHidden();
 await expect(page.getByTestId('spotlight-team-board')).toBeVisible();
 await expect(page.locator('.receiver-roll')).toBeHidden();
 const selected=(await readSave(page)).run!.creation.currentRoll!;
 await page.getByRole('button',{name:/Skip reveal/}).click();
 await expect(page.locator('.receiver-roll-heading h2')).toHaveText(receiverProfile(selected.receiverId)!.name);
});

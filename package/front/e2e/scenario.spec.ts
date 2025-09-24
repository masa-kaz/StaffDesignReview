import { test, expect } from '@playwright/test'

test.describe('ScenarioHost', () => {
  test('ButtonPrimary default', async ({ page }) => {
    await page.goto('/__scenario__?key=atoms/button-primary&variant=default')
    await expect(page.getByRole('button', { name: 'クリック' })).toBeVisible()
  })

  test('ButtonPrimary longLabel visual', async ({ page }) => {
    await page.goto('/__scenario__?key=atoms/button-primary&variant=longLabel')
    const button = page.getByRole('button')
    await expect(button).toBeVisible()
    expect(await page.screenshot()).toMatchSnapshot('button-primary-long.png')
  })
})



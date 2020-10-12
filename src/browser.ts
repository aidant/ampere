import playwright from 'playwright';

export const browser = await playwright.chromium.launch({
  args: ['--disable-dev-shm-usage']
})

import { Page, Locator, expect } from '@playwright/test';

export class SearchPage {
  page: Page;

  locationDropdown: Locator;
  locationPanel: Locator;
  dateTrigger: Locator;

  guestDropdown: Locator;

  searchButton: Locator;
  roomItem: Locator;

  constructor(page: Page) {
    this.page = page;

    this.locationDropdown = page.getByText('Địa điểm', { exact: true });
    this.locationPanel = page.getByRole('heading', { name: 'Tìm kiếm địa điểm' }).locator('xpath=..');
    this.dateTrigger = page.locator('text=/\\d{2}\\/\\d{2}\\/\\d{4}\\s*–\\s*\\d{2}\\/\\d{2}\\/\\d{4}/').first();
    this.guestDropdown = page.getByText('Thêm khách', { exact: true });
    this.searchButton = page.locator('img[alt="search"]').locator('xpath=..').first();
    this.roomItem = page.locator('a[href^="/room-detail/"], a[href^="/rooms/"]');
  }

  // Mở trang
  async goto() {
    await this.page.goto('https://demo5.cybersoft.edu.vn/');
    await this.page.waitForLoadState('networkidle');
    await this.locationDropdown.waitFor({ state: 'visible' });
  }

  async selectLocation(location: string) {
    await this.locationDropdown.click();
    const option = this.locationPanel.getByText(location, { exact: true }).first();
    await option.waitFor({ state: 'visible' });
    await option.click();
  }

  // Chọn ngày
  async selectDate(checkIn: string, checkOut: string) {
    await this.dateTrigger.click();
    const dayButton = (day: string) =>
      this.page.locator('.rdrDayNumber span').filter({ hasText: new RegExp(`^${day}$`) }).first();
    await dayButton(checkIn).click();
    await dayButton(checkOut).click();
  }

  // Chọn guest
  async selectGuest(target: number) {
    await this.guestDropdown.click();
    const plusBtn = this.page.getByRole('button', { name: '+' }).first();
    for (let i = 1; i < target; i++) {
      await plusBtn.click();
    }
  }

  // Click search
  async clickSearch() {
    if (await this.searchButton.count()) {
      await this.searchButton.click({ timeout: 5000 }).catch(() => {});
    }
    await this.page.waitForURL(/\/rooms\//, { timeout: 15000 }).catch(() => {});
  }

  async verifyRoomList() {
  await this.roomItem.first().waitFor({ state: 'visible' });

  const count = await this.roomItem.count();
  expect(count).toBeGreaterThan(0);
}

  // Full flow search
  async searchRoom(location: string, checkIn: string, checkOut: string, guest: string) {
    await this.selectLocation(location);
    await this.selectDate(checkIn, checkOut);
    await this.selectGuest(parseInt(guest));
    await this.clickSearch();
  }
}
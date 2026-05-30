import { Page, Locator } from '@playwright/test';

export class RoomListingPage {
  readonly page: Page;
  readonly searchBar: Locator;
  readonly searchBtn: Locator;
  readonly roomCardsContainer: Locator;
  readonly roomItems: Locator;

  readonly logoHome: Locator;
  readonly priceFilterBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.searchBar = page.getByText('Địa điểm', { exact: true });
    this.searchBtn = page.locator('img[alt="search"]').first();
    this.roomItems = page.locator('a[href^="/room-detail/"]');
    this.roomCardsContainer = page.locator('div').filter({ has: this.roomItems }).first();

    this.logoHome = page.getByRole('link', { name: /Cyber Logo|CyberSoft/i }).first();
    this.priceFilterBtn = page.getByRole('button', { name: 'Giá' });
  }

  firstRoomImage(): Locator {
    return this.roomItems.first().locator('img').first();
  }

  async goHomeViaLogo() {
    await this.logoHome.click();
    await this.page.waitForURL(/\/$/, { timeout: 15_000 });
  }

  async openPriceFilter(): Promise<boolean> {
    if ((await this.priceFilterBtn.count()) === 0) return false;
    await this.priceFilterBtn.click();
    return true;
  }

  async clickPaginationNextIfPresent(): Promise<boolean> {
    const next = this.page.getByRole('button', { name: /Next|›|Sau/i }).first();
    if ((await next.count()) === 0) return false;
    await next.click();
    await this.page.waitForTimeout(300);
    return true;
  }

  async goto() {
    await this.page.goto('https://demo5.cybersoft.edu.vn/rooms/ho-chi-minh');
    await this.roomItems.first().waitFor({ state: 'visible', timeout: 60_000 });
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async selectLocationAndSearch(locationName: string) {
    await this.searchBar.click();

    const locationPanel = this.page
      .getByRole('heading', { name: 'Tìm kiếm địa điểm' })
      .locator('xpath=..');
    const locationItem = locationPanel.getByText(locationName, { exact: true }).first();
    await locationItem.waitFor({ state: 'visible' });
    await locationItem.click();

    if (await this.searchBtn.count()) {
      await this.searchBtn.first().click({ timeout: 5000 }).catch(() => {});
    }
  }

  async clickFirstRoom() {
    await this.roomItems.first().click();
  }

  async getRoomCount(): Promise<number> {
    return await this.roomItems.count();
  }

  async openLocationPicker() {
    await this.searchBar.click();
  }
}

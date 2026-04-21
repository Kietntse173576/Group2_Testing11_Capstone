import { Page, Locator } from '@playwright/test';

export class RoomListingPage {
  readonly page: Page;
  readonly searchBar: Locator;
  readonly searchBtn: Locator;
  readonly roomItems: Locator;

  constructor(page: Page) {
    this.page = page;

    // Khu vực chọn địa điểm trên thanh tìm kiếm
    this.searchBar = page.getByText('Địa điểm', { exact: true });
    
    // Nút search trong thanh lọc
    this.searchBtn = page.locator('img[alt="search"]').first();

    // Mỗi phòng là 1 link sang trang chi tiết
    this.roomItems = page.locator('a[href^="/room-detail/"]');
  }

  async goto() {
    await this.page.goto('https://demo5.cybersoft.edu.vn/rooms/ho-chi-minh');
    await this.roomItems.first().waitFor({ state: 'visible' });
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Thực hiện luồng chọn địa điểm và nhấn search (Chỉ Click)
   */
  async selectLocationAndSearch(locationName: string) {
    // 1. Click vào thanh search để mở menu
    await this.searchBar.click();

    // 2. Click chọn địa điểm cụ thể từ danh sách gợi ý hiện ra
    // Tìm element chứa tên địa điểm (ví dụ: 'Hồ chí minh') và click
    const locationPanel = this.page
      .getByRole('heading', { name: 'Tìm kiếm địa điểm' })
      .locator('xpath=..');
    const locationItem = locationPanel.getByText(locationName, { exact: true }).first();
    await locationItem.waitFor({ state: 'visible' });
    await locationItem.click();

    // 3. Có layout tự động apply bộ lọc mà không có nút search rõ ràng
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
}
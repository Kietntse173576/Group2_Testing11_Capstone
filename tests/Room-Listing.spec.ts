import { test, expect } from '@playwright/test';
import { RoomListingPage } from '../pages/Room-listing';

test.describe('Danh sách phòng & tìm kiếm (luồng chỉ click)', () => {
  let roomPage: RoomListingPage;

  test.beforeEach(async ({ page }) => {
    roomPage = new RoomListingPage(page);
    await roomPage.goto();
  });

  test('TC_01 - Hiển thị ít nhất một phòng trên trang danh sách', async () => {
    const count = await roomPage.getRoomCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC_02 - Tìm phòng khi chọn địa điểm "Hồ Chí Minh"', async ({ page }) => {
    await roomPage.selectLocationAndSearch('Hồ Chí Minh');

    await expect(page).toHaveURL(/room-list|\/rooms\//);

    const countAfterSearch = await roomPage.getRoomCount();
    expect(countAfterSearch).toBeGreaterThan(0);
  });

  test('TC_03 - Chuyển sang trang chi tiết phòng khi bấm vào thẻ phòng', async ({ page }) => {
    await roomPage.clickFirstRoom();

    await expect(page).toHaveURL(/room-detail|phong-thue/);

    const bookingBtn = page.locator('button').filter({ hasText: /đặt phòng/i });
    await expect(bookingBtn).toBeVisible();
  });

  test('TC_04 - Thanh tìm kiếm và danh sách phòng hiển thị sau khi tải trang', async () => {
    await expect(roomPage.searchBar).toBeVisible();
    await expect(roomPage.roomCardsContainer).toBeVisible();
  });

  test('TC_05 - Hiện panel chọn địa điểm khi mở thanh tìm kiếm', async ({ page }) => {
    await roomPage.openLocationPicker();
    await expect(page.getByRole('heading', { name: 'Tìm kiếm địa điểm' })).toBeVisible();
  });

  test('TC_06 - Thẻ phòng đầu tiên hiển thị đúng', async () => {
    await expect(roomPage.roomItems.first()).toBeVisible();
  });

  test('TC_07 - Quay lại trang chủ qua logo', async ({ page }) => {
    await roomPage.goHomeViaLogo();
    await expect(page).toHaveURL(/^https:\/\/demo5\.cybersoft\.edu\.vn\/?$/);
  });
  
});

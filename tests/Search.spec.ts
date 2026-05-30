import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/Search';

test.describe('Tìm kiếm phòng', () => {
  test.beforeEach(async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.goto();
  });

  test('TC_S01 - Trang chủ hiển thị đủ ô địa điểm, ngày, khách và tìm kiếm', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await expect(searchPage.locationDropdown).toBeVisible();
    await expect(searchPage.dateDropdown).toBeVisible();
    await expect(searchPage.guestDropdown).toBeVisible();
    await expect(searchPage.searchButton).toBeVisible();
  });

  test('TC_S02 - Hiển thị lịch khi bấm ô ngày đến / đi', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.openCalendar();
    await expect(searchPage.calendarPanel).toBeVisible();
  });

  test('TC_S03 - Điều hướng tháng trước / sau trên lịch', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.openCalendar();
    await searchPage.goToNextMonth();
    await searchPage.goToPreviousMonth();
    await expect(searchPage.calendarPanel).toBeVisible();
  });

  test('TC_S04 - Ngày trong quá khứ bị vô hiệu trên lịch', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.openCalendar();
    expect(await searchPage.hasDisabledPastDays()).toBeTruthy();
  });

  test('TC_S05 - Tìm phòng với đầy đủ thông tin hợp lệ', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.selectLocation('Hồ Chí Minh');
    await searchPage.selectDate('20', '25');
    await searchPage.selectGuest(2);
    await searchPage.clickSearch();

    await expect(page).toHaveURL(/\/rooms\//);
    await searchPage.verifyRoomList();
  });

  test('TC_S06 - Tìm phòng với số khách khác nhau', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.selectLocation('Hồ Chí Minh');
    await searchPage.selectDate('20', '25');
    await searchPage.selectGuest(4);
    await searchPage.clickSearch();

    await expect(page).toHaveURL(/\/rooms\//);
    await searchPage.verifyRoomList();
  });

  test('TC_S07 - Tìm phòng với khoảng ngày khác', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.selectLocation('Hồ Chí Minh');
    await searchPage.selectDate('10', '15');
    await searchPage.selectGuest(2);
    await searchPage.clickSearch();

    await expect(page).toHaveURL(/\/rooms\//);
    await searchPage.verifyRoomList();
  });

  test('TC_S08 - Tìm theo tên thành phố với số khách tối thiểu', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.selectLocation('Hồ Chí Minh');
    await searchPage.selectDate('20', '25');
    await searchPage.selectGuest(1);
    await searchPage.clickSearch();

    await expect(page).toHaveURL(/\/rooms\//);
    expect(await searchPage.getRoomResultCount()).toBeGreaterThan(0);
  });

  test('TC_S09 - Chọn địa điểm rồi tìm (giữ ngày và khách mặc định)', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.selectLocation('Hồ Chí Minh');
    await searchPage.clickSearch();

    await expect(page).toHaveURL(/\/rooms\//);
    await searchPage.verifyRoomList();
  });

  test('TC_S10 - Chọn địa điểm từ danh sách gợi ý và hiển thị kết quả', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.selectLocation('Hồ Chí Minh');
    await searchPage.selectDate('12', '18');
    await searchPage.selectGuest(2);
    await searchPage.clickSearch();

    await expect(page).toHaveURL(/\/rooms\//);
    await searchPage.verifyRoomList();
  });

  test('TC_S11 - Điều chỉnh số khách tăng và giảm rồi tìm kiếm', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.selectLocation('Hồ Chí Minh');
    await searchPage.selectDate('20', '25');
    await searchPage.selectGuest(4);
    await searchPage.decreaseGuest(2);
    await searchPage.clickSearch();

    await expect(page).toHaveURL(/\/rooms\//);
    await searchPage.verifyRoomList();
  });

  test('TC_S12 - Luồng đầy đủ qua phương thức searchRoom', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.searchRoom('Hồ Chí Minh', '15', '20', '3');

    await expect(page).toHaveURL(/\/rooms\//);
    await searchPage.verifyRoomList();
  });

  test('TC_S13 - Báo lỗi khi chọn thành phố không tồn tại', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await expect(searchPage.selectLocation('__INVALID_CITY__')).rejects.toThrow(
      /Không tìm thấy location/,
    );
  });
});

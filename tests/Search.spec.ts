import { test } from '@playwright/test';
import { SearchPage } from '../pages/Search';

test.describe('Room Listing & Search', () => {

  test.beforeEach(async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.goto();
  });

  test('Search room valid data', async ({ page }) => {
    const searchPage = new SearchPage(page);

    await searchPage.selectLocation('Hồ Chí Minh');
    await searchPage.selectDate('20', '25');
    await searchPage.selectGuest(2);
    await searchPage.clickSearch();
    await searchPage.verifyRoomList();
  });

  test('Search with different guest number', async ({ page }) => {
    const searchPage = new SearchPage(page);

    await searchPage.selectLocation('Hồ Chí Minh');
    await searchPage.selectDate('20', '25');
    await searchPage.selectGuest(4);
    await searchPage.clickSearch();

    await searchPage.verifyRoomList();
  });

  test('Search with different date', async ({ page }) => {
    const searchPage = new SearchPage(page);

    await searchPage.selectLocation('Hồ Chí Minh');
    await searchPage.selectDate('10', '15');
    await searchPage.selectGuest(2);
    await searchPage.clickSearch();

    await searchPage.verifyRoomList();
  });

});
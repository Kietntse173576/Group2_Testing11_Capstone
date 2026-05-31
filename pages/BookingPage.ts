import { Page, Locator, expect } from "@playwright/test";

export class BookingPage {
  readonly page: Page;
  readonly openDatePickerBtn: Locator;
  readonly datePicker: Locator;
  readonly closeDataPickerBtn: Locator;
  readonly increaseGuestBtn: Locator;
  readonly bookingBtn: Locator;
  readonly message  :Locator
  

  constructor(page: Page) {
    this.page = page;

    this.openDatePickerBtn = page.locator('div.cursor-pointer:has-text("Nhận phòng")');
    this.datePicker = page.locator(".rdrCalendarWrapper");

    // ✅ FIX selector Close
    this.closeDataPickerBtn = page.getByRole("button", { name: "Close" });

    this.increaseGuestBtn = page.locator('button:has-text("+")').first();

    this.bookingBtn = page.locator('button:has-text("Đặt phòng")');
    this.message = page.locator(".ant-notification-notice-description").last();
  }

  async selectDate(checkIn: number, checkOut: number) {
  // click đúng element
  await this.openDatePickerBtn.click();

  // ✅ thêm timeout debug
  await this.page.waitForTimeout(1000);

  // đợi calendar
  await expect(this.datePicker).toBeVisible({ timeout: 10000 });

  const validDays = this.page.locator(
    ".rdrDay:not(.rdrDayDisabled):not(.rdrDayPassive)"
  );

  await validDays
    .filter({
      has: this.page.locator(".rdrDayNumber", {
        hasText: `${checkIn}`,
      }),
    })
    .first()
    .click();

  await validDays
    .filter({
      has: this.page.locator(".rdrDayNumber", {
        hasText: `${checkOut}`,
      }),
    })
    .first()
    .click();

  await this.page.keyboard.press("Escape");
}

  async increaseGuest(count: number) {
    for (let i = 0; i < count; i++) {
      await this.increaseGuestBtn.click();
    }
  }

  async clickBooking() {
    await expect(this.bookingBtn).toBeVisible();
    await expect(this.bookingBtn).toBeEnabled();

    await this.bookingBtn.scrollIntoViewIfNeeded();
    await this.bookingBtn.click();
  }

  async closeDatePicker() {
    if (await this.closeDataPickerBtn.isVisible()) {
      await this.closeDataPickerBtn.click();
    }
  }

  async confirmBooking() {
  const modal = this.page.locator(".ant-modal-content:visible");
  const message = this.page.locator(".ant-message");

 
  await this.page.waitForTimeout(2000);

  if (await modal.count()) {
    const confirmBtn = modal.getByRole("button", { name: "Xác nhận" });
    await confirmBtn.click();
    return;
  }

  if (await message.count()) {
    const text = await message.innerText();
    throw new Error("Booking failed: " + text);
  }


;
}
 
  
}
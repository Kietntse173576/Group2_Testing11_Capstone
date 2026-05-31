import { Locator, Page } from '@playwright/test'

export class RoomListingPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async navigate(): Promise<void> {
    await this.page.goto('/')
  }

  async getRoomCards(): Promise<Locator[]> {
    return await this.page.locator('[class*="room-card"]').all()
  }

  async clickRoomCard(index: number): Promise<void> {
    const cards = await this.getRoomCards()
    if (index < cards.length) {
      await cards[index].click()
    }
  }
}

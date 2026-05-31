import { Locator, Page } from '@playwright/test'

export class SearchPage {
  readonly page: Page
  readonly searchInput: Locator
  readonly searchButton: Locator

  constructor(page: Page) {
    this.page = page
    this.searchInput = page.locator('[placeholder*="search"], [placeholder*="tìm"]', {
      ignoreCase: true
    })
    this.searchButton = page.locator('button:has-text("Tìm"), button:has-text("Search")')
  }

  async search(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword)
    await this.searchButton.click()
    await this.page.waitForLoadState('networkidle')
  }

  async getSearchResults(): Promise<Locator[]> {
    return await this.page.locator('[class*="result"], [class*="room"]').all()
  }
}

import { Locator, Page } from '@playwright/test'
import { highlightStep } from '../tests/utils/highlightStep'

export class RoomDetailPage {
  readonly page: Page

  readonly ratingStars: Locator
  readonly commentInput: Locator
  readonly submitBtn: Locator

  constructor(page: Page) {
    this.page = page

    this.ratingStars = page.locator('ul.ant-rate li.ant-rate-star')
    this.commentInput = page.locator('textarea#noiDung')
    this.submitBtn = page.locator('button:has-text("Đánh giá")')
  }



async goToRoomDetail(): Promise<void> {
    // Bước 1: Click "Toàn bộ nhà"
    const toanBoNhaImg = this.page.locator('img[src*="mjwqhra4wbzlvoo2pe27"]')
    await toanBoNhaImg.waitFor({ state: 'visible', timeout: 10000 })
    await highlightStep(this.page, toanBoNhaImg, 200)
    await toanBoNhaImg.click()

    await this.page.waitForTimeout(2000)


    const roomCardLink = this.page.getByRole('link', {
        name: /Phòng sang trọng với ban công tại D\.1/
    }).first()

    await roomCardLink.waitFor({ state: 'visible', timeout: 15000 })
    await highlightStep(this.page, roomCardLink, 200)
    await roomCardLink.click()

  
    await this.page.waitForLoadState('networkidle', { timeout: 20000 })
}

  async chonSoSao(soSao: 1 | 2 | 3 | 4 | 5): Promise<void> {
    const starItem = this.ratingStars.nth(soSao - 1)
    const starSecond = starItem.locator('.ant-rate-star-second')
    await highlightStep(this.page, starSecond, 200)
    await starSecond.click()


    const selectedStars = this.page.locator('li.ant-rate-star-full')
    await selectedStars.nth(soSao - 1).waitFor({ state: 'visible', timeout: 5000 })
  }

  async danhGia(soSao: 1 | 2 | 3 | 4 | 5, noiDung: string): Promise<void> {
    await this.chonSoSao(soSao)

    await highlightStep(this.page, this.commentInput, 200)
    await this.commentInput.fill(noiDung)

    await highlightStep(this.page, this.submitBtn, 200)
    await this.submitBtn.click()
  }
}
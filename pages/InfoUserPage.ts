import { Locator, Page } from '@playwright/test'
import { join } from 'node:path'
import { highlightStep } from '../tests/utils/highlightStep'

export class InfoUserPage {
  readonly page: Page

  // Upload avatar
  readonly uploadFileInput: Locator
  readonly uploadAvatarBtn: Locator
  readonly capNhatAnhBtn: Locator

  // Chỉnh sửa hồ sơ
  readonly chinhSuaHoSoBtn: Locator
  readonly editModal: Locator
  readonly emailInput: Locator
  readonly nameInput: Locator
  readonly phoneInput: Locator
  readonly birthdayInput: Locator
  readonly capNhatBtn: Locator

  constructor(page: Page) {
    this.page = page


    this.uploadFileInput = page.locator('input[type="file"].ant-input')
    this.uploadAvatarBtn = page.locator('button:has-text("Upload Avatar")')
    this.capNhatAnhBtn = page.locator('button:has-text("Cập nhật ảnh")')


    this.chinhSuaHoSoBtn = page.locator('button:has-text("Chỉnh sửa hồ sơ")')
    this.editModal = page.locator('.ant-modal-content').filter({
      has: page.locator('.ant-modal-title', { hasText: 'Chỉnh sửa hồ sơ' })
    })

 
    this.emailInput = this.editModal.locator('#email')
    this.nameInput = this.editModal.locator('#name')
    this.phoneInput = this.editModal.locator('#phone')
    this.birthdayInput = this.editModal.locator('#birthday')
    this.capNhatBtn = this.editModal.locator('button:has-text("Cập nhật")')
  }

  async goToDashboard(): Promise<void> {
    const avatarBtn = this.page.locator('#user-menu-button')
    await highlightStep(this.page, avatarBtn, 200)
    await avatarBtn.click()

    const dashboardLink = this.page.locator('a[href="/info-user"]:has-text("Dashboard")')
    await highlightStep(this.page, dashboardLink, 200)
    await dashboardLink.click()

    await this.page.waitForURL(/\/info-user/, { timeout: 10000 })
  }

  async uploadAvatar(fileName: string): Promise<void> {
    await highlightStep(this.page, this.capNhatAnhBtn, 200)
    await this.capNhatAnhBtn.click()

    await this.uploadFileInput.waitFor({ state: 'visible', timeout: 10000 })

    const filePath = join(__dirname, '..', 'tests', 'data', fileName)
    await this.uploadFileInput.setInputFiles(filePath)
    await this.page.waitForTimeout(1000)

    await highlightStep(this.page, this.uploadAvatarBtn, 200)
    await this.uploadAvatarBtn.click()
  }

  async openChinhSuaHoSo(): Promise<void> {
    await highlightStep(this.page, this.chinhSuaHoSoBtn, 200)
    await this.chinhSuaHoSoBtn.click()


    await this.editModal.waitFor({ state: 'visible', timeout: 10000 })
  }

  async chonGioiTinh(gioiTinh: 'Nam' | 'Nữ'): Promise<void> {
    const selectWrapper = this.editModal.locator('.ant-select').filter({
      has: this.page.locator('#gender')
    })
    await highlightStep(this.page, selectWrapper, 200)
    await selectWrapper.click()

    await this.page.waitForSelector('.ant-select-dropdown', { state: 'visible', timeout: 10000 })

    const option = this.page.locator('.ant-select-item-option-content')
      .filter({ hasText: gioiTinh })
      .first()
    await highlightStep(this.page, option, 200)
    await option.click()
  }

  async chonNgaySinh(ngay: string): Promise<void> {
    await this.birthdayInput.click()
    await this.page.waitForSelector('.ant-picker-dropdown', { state: 'visible' })
    await this.birthdayInput.fill(ngay)
    await this.page.keyboard.press('Enter')
  }

  async fillChinhSuaHoSo(data: {
    name?: string
    phone?: string
    birthday?: string
    gioiTinh?: 'Nam' | 'Nữ'
  }): Promise<void> {
    if (data.name !== undefined) {
      await highlightStep(this.page, this.nameInput, 200)
      await this.nameInput.clear()
      await this.nameInput.fill(data.name)
    }

    if (data.phone !== undefined) {
      await highlightStep(this.page, this.phoneInput, 200)
      await this.phoneInput.clear()
      await this.phoneInput.fill(data.phone)
    }

    if (data.birthday !== undefined) {
      await this.chonNgaySinh(data.birthday)
    }

    if (data.gioiTinh !== undefined) {
      await this.chonGioiTinh(data.gioiTinh)
    }
  }

  async submitChinhSua(): Promise<void> {
    await highlightStep(this.page, this.capNhatBtn, 200)
    await this.capNhatBtn.click()
  }
}
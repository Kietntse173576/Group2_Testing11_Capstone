
import { expect, Locator, Page } from '@playwright/test'

export class AdminPage {
  readonly page: Page

  readonly sidebarMenu: Locator
  readonly userManagementMenu: Locator
  readonly locationManagementMenu: Locator
  readonly roomManagementMenu: Locator
  readonly bookingManagementMenu: Locator
  readonly addUserBtn: Locator

  readonly addLocationBtn: Locator

  constructor(page: Page) {
    this.page = page

    this.sidebarMenu = this.page.locator('ul[role="menu"]')
    this.userManagementMenu = this.page.getByRole('link', { name: 'Quản lý người dùng' })
    this.locationManagementMenu = this.page.getByRole('link', { name: 'Quản lý vị trí' })
    this.roomManagementMenu = this.page.getByRole('link', { name: 'Quản lý Room' })
    this.bookingManagementMenu = this.page.getByRole('link', { name: 'Quản lý Booking' })

    this.addUserBtn = this.page.getByRole('button', { name: /\+ Thêm người dùng/i })

    this.addLocationBtn = this.page.getByRole('button', { name: /\+ Thêm vị trí mới/i })
  }

  async goToLastPage() {
    const lastPageItem = this.page.locator('li.ant-pagination-item[title]').last()

    const isAlreadyActive = await lastPageItem.evaluate(el =>
      el.classList.contains('ant-pagination-item-active')
    )

    if (!isAlreadyActive) {
      await lastPageItem.click()

      await this.page.waitForFunction(() => {
        const active = document.querySelector('.ant-pagination-item-active')
        const all = document.querySelectorAll('li.ant-pagination-item[title]')
        const last = all[all.length - 1]
        return active && last && active === last
      }, { timeout: 10000 })
    }
  }

  async clickEditBtnByEmail(email: string) {
    const modal = this.page.locator('.ant-modal-content')
    await modal.waitFor({ state: 'hidden', timeout: 10000 })

    await this.goToLastPage()
    await this.page.waitForSelector('table', { state: 'visible' })

    const row = this.page.locator('tbody tr').filter({ hasText: email })
    await row.waitFor({ state: 'visible', timeout: 10000 })

    const editBtn = row.locator('button[aria-label="Actions"]')
    await editBtn.click()
  }

// ✅ DELETE USER - viết lại hoàn toàn
// async deleteAnyUser() {
//     // Chờ bảng load xong
//     await this.page.waitForSelector('tbody tr', { state: 'visible' })
  
//     // Lấy row đầu tiên
//     const firstRow = this.page.locator('tbody tr').first()
//     await firstRow.waitFor({ state: 'visible' })
  
//     // Click nút xoá (biểu tượng thùng rác)
//     const deleteBtn = firstRow.locator('button[aria-label="Delete"]')
//     await deleteBtn.waitFor({ state: 'visible' })
//     await deleteBtn.click()
  
//     // Chờ popup xuất hiện
//     const popup = this.page.locator('[role="dialog"].ant-modal')
//     await popup.waitFor({ state: 'visible', timeout: 10000 })
  
//     // Click nút xác nhận Xoá (màu xanh, class bg-main)
//     const confirmBtn = popup.locator('button.bg-main')
//     await confirmBtn.waitFor({ state: 'visible', timeout: 5000 })
//     await confirmBtn.click()
  
//     // Chờ popup đóng
//     await popup.waitFor({ state: 'hidden', timeout: 15000 })
  
//     // Chờ bảng render lại
//     await this.page.waitForSelector('tbody tr', { state: 'visible', timeout: 10000 })
//   }


async deleteAnyUser() {
  await this.page.waitForSelector('tbody tr', { state: 'visible' })

  const firstRow = this.page.locator('tbody tr').first()
  await firstRow.waitFor({ state: 'visible' })

  const deleteBtn = firstRow.locator('button[aria-label="Delete"]')
  await deleteBtn.waitFor({ state: 'visible' })
  await deleteBtn.click()

  // ✅ Thử cả modal lẫn popconfirm
  const popup = this.page.locator('.ant-modal-content, .ant-popover-content').first()
  await popup.waitFor({ state: 'visible', timeout: 10000 })

  const confirmBtn = popup.locator('button.bg-main, button:has-text("Xác nhận"), button:has-text("OK")').first()
  await confirmBtn.waitFor({ state: 'visible', timeout: 5000 })
  await confirmBtn.click()

  await popup.waitFor({ state: 'hidden', timeout: 15000 })
  await this.page.waitForSelector('tbody tr', { state: 'visible', timeout: 10000 })
}
}
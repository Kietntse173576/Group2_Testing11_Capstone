// import { test, expect } from './fixtures/adminFixture'
// import { AddLocationPage } from '../pages/AddLocationPage'
// import { AdminPage } from '../pages/AdminPage'

// test.describe('Admin - Quản lý vị trí', () => {

//   test('TC1: Truy cập trang quản lý vị trí', async ({ page, adminPage }) => {
//     await adminPage.locationManagementMenu.click()
//     await expect(page).toHaveURL(/\/admin\/location/)
//     await expect(adminPage.addLocationBtn).toBeVisible()
//   })

//   test('TC2: Thêm vị trí mới thành công', async ({ page, adminPage }) => {
//     const addLocationPage = new AddLocationPage(page)

//     await adminPage.locationManagementMenu.click()
//     await page.waitForLoadState("networkidle")
//     await adminPage.addLocationBtn.click()
//     await page.waitForSelector(".ant-modal-content", { timeout: 10000 })

//     await addLocationPage.fillAllAndSubmit({
//       tenViTri: "Văn phòng Hà Nội",
//       tinhThanh: "Hà Nội",
//       quocGia: "Việt Nam",
//       fileName: "location.jpg",
//     })

//     const uploadFileCount = await addLocationPage.fileInput.evaluate((el) => {
//       const input = el as HTMLInputElement
//       return input.files ? input.files.length : 0
//     })
//     expect(uploadFileCount).toBeGreaterThan(0)
//   })
//   test("TC3: BUG - không có quyền cập nhật vị trí", async ({ page, adminPage }) => {

//     const addLocationPage = new AddLocationPage(page)
  
//     await adminPage.locationManagementMenu.click()
//     await addLocationPage.clickEditBtn(0)
  
//     await addLocationPage.fillUpdateAndSubmit({
//       tenViTri: "Vị trí đã cập nhật",
//       tinhThanh: "Hồ Chí Minh",
//       quocGia: "Việt Nam",
//       fileName: "location.jpg",
//     })
  
//     // BUG expected: không update thành công
//     await expect(page.locator('.ant-message, .error, .toast')).toBeVisible()
//   })

//   test("TC4: Xoá vị trí bất kỳ thành công", async ({ page, adminPage }) => {
//     await adminPage.locationManagementMenu.click()
//     await page.waitForLoadState("networkidle")
  
//     const firstRow = page.locator('tbody tr').first()
//     await firstRow.waitFor({ state: 'visible' })
  
//     const rowText = await firstRow.innerText()
  
//     // FIX: locator linh hoạt hơn
//     const deleteBtn = firstRow.locator('button, svg, [role="button"]').last()
//     await deleteBtn.waitFor({ state: 'visible' })
  
//     await deleteBtn.click()
  
//     await page.waitForTimeout(1000)
  
//     await expect(
//       page.locator('tbody tr').filter({ hasText: rowText })
//     ).toHaveCount(0)
//   })
// })



import { test, expect } from './fixtures/adminFixture'
import { AddLocationPage } from '../pages/AddLocationPage'
import { CsvRow, readCsv } from './utils/readCsv'

test.describe('Admin - Quản lý vị trí', () => {

  test('TC1: Truy cập trang quản lý vị trí', async ({ page, adminPage }) => {
    await adminPage.locationManagementMenu.click()
    await expect(page).toHaveURL(/\/admin\/location/)
    await expect(adminPage.addLocationBtn).toBeVisible()
  })

  test('TC2: Thêm vị trí mới thành công', async ({ page, adminPage }) => {
    const addLocationPage = new AddLocationPage(page)

    await adminPage.locationManagementMenu.click()
    // await page.waitForLoadState("networkidle")
    await page.waitForLoadState("domcontentloaded")
    await adminPage.addLocationBtn.click()
    await page.waitForSelector(".ant-modal-content", { timeout: 10000 })

    await addLocationPage.fillAllAndSubmit({
      tenViTri: "Văn phòng Hà Nội",
      tinhThanh: "Hà Nội",
      quocGia: "Việt Nam",
      fileName: "location.jpg",
    })

    const uploadFileCount = await addLocationPage.fileInput.evaluate((el) => {
      const input = el as HTMLInputElement
      return input.files ? input.files.length : 0
    })
    expect(uploadFileCount).toBeGreaterThan(0)
  })

 // ✅ TC3: Data-driven cập nhật vị trí
const updateDatas: CsvRow[] = readCsv('tests/data/location_update_data.csv')

for (const testData of updateDatas) {
  const title = `TC3: Cập nhật vị trí | tenViTri=${testData.tenViTri} => ${testData.expectedResult}`
  const isBug = testData.expectedResult === 'fail'

  test(title, async ({ page, adminPage }) => {
    test.setTimeout(35000)  // ← sửa ở đây
    if (isBug) test.fail()

    const addLocationPage = new AddLocationPage(page)

    await adminPage.locationManagementMenu.click()
    // await page.waitForLoadState("networkidle")
    await page.waitForLoadState("domcontentloaded")
    await addLocationPage.clickEditBtn(0)
    await expect(page.locator('p:has-text("Cập nhật vị trí")')).toBeVisible()

    await addLocationPage.fillUpdateAndSubmit({
      tenViTri: testData.tenViTri,
      tinhThanh: testData.tinhThanh,
      quocGia: testData.quocGia,
      fileName: testData.fileName,
    })

    await page.waitForTimeout(2000)
    await expect(page.locator('.ant-modal-content')).toBeHidden({ timeout: 5000 })
  })
}
  
  const deleteDatas: CsvRow[] = readCsv('tests/data/location_delete_data.csv')

  for (const testData of deleteDatas) {
    const title = `TC4: Xoá vị trí bất kỳ => ${testData.expectedResult}`
    const isBug = testData.expectedResult === 'fail'

    test(title, async ({ page, adminPage }) => {
      if (isBug) test.fail()

      await adminPage.locationManagementMenu.click()
      // await page.waitForLoadState("networkidle")
      await page.waitForLoadState("domcontentloaded")

      const firstRow = page.locator('tbody tr').first()
      await firstRow.waitFor({ state: 'visible' })
      const rowText = await firstRow.innerText()

      const deleteBtn = firstRow.locator('button[aria-label="Delete"]')
      await deleteBtn.waitFor({ state: 'visible' })
      await deleteBtn.click()

      const popup = page.locator('.ant-modal-content')
      await popup.waitFor({ state: 'visible', timeout: 10000 })
      await expect(popup.locator('p:has-text("Xác nhận xoá Vị trí")')).toBeVisible()

      await popup.locator('button.bg-main').click()
      await page.waitForTimeout(2000)


      await expect(page.locator('tbody tr').filter({ hasText: rowText })).toHaveCount(0)
    })
  }
})
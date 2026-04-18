// import { Locator, Page } from "@playwright/test";
// import { join } from "node:path";

// export class AddLocationPage {
//   readonly page: Page;

//   // Locators
//   readonly tenViTriInput: Locator;
//   readonly tinhThanhInput: Locator;
//   readonly quocGiaInput: Locator;
//   readonly uploadImageLabel: Locator;
//   readonly fileInput: Locator;
//   readonly submitBtn: Locator;

//   constructor(page: Page) {
//     this.page = page;

//     this.tenViTriInput = page.locator("#tenViTri");
//     this.tinhThanhInput = page.locator("#tinhThanh");
//     this.quocGiaInput = page.locator("#quocGia");
//     this.uploadImageLabel = page.locator('label[for="hinhAnhVitri"]');
//     this.fileInput = page.locator("#hinhAnhVitri");
//     this.submitBtn = page.locator('button:has-text("Thêm mới")');
//   }

//   async fillTenViTri(tenViTri: string): Promise<void> {
//     await this.tenViTriInput.waitFor({ state: "visible", timeout: 10000 });
//     await this.tenViTriInput.fill(tenViTri);
//   }

//   async fillTinhThanh(tinhThanh: string): Promise<void> {
//     await this.tinhThanhInput.waitFor({ state: "visible", timeout: 10000 });
//     await this.tinhThanhInput.fill(tinhThanh);
//   }

//   async fillQuocGia(quocGia: string): Promise<void> {
//     await this.quocGiaInput.waitFor({ state: "visible", timeout: 10000 });
//     await this.quocGiaInput.fill(quocGia);
//   }

//   async uploadHinhAnh(fileName: string): Promise<void> {
//     const filePath = join(__dirname, "..", "tests", "data", fileName);

//     // Nếu input bị hidden, dùng setInputFiles trực tiếp (không cần click label)
//     await this.fileInput.setInputFiles(filePath);
//     await this.page.waitForTimeout(3000); // chờ upload xong
//   }

//   async clickSubmit(): Promise<void> {
//     await this.submitBtn.waitFor({ state: "visible", timeout: 10000 });
//     await this.submitBtn.click();
//   }

//   async fillAllAndSubmit(data: {
//     tenViTri: string;
//     tinhThanh: string;
//     quocGia: string;
//     fileName: string;
//   }): Promise<void> {
//     await this.fillTenViTri(data.tenViTri);
//     await this.fillTinhThanh(data.tinhThanh);
//     await this.fillQuocGia(data.quocGia);
//     await this.uploadHinhAnh(data.fileName);
//     await this.clickSubmit();
//   }
// }


import { Locator, Page } from "@playwright/test";
import { join } from "node:path";

export class AddLocationPage {
  readonly page: Page;

  // Locators - Thêm mới
  readonly tenViTriInput: Locator;
  readonly tinhThanhInput: Locator;
  readonly quocGiaInput: Locator;
  readonly uploadImageLabel: Locator;
  readonly fileInput: Locator;
  readonly submitBtn: Locator;

  // Locators - Cập nhật
  readonly changeImageLabel: Locator;
  readonly fileInputUpdate: Locator;
  readonly tenViTriUpdateInput: Locator;
  readonly tinhThanhUpdateInput: Locator;
  readonly quocGiaUpdateInput: Locator;
  readonly updateBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    // Form thêm mới
    this.tenViTriInput = page.locator("#tenViTri");
    this.tinhThanhInput = page.locator("#tinhThanh");
    this.quocGiaInput = page.locator("#quocGia");
    this.uploadImageLabel = page.locator('label[for="hinhAnhVitri"]');
    this.fileInput = page.locator("#hinhAnhVitri");
    this.submitBtn = page.locator('button:has-text("Thêm mới")');

    // Form cập nhật
    this.changeImageLabel = page.locator('label[for="hinhVitriUpdate"]');
    this.fileInputUpdate = page.locator("#hinhVitriUpdate");
    this.tenViTriUpdateInput = page.locator('.ant-modal-content #tenViTri');
    this.tinhThanhUpdateInput = page.locator('.ant-modal-content #tinhThanh');
    this.quocGiaUpdateInput = page.locator('.ant-modal-content #quocGia');
    this.updateBtn = page.locator('button:has-text("Cập nhật")');
  }

  // ===== THÊM MỚI =====
  async fillTenViTri(tenViTri: string): Promise<void> {
    await this.tenViTriInput.waitFor({ state: "visible", timeout: 10000 });
    await this.tenViTriInput.fill(tenViTri);
  }

  async fillTinhThanh(tinhThanh: string): Promise<void> {
    await this.tinhThanhInput.waitFor({ state: "visible", timeout: 10000 });
    await this.tinhThanhInput.fill(tinhThanh);
  }

  async fillQuocGia(quocGia: string): Promise<void> {
    await this.quocGiaInput.waitFor({ state: "visible", timeout: 10000 });
    await this.quocGiaInput.fill(quocGia);
  }

  async uploadHinhAnh(fileName: string): Promise<void> {
    const filePath = join(__dirname, "..", "tests", "data", fileName);
    await this.fileInput.setInputFiles(filePath);
    await this.page.waitForTimeout(3000);
  }

  async clickSubmit(): Promise<void> {
    await this.submitBtn.waitFor({ state: "visible", timeout: 10000 });
    await this.submitBtn.click();
  }

  async fillAllAndSubmit(data: {
    tenViTri: string;
    tinhThanh: string;
    quocGia: string;
    fileName: string;
  }): Promise<void> {
    await this.fillTenViTri(data.tenViTri);
    await this.fillTinhThanh(data.tinhThanh);
    await this.fillQuocGia(data.quocGia);
    await this.uploadHinhAnh(data.fileName);
    await this.clickSubmit();
  }

  // ===== CẬP NHẬT =====
  async clickEditBtn(index: number = 0): Promise<void> {
    const editBtns = this.page.locator('button[aria-label="Actions"]');
    await editBtns.nth(index).waitFor({ state: "visible", timeout: 10000 });
    await editBtns.nth(index).click();
    await this.page.waitForSelector('.ant-modal-content', { timeout: 10000 });
  }

  async updateHinhAnh(fileName: string): Promise<void> {
    const filePath = join(__dirname, "..", "tests", "data", fileName);
    await this.fileInputUpdate.setInputFiles(filePath);
    await this.page.waitForTimeout(3000);
  }

  async fillUpdateAndSubmit(data: {
    tenViTri?: string;
    tinhThanh?: string;
    quocGia?: string;
    fileName?: string;
  }): Promise<void> {
    await this.tenViTriUpdateInput.waitFor({ state: "visible", timeout: 10000 });

    if (data.tenViTri) {
      await this.tenViTriUpdateInput.clear();
      await this.tenViTriUpdateInput.fill(data.tenViTri);
    }

    if (data.tinhThanh) {
      await this.tinhThanhUpdateInput.clear();
      await this.tinhThanhUpdateInput.fill(data.tinhThanh);
    }

    if (data.quocGia) {
      await this.quocGiaUpdateInput.clear();
      await this.quocGiaUpdateInput.fill(data.quocGia);
    }

    if (data.fileName) {
      await this.updateHinhAnh(data.fileName);
    }

    await this.updateBtn.waitFor({ state: "visible", timeout: 10000 });
    await this.updateBtn.click();
  }
}
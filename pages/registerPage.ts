import { Locator, Page, expect } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;

  // Header
  readonly userIcon: Locator;

  // Popup
  readonly registerButtonInPopup: Locator;

  // Form
  readonly registerForm: Locator;
  readonly modalTitle: Locator;
  readonly loginModalTitle: Locator; // ✅ thêm

  // Inputs
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly phoneInput: Locator;
  readonly birthdayInput: Locator;
  readonly genderSelect: Locator;

  // Submit
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // ===== User icon =====
    this.userIcon = page.locator('nav button').filter({
      has: page.locator('img')
    }).first();

    // ===== Button "Đăng ký" =====
    this.registerButtonInPopup = page.locator('button')
      .filter({ hasText: 'Đăng ký' })
      .first();

    // ===== Form =====
    this.registerForm = page.locator('.ant-form.ant-form-vertical');

    this.modalTitle = page.getByRole('heading', {
      name: 'Đăng ký tài khoản'
    });

    // ✅ thêm locator cho login modal
    this.loginModalTitle = page.getByRole('heading', {
      name: 'Đăng nhập'
    });

    // ===== Inputs =====
    this.nameInput = this.registerForm.getByRole('textbox', { name: 'Name' });
    this.emailInput = this.registerForm.getByRole('textbox', { name: 'Email' });
    this.passwordInput = this.registerForm.getByRole('textbox', { name: 'Password' });
    this.phoneInput = this.registerForm.getByRole('textbox', { name: 'Phone number' });

    this.birthdayInput = this.registerForm.locator('#birthday');

    // ===== Gender =====
    this.genderSelect = this.registerForm.locator('.ant-select[name="gender"]');

    // ===== Submit =====
    this.submitButton = this.registerForm.locator('button[type="submit"]');
  }

  // ===== Open form =====
  async openRegisterForm() {
    await this.page.goto('https://demo5.cybersoft.edu.vn/');

    await expect(this.userIcon).toBeVisible();
    await this.userIcon.click();

    await expect(this.registerButtonInPopup).toBeVisible();
    await this.registerButtonInPopup.click();

    await expect(this.registerForm).toBeVisible();
  }

  // ===== Fill form =====
  async fillForm(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    birthday: string;
    gender?: 'male' | 'female';
  }) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.phoneInput.fill(data.phone);

    // ===== Birthday =====
    await this.birthdayInput.click();

    const day = data.birthday.split('-')[2];

    const dayCell = this.page.locator('.ant-picker-cell')
      .filter({ hasText: new RegExp(`^${day}$`) })
      .first();

    await expect(dayCell).toBeVisible();
    await dayCell.click();

    // ===== Gender =====
    if (data.gender) {
      await this.genderSelect.click();

      const genderText = data.gender === 'male' ? 'Nam' : 'Nữ';

      const dropdown = this.page.locator('.ant-select-dropdown:visible');

      await expect(dropdown).toBeVisible();
      await dropdown.getByText(genderText, { exact: true }).click();
    }
  }

  // ===== Submit =====
  async submit() {
    await this.submitButton.click();
  }

  // ===== Full flow =====
  async register(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    birthday: string;
    gender?: 'male' | 'female';
  }) {
    await this.openRegisterForm();
    await this.fillForm(data);
    await this.submit();
  }

  // ❌ không dùng nữa nhưng giữ lại nếu cần
  async isRegisterSuccess(): Promise<boolean> {
    try {
      await this.page.waitForURL(/login/i, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}
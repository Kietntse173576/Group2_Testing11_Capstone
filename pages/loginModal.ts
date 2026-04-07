import { Location, Locator, Page } from '@playwright/test'

export class LoginModal {
    readonly page: Page

    // popup login
    readonly modal: Locator

    readonly emailInput: Locator
    readonly passwordInput: Locator
    readonly loginBtn: Locator

    constructor(page: Page) {
        this.page = page
        this.modal = this.page.locator('.ant-modal-content')
        this.emailInput = this.modal.locator('#email')
        // cách 2: tìm theo attribute name
        // this.emailInput = this.modal.locator('input[name="email"]')
        this.passwordInput = this.modal.locator('#password')
        // cách 2: getByRole
        // this.passwordInput = this.modal.getByRole('textbox', {name: 'Password'})
        this.loginBtn = this.modal.getByRole('button', {name: 'Đăng nhập'})
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email)
        await this.passwordInput.fill(password)
        await this.loginBtn.click()
    }
}
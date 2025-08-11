export class TextBoxPage {
  constructor(page) {
    this.page = page;
    this.nameInput = page.locator('#userName');
    this.emailInput = page.locator('#userEmail');
    this.currentAddressInput = page.locator('#currentAddress');
    this.permanentAddressInput = page.locator('#permanentAddress');
    this.submitButton = page.locator('#submit');
    this.output = page.locator('#output');
  }

  async goto() {
    await this.page.goto('/text-box');
  }

  async fillForm(name, email, currentAddress, permanentAddress) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.currentAddressInput.fill(currentAddress);
    await this.permanentAddressInput.fill(permanentAddress);
  }

  async submit() {
    await this.submitButton.click();
  }

  async getOutputText() {
    return await this.output.textContent();
  }
}
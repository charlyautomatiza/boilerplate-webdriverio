/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage {
    /**
     * define selectors using getter methods
     */
    public get loginBtn () {
        return $('~Login');
    }

    public get inputUsername () {
        return $('~input-email');
    }

    public get inputPassword () {
        return $('~input-password');
    }

    public get btnSubmit () {
        // The login form lives in a ScrollView. On shorter screens the button
        // sits outside the viewport, and UiAutomator2 does not expose
        // off-screen elements, so scroll it into view first.
        return $(
            'android=new UiScrollable(new UiSelector().scrollable(true))' +
            '.scrollIntoView(new UiSelector().description("button-LOGIN"))'
        );
    }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    public async login (username: string, password: string) {
        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);
        await this.btnSubmit.click();
    }
}

export default new LoginPage();

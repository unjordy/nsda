const data = require("./data");

describe("data handling", () => {
    describe("email field validation", () => {
        test("validates a simple email", () =>
             expect(
                 data.validateEmail({email: "valid@example.org"}).email
             ).toBeTruthy());

        test("validates a multi-level domain", () =>
             expect(
                 data.validateEmail({email: "user@what.hello.com"}).email
             ).toBeTruthy());

        test("invalidates a local user", () =>
             expect(
                 data.validateEmail({email: "localuser"}).email
             ).toBeFalsy());

        test("invalidates null", () => {
            expect(
                data.validateEmail({email: "null"}).email
            ).toBeFalsy();

            expect(
                data.validateEmail({email: null}).email
            ).toBeFalsy();
        });

        test("invalidates undefined", () => {
            expect(
                data.validateEmail({email: "undefined"}).email
            ).toBeFalsy();

            expect(
                data.validateEmail({}).email
            ).toBeFalsy();
        });
    });

    describe("fill falsy fields with N/A", () => {
        test("with no falsy fields", () => {
            const fields = data.fillNull({
                firstName: "John",
                lastName: "Smith",
                phone: "123-456-7890",
                email: "john@example.com"
            });

            expect(fields.firstName).toBe("John");
            expect(fields.lastName).toBe("Smith");
            expect(fields.phone).toBe("123-456-7890");
            expect(fields.email).toBe("john@example.com");
        });

        test("with missing fields", () => {
            const fields = data.fillNull({
                firstName: "John"
            });

            expect(fields.firstName).toBe("John");
            expect(fields.lastName).toBe("N/A");
            expect(fields.phone).toBe("N/A");
            expect(fields.email).toBe("N/A");
        });
    });

    describe("name normalization", () => {
        test("handles separate first/last names", () => {
            const fields = data.normalizeNames({
                firstName: "John",
                lastName: "Smith",
                phone: "123-456-7890",
                email: "john@example.com"
            });

            expect(fields.firstName).toBe("John");
            expect(fields.lastName).toBe("Smith");
            expect(fields.phone).toBe("123-456-7890");
            expect(fields.email).toBe("john@example.com");
        });

        test("splits a firstName field", () => {
            const fields = data.normalizeNames({
                firstName: "John Smith"
            });

            expect(fields.firstName).toBe("John");
            expect(fields.lastName).toBe("Smith");
        });

        test("splits a lastName field", () => {
            const fields = data.normalizeNames({
                firstName: "Johnny BeGood"
            });

            expect(fields.firstName).toBe("Johnny");
            expect(fields.lastName).toBe("BeGood");
        });

        test("handles multi-word last names", () => {
            const twofield = data.normalizeNames({
                firstName: "Guido",
                lastName: "van Rossum"
            });

            expect(twofield.firstName).toBe("Guido");
            expect(twofield.lastName).toBe("van Rossum");

            const onefield = data.normalizeNames({
                firstName: "Guido van Rossum"
            });

            expect(onefield.firstName).toBe("Guido");
            expect(onefield.lastName).toBe("van Rossum");
        });

        test("handles both fields empty", () => {
            const fields = data.normalizeNames({});

            expect(fields.firstName).toBeFalsy();
            expect(fields.lastName).toBeFalsy();
        });
    });

    describe("phone number normalization", () => {
        test("passes through valid numbers", () => {
            const phone1 = data.normalizePhone({
                phone: "+000-111-222-3333"
            });
            const phone2 = data.normalizePhone({
                phone: "+00-111-222-3333"
            });
            const phone3 = data.normalizePhone({
                phone: "+1-111-222-3333"
            });
            const phone4 = data.normalizePhone({
                phone: "111-222-3333"
            });
            const phone5 = data.normalizePhone({
                phone: "111-2222"
            });

            expect(phone1.phone).toBe("+000-111-222-3333");
            expect(phone2.phone).toBe("+00-111-222-3333");
            expect(phone3.phone).toBe("+1-111-222-3333");
            expect(phone4.phone).toBe("111-222-3333");
            expect(phone5.phone).toBe("111-2222");
        });

        test("hyphenates numbers", () => {
            const phone1 = data.normalizePhone({
                phone: "0001112223333"
            });
            const phone2 = data.normalizePhone({
                phone: "001112223333"
            });
            const phone3 = data.normalizePhone({
                phone: "11112223333"
            });
            const phone4 = data.normalizePhone({
                phone: "1112223333"
            });
            const phone5 = data.normalizePhone({
                phone: "1112222"
            });
            const phone6 = data.normalizePhone({
                phone: "702-1112222"
            });

            expect(phone1.phone).toBe("+000-111-222-3333");
            expect(phone2.phone).toBe("+00-111-222-3333");
            expect(phone3.phone).toBe("+1-111-222-3333");
            expect(phone4.phone).toBe("111-222-3333");
            expect(phone5.phone).toBe("111-2222");
            expect(phone6.phone).toBe("702-111-2222");
        });

        test("handles null", () => {
            const phone1 = data.normalizePhone({
                phone: null
            });
            const phone2 = data.normalizePhone({});

            expect(phone1.phone).toBeFalsy();
            expect(phone2.phone).toBeFalsy();
        });
    });
});

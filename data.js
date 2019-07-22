// Data handling and sanitization functions

const EMAIL_REGEX = /[^@]+@[^.]+\..+/;

// Normalize phone number fields; if given a numeric field, convert
// to a string. The string phone number is given hyphens, and a +
// prefix if it includes a country code.
const normalizePhone = json => {
    if(!json.phone) {
        return json;
    }

    let phone = json.phone + "";

    // Strip all non-numeric characters
    phone = phone.replace(/\D/g, "");

    if(phone.length === 13) {
        // Phone number with 3-digit country code, IE: +000-111-222-3333
        phone = phone.replace(/(\d{3})(\d{3})(\d{3})(\d{4})/, "+$1-$2-$3-$4");
    }
    else if(phone.length === 12) {
        // Phone number with a 2-digit country code, IE: +00-111-222-3333
        phone = phone.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, "+$1-$2-$3-$4");
    }
    else if(phone.length === 11) {
        // Phone number with a 1-digit country code, IE: +1-111-222-3333
        phone = phone.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "+$1-$2-$3-$4");
    }
    else if(phone.length === 10) {
        // Phone number without a country code
        phone = phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    }
    else if(phone.length === 7) {
        // Local (US) phone number without an area code
        phone = phone.replace(/(\d{3})(\d{4})/, "$1-$2");
    }

    return {
        ...json,
        phone
    };
};

// Normalize firstName and lastName fields; if only one
// of the fields is present, try to split the value of
// that field into a first name and last name. Note that
// this function will not work for people whose first name
// contains two or more words, but will for people whose
// last name contains two or more words (IE, Guido van Rossum).
const normalizeNames = json => {
    if(json.firstName && json.lastName) {
        return json;
    }
    else if(json.firstName) {
        const names = json.firstName.split(" ");

        return {
            ...json,
            firstName: names[0],
            lastName: names.slice(1).join(" ")
        };
    }
    else if(json.lastName) {
        const names = json.lastName.split(" ");

        if(names.length < 2) {
            return {
                ...json,
                firstName: null,
                lastName: names[0]
            };
        }
        else {
            return {
                ...json,
                firstName: names[0],
                lastName: names.slice(1).join(" ")
            };
        }
    }
    else {
        return json;
    }
};

// Loosely validate an email field by checking if it has a
// username, at-sign, hostname, period, and one or more
// characters trailing that. Will fail for localhost and
// non-public email accounts.
const validateEmail = json => EMAIL_REGEX.test(json.email) ? json : {
    ...json,
    email: null
};

// Fill falsy fields with "N/A"
const fillNull = json => {
    return {
        firstName: json.firstName || "N/A",
        lastName: json.lastName || "N/A",
        phone: json.phone || "N/A",
        email: json.email || "N/A"
    };
};

// Chains all available data handling functions.
const sanitize = json => {
    return fillNull(
        validateEmail(
            normalizePhone(
                normalizeNames(
                    json
                ))));
};

module.exports = {
    normalizePhone,
    normalizeNames,
    validateEmail,
    fillNull,
    sanitize
};

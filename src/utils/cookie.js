class Cookie {
    getCookieMap() {
        const cookieMap = {};
        const cookieArray = document.cookie.split(';');

        cookieArray.forEach((cookieItem) => {
            cookieItem = cookieItem.trim();
            const [key, value] = cookieItem.split('=');
            cookieMap[key] = value;
        });

        return cookieMap;
    }

    setCookie(key, value) {
        const cookieMap = this.getCookieMap();

        cookieMap[key] = value;

        Object.keys(cookieMap).forEach((key) => {
            document.cookie = `${key}=${cookieMap[key]}; path=/;`;
        });
    }

    getCookie(key) {
        const cookieMap = this.getCookieMap();

        return cookieMap[key];
    }
}

export const cookie = new Cookie();
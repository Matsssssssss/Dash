const bcrypt = require("bcrypt");
    async function generateHash() {
    const password = "MySecurePassword123!";
    const hash = await bcrypt.hash(password, 12);
    console.log(hash);
    }

generateHash();
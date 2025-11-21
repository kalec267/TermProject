const bcrypt = require('bcrypt');

(async () => {
    const hashed = await bcrypt.hash('Kim123321~', 10);
    console.log(hashed);
})();
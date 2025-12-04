const bcrypt = require('bcrypt');

(async () => {
    const hashed = await bcrypt.hash('admin', 10);
    console.log(hashed);
})();
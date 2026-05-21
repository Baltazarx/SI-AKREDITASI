const db = require('../../config/db');

const BentukPembelajaran = {
    findAll: async () => {
        const [rows] = await db.execute("SELECT * FROM master_bentuk_pembelajaran ORDER BY id_bentuk ASC");
        return rows;
    },
    findById: async (id) => {
        const [rows] = await db.execute("SELECT * FROM master_bentuk_pembelajaran WHERE id_bentuk = ?", [id]);
        return rows[0];
    }
};

module.exports = BentukPembelajaran;

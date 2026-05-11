const db = require('../../config/db');

class PemetaanCplPl2B2 {
    // 1. Get All Data
    static async getAll(id_prodi, id_tahun, is_trash = false) {
        let query = `
            SELECT 
                b.id_2b2, b.id_cpl, b.id_pl, b.id_tahun,
                cpl.kode_cpl, cpl.deskripsi_cpl, cpl.id_prodi,
                pl.kode_pl, pl.deskripsi_pl,
                t.tahun
            FROM \`2b2_pemetaan_cpl_pl\` b
            LEFT JOIN master_cpl cpl ON b.id_cpl = cpl.id_cpl
            LEFT JOIN master_profil_lulusan pl ON b.id_pl = pl.id_pl
            LEFT JOIN tahun_akademik t ON b.id_tahun = t.id_tahun
            WHERE b.deleted_at IS ${is_trash ? 'NOT NULL' : 'NULL'}
        `;
        const params = [];
        if (id_prodi) {
            query += ' AND cpl.id_prodi = ?';
            params.push(id_prodi);
        }
        if (id_tahun) {
            query += ' AND b.id_tahun = ?';
            params.push(id_tahun);
        }
        query += ' ORDER BY b.id_2b2 ASC';
        
        const [rows] = await db.query(query, params);
        return rows;
    }

    // 2. Get Data by ID
    static async getById(id) {
        const query = `
            SELECT 
                b.id_2b2, b.id_cpl, b.id_pl, b.id_tahun,
                cpl.kode_cpl, cpl.deskripsi_cpl,
                pl.kode_pl, pl.deskripsi_pl,
                t.tahun
            FROM \`2b2_pemetaan_cpl_pl\` b
            LEFT JOIN master_cpl cpl ON b.id_cpl = cpl.id_cpl
            LEFT JOIN master_profil_lulusan pl ON b.id_pl = pl.id_pl
            LEFT JOIN tahun_akademik t ON b.id_tahun = t.id_tahun
            WHERE b.id_2b2 = ? AND b.deleted_at IS NULL
        `;
        const [rows] = await db.query(query, [id]);
        return rows[0];
    }

    // 3. Create Data
    static async create(data) {
        const query = `
            INSERT INTO \`2b2_pemetaan_cpl_pl\` 
            (id_cpl, id_pl, id_tahun, created_by) 
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [
            data.id_cpl,
            data.id_pl,
            data.id_tahun,
            data.created_by
        ]);
        return result.insertId;
    }

    // 4. Update Data
    static async update(id, data) {
        const query = `
            UPDATE \`2b2_pemetaan_cpl_pl\` 
            SET id_cpl = ?, id_pl = ?, id_tahun = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id_2b2 = ?
        `;
        const [result] = await db.query(query, [
            data.id_cpl,
            data.id_pl,
            data.id_tahun,
            data.updated_by,
            id
        ]);
        return result.affectedRows;
    }

    // 5. Delete Data
    static async softDelete(id, deleted_by) {
        const query = `
            UPDATE \`2b2_pemetaan_cpl_pl\`
            SET deleted_at = CURRENT_TIMESTAMP, deleted_by = ?, updated_by = ?
            WHERE id_2b2 = ?
        `;
        const [result] = await db.query(query, [deleted_by, deleted_by, id]);
        return result.affectedRows;
    }

    // 6. Delete Data (Permanent)
    static async hardDelete(id) {
        const query = 'DELETE FROM \`2b2_pemetaan_cpl_pl\` WHERE id_2b2 = ?';
        const [result] = await db.query(query, [id]);
        return result.affectedRows;
    }
}

module.exports = PemetaanCplPl2B2;

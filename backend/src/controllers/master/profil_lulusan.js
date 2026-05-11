const ProfilLulusan = require('../../models/master/profil_lulusan');

exports.index = async (req, res) => {
    try {
        const { id_prodi } = req.query;
        const data = await ProfilLulusan.getAll(id_prodi);
        res.json({ success: true, message: 'Berhasil mengambil data profil lulusan.', data });
    } catch (error) {
        console.error('[Error GET ProfilLulusan]', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data profil lulusan.', error: error.message });
    }
};

exports.show = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await ProfilLulusan.getById(id);
        if (!data) return res.status(404).json({ success: false, message: 'Data profil lulusan tidak ditemukan.' });
        res.json({ success: true, message: 'Berhasil mengambil detail data profil lulusan.', data });
    } catch (error) {
        console.error('[Error GET ProfilLulusan By ID]', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data profil lulusan.', error: error.message });
    }
};

exports.store = async (req, res) => {
    try {
        const { id_prodi, deskripsi_pl } = req.body;
        if (!id_prodi || !deskripsi_pl) {
            return res.status(400).json({ success: false, message: 'Kolom id_prodi dan deskripsi_pl wajib diisi.' });
        }
        const insertId = await ProfilLulusan.create({ id_prodi, deskripsi_pl });
        res.status(201).json({ success: true, message: 'Data profil lulusan berhasil ditambahkan.', data: { id_pl: insertId, ...req.body } });
    } catch (error) {
        console.error('[Error POST ProfilLulusan]', error);
        res.status(500).json({ success: false, message: 'Gagal menambahkan data profil lulusan.', error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_prodi, deskripsi_pl } = req.body;
        const checkData = await ProfilLulusan.getById(id);
        if (!checkData) return res.status(404).json({ success: false, message: 'Data profil lulusan tidak ditemukan.' });
        await ProfilLulusan.update(id, { id_prodi, deskripsi_pl });
        res.json({ success: true, message: 'Data profil lulusan berhasil diperbarui.' });
    } catch (error) {
        console.error('[Error PUT ProfilLulusan]', error);
        res.status(500).json({ success: false, message: 'Gagal memperbarui data profil lulusan.', error: error.message });
    }
};

exports.destroy = async (req, res) => {
    try {
        const { id } = req.params;
        const checkData = await ProfilLulusan.getById(id);
        if (!checkData) return res.status(404).json({ success: false, message: 'Data profil lulusan tidak ditemukan.' });
        await ProfilLulusan.hardDelete(id);
        res.json({ success: true, message: 'Data profil lulusan berhasil dihapus.' });
    } catch (error) {
        console.error('[Error DELETE ProfilLulusan]', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus data profil lulusan.', error: error.message });
    }
};

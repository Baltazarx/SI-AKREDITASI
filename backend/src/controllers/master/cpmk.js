const CPMK = require('../../models/master/cpmk');

exports.index = async (req, res) => {
    try {
        const { id_prodi } = req.query;
        const data = await CPMK.getAll(id_prodi);
        res.json({ success: true, message: 'Berhasil mengambil data CPMK.', data });
    } catch (error) {
        console.error('[Error GET CPMK]', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data CPMK.', error: error.message });
    }
};

exports.show = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await CPMK.getById(id);
        if (!data) return res.status(404).json({ success: false, message: 'Data CPMK tidak ditemukan.' });
        res.json({ success: true, message: 'Berhasil mengambil detail data CPMK.', data });
    } catch (error) {
        console.error('[Error GET CPMK By ID]', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data CPMK.', error: error.message });
    }
};

exports.store = async (req, res) => {
    try {
        const { id_prodi, deskripsi_cpmk } = req.body;
        if (!id_prodi || !deskripsi_cpmk) {
            return res.status(400).json({ success: false, message: 'Kolom id_prodi dan deskripsi_cpmk wajib diisi.' });
        }
        const insertId = await CPMK.create({ id_prodi, deskripsi_cpmk });
        res.status(201).json({ success: true, message: 'Data CPMK berhasil ditambahkan.', data: { id_cpmk: insertId, ...req.body } });
    } catch (error) {
        console.error('[Error POST CPMK]', error);
        res.status(500).json({ success: false, message: 'Gagal menambahkan data CPMK.', error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_prodi, deskripsi_cpmk } = req.body;
        const checkData = await CPMK.getById(id);
        if (!checkData) return res.status(404).json({ success: false, message: 'Data CPMK tidak ditemukan.' });
        await CPMK.update(id, { id_prodi, deskripsi_cpmk });
        res.json({ success: true, message: 'Data CPMK berhasil diperbarui.' });
    } catch (error) {
        console.error('[Error PUT CPMK]', error);
        res.status(500).json({ success: false, message: 'Gagal memperbarui data CPMK.', error: error.message });
    }
};

exports.destroy = async (req, res) => {
    try {
        const { id } = req.params;
        const checkData = await CPMK.getById(id);
        if (!checkData) return res.status(404).json({ success: false, message: 'Data CPMK tidak ditemukan.' });
        await CPMK.hardDelete(id);
        res.json({ success: true, message: 'Data CPMK berhasil dihapus.' });
    } catch (error) {
        console.error('[Error DELETE CPMK]', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus data CPMK.', error: error.message });
    }
};

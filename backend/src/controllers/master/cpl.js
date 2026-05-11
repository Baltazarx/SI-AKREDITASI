const CPL = require('../../models/master/cpl');

exports.index = async (req, res) => {
    try {
        const { id_prodi } = req.query;
        const data = await CPL.getAll(id_prodi);
        res.json({ success: true, message: 'Berhasil mengambil data CPL.', data });
    } catch (error) {
        console.error('[Error GET CPL]', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data CPL.', error: error.message });
    }
};

exports.show = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await CPL.getById(id);
        if (!data) return res.status(404).json({ success: false, message: 'Data CPL tidak ditemukan.' });
        res.json({ success: true, message: 'Berhasil mengambil detail data CPL.', data });
    } catch (error) {
        console.error('[Error GET CPL By ID]', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data CPL.', error: error.message });
    }
};

exports.store = async (req, res) => {
    try {
        const { id_prodi, deskripsi_cpl } = req.body;
        if (!id_prodi || !deskripsi_cpl) {
            return res.status(400).json({ success: false, message: 'Kolom id_prodi dan deskripsi_cpl wajib diisi.' });
        }
        const insertId = await CPL.create({ id_prodi, deskripsi_cpl });
        res.status(201).json({ success: true, message: 'Data CPL berhasil ditambahkan.', data: { id_cpl: insertId, ...req.body } });
    } catch (error) {
        console.error('[Error POST CPL]', error);
        res.status(500).json({ success: false, message: 'Gagal menambahkan data CPL.', error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_prodi, deskripsi_cpl } = req.body;
        const checkData = await CPL.getById(id);
        if (!checkData) return res.status(404).json({ success: false, message: 'Data CPL tidak ditemukan.' });
        await CPL.update(id, { id_prodi, deskripsi_cpl });
        res.json({ success: true, message: 'Data CPL berhasil diperbarui.' });
    } catch (error) {
        console.error('[Error PUT CPL]', error);
        res.status(500).json({ success: false, message: 'Gagal memperbarui data CPL.', error: error.message });
    }
};

exports.destroy = async (req, res) => {
    try {
        const { id } = req.params;
        const checkData = await CPL.getById(id);
        if (!checkData) return res.status(404).json({ success: false, message: 'Data CPL tidak ditemukan.' });
        await CPL.hardDelete(id);
        res.json({ success: true, message: 'Data CPL berhasil dihapus.' });
    } catch (error) {
        console.error('[Error DELETE CPL]', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus data CPL.', error: error.message });
    }
};

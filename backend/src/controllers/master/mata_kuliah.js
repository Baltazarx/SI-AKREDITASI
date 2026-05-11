const MataKuliah = require('../../models/master/mata_kuliah');

exports.index = async (req, res) => {
    try {
        const { id_prodi } = req.query;
        const data = await MataKuliah.getAll(id_prodi);
        res.json({ success: true, message: 'Berhasil mengambil data mata kuliah.', data });
    } catch (error) {
        console.error('[Error GET MataKuliah]', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data mata kuliah.', error: error.message });
    }
};

exports.show = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await MataKuliah.getById(id);
        if (!data) return res.status(404).json({ success: false, message: 'Data mata kuliah tidak ditemukan.' });
        res.json({ success: true, message: 'Berhasil mengambil detail data mata kuliah.', data });
    } catch (error) {
        console.error('[Error GET MataKuliah By ID]', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data mata kuliah.', error: error.message });
    }
};

exports.store = async (req, res) => {
    try {
        const { id_prodi, kode_mk, nama_mk, sks, semester } = req.body;
        if (!id_prodi || !kode_mk || !nama_mk || !sks || !semester) {
            return res.status(400).json({ success: false, message: 'Kolom id_prodi, kode_mk, nama_mk, sks, semester wajib diisi.' });
        }
        const insertId = await MataKuliah.create({ id_prodi, kode_mk, nama_mk, sks, semester });
        res.status(201).json({ success: true, message: 'Data mata kuliah berhasil ditambahkan.', data: { id_mk: insertId, ...req.body } });
    } catch (error) {
        console.error('[Error POST MataKuliah]', error);
        res.status(500).json({ success: false, message: 'Gagal menambahkan data mata kuliah.', error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_prodi, kode_mk, nama_mk, sks, semester } = req.body;
        const checkData = await MataKuliah.getById(id);
        if (!checkData) return res.status(404).json({ success: false, message: 'Data mata kuliah tidak ditemukan.' });
        await MataKuliah.update(id, { id_prodi, kode_mk, nama_mk, sks, semester });
        res.json({ success: true, message: 'Data mata kuliah berhasil diperbarui.' });
    } catch (error) {
        console.error('[Error PUT MataKuliah]', error);
        res.status(500).json({ success: false, message: 'Gagal memperbarui data mata kuliah.', error: error.message });
    }
};

exports.destroy = async (req, res) => {
    try {
        const { id } = req.params;
        const checkData = await MataKuliah.getById(id);
        if (!checkData) return res.status(404).json({ success: false, message: 'Data mata kuliah tidak ditemukan.' });
        await MataKuliah.hardDelete(id);
        res.json({ success: true, message: 'Data mata kuliah berhasil dihapus.' });
    } catch (error) {
        console.error('[Error DELETE MataKuliah]', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus data mata kuliah.', error: error.message });
    }
};

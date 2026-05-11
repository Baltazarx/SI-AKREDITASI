const ModelPkm = require('../../models/lppm/4a2_pkm_dtpr');

const pkmController = {
    index: async (req, res) => {
        try {
            const { id_prodi, id_tahun } = req.query;
            const data = await ModelPkm.findAllRange(id_prodi, parseInt(id_tahun));
            res.status(200).json({ success: true, data });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    trash: async (req, res) => {
        try {
            const { id_prodi, id_tahun } = req.query;
            const data = await ModelPkm.findTrash(id_prodi, parseInt(id_tahun));
            res.status(200).json({ success: true, data });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    store: async (req, res) => {
        try {
            const data = req.body;
            
            if (!data.pkm || !data.pkm.id_roadmap || !data.pkm.id_dosen || !data.pkm.id_tahun || !data.pkm.judul_pkm) {
                return res.status(400).json({
                    success: false,
                    message: "Data Induk PkM tidak lengkap! (id_roadmap, id_dosen, id_tahun, dan judul_pkm wajib diisi)"
                });
            }

            const id_4a2 = await ModelPkm.createTransaction(data, req.user.id_user);

            res.status(201).json({
                success: true,
                message: "Data PkM beserta relasinya (Kerjasama, Publikasi, HKI) berhasil disimpan sekaligus secara aman.",
                id_4a2: id_4a2
            });

        } catch (error) {
            console.error("Error Transaction Sekali Input PkM:", error);
            res.status(500).json({
                success: false,
                message: "Gagal menyimpan data secara keseluruhan, sistem telah dibersihkan otomatis (Rollback). Error: " + error.message
            });
        }
    },

    update: async (req, res) => {
        try {
            const data = req.body;
            
            if (!data.pkm || !data.pkm.id_roadmap || !data.pkm.id_dosen || !data.pkm.id_tahun || !data.pkm.judul_pkm) {
                return res.status(400).json({
                    success: false,
                    message: "Data Induk PkM tidak lengkap! (id_roadmap, id_dosen, id_tahun, dan judul_pkm wajib diisi)"
                });
            }

            await ModelPkm.updateTransaction(req.params.id, data, req.user.id_user);
            res.status(200).json({ success: true, message: "Data PkM beserta relasinya berhasil diperbarui" });
        } catch (error) { 
            console.error("Error Update Transaction PkM:", error);
            res.status(500).json({ success: false, message: "Gagal memperbarui data. Error: " + error.message }); 
        }
    },

    destroy: async (req, res) => {
        try {
            await ModelPkm.softDelete(req.params.id, req.user.id_user);
            res.status(200).json({ success: true, message: "Data dipindahkan ke tempat sampah" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    restore: async (req, res) => {
        try {
            await ModelPkm.restore(req.params.id);
            res.status(200).json({ success: true, message: "Data berhasil dipulihkan" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    hardDestroy: async (req, res) => {
        try {
            await ModelPkm.hardDelete(req.params.id);
            res.status(200).json({ success: true, message: "Data dihapus permanen dari database" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    }
};

module.exports = pkmController;

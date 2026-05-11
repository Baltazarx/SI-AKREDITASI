const ModelPenelitian = require('../../models/lppm/3a2_penelitian_dtpr');

const penelitianController = {
    index: async (req, res) => {
        try {
            const { id_prodi, id_tahun } = req.query;
            const data = await ModelPenelitian.findAllRange(id_prodi, parseInt(id_tahun));
            res.status(200).json({ success: true, data });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    trash: async (req, res) => {
        try {
            const { id_prodi, id_tahun } = req.query;
            const data = await ModelPenelitian.findTrash(id_prodi, parseInt(id_tahun));
            res.status(200).json({ success: true, data });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    store: async (req, res) => {
        try {
            const data = req.body;
            
            // Validasi Data Induk Minimal (Wajib pakai Roadmap)
            if (!data.penelitian || !data.penelitian.id_roadmap || !data.penelitian.id_dosen || !data.penelitian.id_tahun || !data.penelitian.judul_penelitian) {
                return res.status(400).json({
                    success: false,
                    message: "Data Induk Penelitian tidak lengkap! (id_roadmap, id_dosen, id_tahun, dan judul_penelitian wajib diisi)"
                });
            }

            // Eksekusi Transaction di Model
            const id_3a2 = await ModelPenelitian.createTransaction(data, req.user.id_user);

            res.status(201).json({
                success: true,
                message: "Data Penelitian beserta relasinya (Kerjasama, Publikasi, HKI) berhasil disimpan sekaligus secara aman.",
                id_3a2: id_3a2
            });

        } catch (error) {
            console.error("Error Transaction Sekali Input:", error);
            res.status(500).json({
                success: false,
                message: "Gagal menyimpan data secara keseluruhan, sistem telah dibersihkan otomatis (Rollback). Error: " + error.message
            });
        }
    },

    update: async (req, res) => {
        try {
            const data = req.body;
            
            // Validasi Data Induk Minimal (Wajib pakai Roadmap)
            if (!data.penelitian || !data.penelitian.id_roadmap || !data.penelitian.id_dosen || !data.penelitian.id_tahun || !data.penelitian.judul_penelitian) {
                return res.status(400).json({
                    success: false,
                    message: "Data Induk Penelitian tidak lengkap! (id_roadmap, id_dosen, id_tahun, dan judul_penelitian wajib diisi)"
                });
            }

            // Eksekusi Update Transaction di Model
            await ModelPenelitian.updateTransaction(req.params.id, data, req.user.id_user);
            res.status(200).json({ success: true, message: "Data penelitian beserta relasinya berhasil diperbarui" });
        } catch (error) { 
            console.error("Error Update Transaction:", error);
            res.status(500).json({ success: false, message: "Gagal memperbarui data. Error: " + error.message }); 
        }
    },

    destroy: async (req, res) => {
        try {
            await ModelPenelitian.softDelete(req.params.id, req.user.id_user);
            res.status(200).json({ success: true, message: "Data dipindahkan ke tempat sampah" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    restore: async (req, res) => {
        try {
            await ModelPenelitian.restore(req.params.id);
            res.status(200).json({ success: true, message: "Data berhasil dipulihkan" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    },

    hardDestroy: async (req, res) => {
        try {
            await ModelPenelitian.hardDelete(req.params.id);
            res.status(200).json({ success: true, message: "Data dihapus permanen dari database" });
        } catch (error) { res.status(500).json({ success: false, message: error.message }); }
    }
};

module.exports = penelitianController;

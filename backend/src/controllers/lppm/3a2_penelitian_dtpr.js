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
    },

    exportExcel: async (req, res) => {
        try {
            const ExcelJS = require('exceljs');
            const { id_prodi, id_tahun } = req.query;
            const targetTS = parseInt(id_tahun);
            const rawData = await ModelPenelitian.findAllRange(id_prodi, targetTS);
            
            const workbook = new ExcelJS.Workbook();
            
            // Helper function for styling headers
            const styleHeader = (row) => {
                row.eachCell(c => {
                    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
                    c.font = { bold: true };
                    c.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    c.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
                });
            };

            // Helper function for styling data
            const styleData = (row) => {
                row.eachCell(c => {
                    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
                    c.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    c.alignment = { vertical: 'middle', wrapText: true };
                });
            };

            // SHEET 1: 3.A.2 Penelitian
            const ws1 = workbook.addWorksheet('3.A.2');
            
            // Header Row 1: Roadmap
            ws1.mergeCells('A1:A1');
            const h1A = ws1.getCell('A1');
            h1A.value = 'Roadmap';
            h1A.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
            h1A.font = { bold: true };
            h1A.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            h1A.alignment = { horizontal: 'center', vertical: 'middle' };

            ws1.mergeCells('B1:K1');
            const h1B = ws1.getCell('B1');
            // Ambil link roadmap dari data pertama yang punya roadmap (opsional, karena biasanya 1 tabel 1 prodi 1 roadmap)
            const roadmapLink = rawData.length > 0 && rawData[0].roadmap_link ? rawData[0].roadmap_link : 'Tuliskan link ke dokumen roadmap penelitian';
            h1B.value = roadmapLink;
            h1B.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
            h1B.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            h1B.alignment = { horizontal: 'left', vertical: 'middle' };

            // Header Row 2 & 3 (Complex Headers)
            ws1.mergeCells('A2:A3'); ws1.getCell('A2').value = 'No';
            ws1.mergeCells('B2:B3'); ws1.getCell('B2').value = 'Nama DTPR (Ketua)';
            ws1.mergeCells('C2:C3'); ws1.getCell('C2').value = 'Judul Penelitian';
            ws1.mergeCells('D2:D3'); ws1.getCell('D2').value = 'Jumlah Mahasiswa yang Terlibat';
            ws1.mergeCells('E2:E3'); ws1.getCell('E2').value = 'Jenis Hibah Penelitian';
            
            ws1.getCell('F2').value = 'Sumber';
            ws1.getCell('F3').value = 'L/N/I';

            ws1.mergeCells('G2:G3'); ws1.getCell('G2').value = 'Durasi (tahun)';

            ws1.mergeCells('H2:K2'); ws1.getCell('H2').value = 'Pendanaan (Rp juta)';
            ws1.getCell('H3').value = 'TS-2';
            ws1.getCell('I3').value = 'TS-1';
            ws1.getCell('J3').value = 'TS';
            ws1.getCell('K3').value = 'Link Bukti';

            styleHeader(ws1.getRow(2));
            styleHeader(ws1.getRow(3));

            // Data Rows
            let sumTS2 = 0, sumTS1 = 0, sumTS = 0;
            let countPenelitian = rawData.length;
            let setHibah = new Set();

            const formatSumber = (s) => {
                if (!s) return '-';
                const lower = s.toLowerCase();
                if (lower.includes('lokal') || lower.includes('wilayah')) return 'L';
                if (lower.includes('nasional')) return 'N';
                if (lower.includes('internasional')) return 'I';
                return s.charAt(0).toUpperCase();
            };

            rawData.forEach((item, index) => {
                const ts2 = item.id_tahun === targetTS - 2 ? item.jumlah_dana : 0;
                const ts1 = item.id_tahun === targetTS - 1 ? item.jumlah_dana : 0;
                const ts = item.id_tahun === targetTS ? item.jumlah_dana : 0;

                sumTS2 += ts2;
                sumTS1 += ts1;
                sumTS += ts;

                if (item.jenis_hibah) setHibah.add(item.jenis_hibah);

                const row = ws1.addRow([
                    index + 1,
                    item.nama_dosen,
                    item.judul_penelitian,
                    item.jumlah_mahasiswa || 0,
                    item.jenis_hibah || '-',
                    formatSumber(item.sumber),
                    item.durasi || 0,
                    ts2,
                    ts1,
                    ts,
                    item.link_bukti || '-'
                ]);
                styleData(row);
            });

            // Footers
            const fRow1 = ws1.addRow([]);
            ws1.mergeCells(`A${fRow1.number}:G${fRow1.number}`);
            fRow1.getCell(1).value = 'Jumlah Dana';
            fRow1.getCell(1).alignment = { horizontal: 'right', vertical: 'middle' };
            fRow1.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
            fRow1.getCell(8).value = sumTS2; fRow1.getCell(8).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
            fRow1.getCell(9).value = sumTS1; fRow1.getCell(9).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
            fRow1.getCell(10).value = sumTS; fRow1.getCell(10).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
            fRow1.getCell(11).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
            fRow1.eachCell(c => { c.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } });

            const fRow2 = ws1.addRow([]);
            ws1.mergeCells(`A${fRow2.number}:D${fRow2.number}`);
            fRow2.getCell(1).value = 'Jumlah Jenis Hibah';
            fRow2.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
            fRow2.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
            fRow2.getCell(5).value = setHibah.size;
            fRow2.getCell(5).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
            ws1.mergeCells(`F${fRow2.number}:K${fRow2.number}`);
            fRow2.getCell(6).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
            fRow2.eachCell(c => { c.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } });

            const fRow3 = ws1.addRow([]);
            ws1.mergeCells(`A${fRow3.number}:B${fRow3.number}`);
            fRow3.getCell(1).value = 'Jumlah Penelitian';
            fRow3.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
            fRow3.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
            fRow3.getCell(3).value = countPenelitian;
            fRow3.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
            ws1.mergeCells(`D${fRow3.number}:K${fRow3.number}`);
            fRow3.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BFBFBF' } };
            fRow3.eachCell(c => { c.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } });

            ws1.addRow(['L: Lokal/Wilayah, N: Nasional, I : Internasional']);

            ws1.columns = [
                { width: 5 }, { width: 25 }, { width: 35 }, { width: 15 }, 
                { width: 20 }, { width: 10 }, { width: 10 }, 
                { width: 15 }, { width: 15 }, { width: 15 }, { width: 25 }
            ];

            // SHEET 2: 3.C.1 Kerjasama
            const ws2 = workbook.addWorksheet('3.C.1');
            ws2.mergeCells('A1:F1');
            ws2.getCell('A1').value = 'Tabel 3.C.1 Kerjasama Penelitian';
            ws2.getCell('A1').font = { bold: true, size: 12 };
            ws2.getRow(2).values = ['Judul Kegiatan Kerjasama', 'Mitra Kerja Sama', 'Tingkat (Internasional/Nasional/Lokal)', 'Judul Penelitian', 'Durasi', 'Manfaat bagi PS'];
            styleHeader(ws2.getRow(2));
            
            rawData.forEach(item => {
                if(item.kerjasama && item.kerjasama.length > 0) {
                    item.kerjasama.forEach(k => {
                        const row = ws2.addRow([k.judul_kerjasama, k.mitra_kerja_sama, k.sumber, item.judul_penelitian, k.durasi, 'Peningkatan IKU']);
                        styleData(row);
                    });
                }
            });
            ws2.columns = [{ width: 35 }, { width: 25 }, { width: 20 }, { width: 35 }, { width: 10 }, { width: 20 }];

            // SHEET 3: 3.C.2 Publikasi
            const ws3 = workbook.addWorksheet('3.C.2');
            ws3.mergeCells('A1:E1');
            ws3.getCell('A1').value = 'Tabel 3.C.2 Publikasi Ilmiah Mahasiswa / DTPR';
            ws3.getCell('A1').font = { bold: true, size: 12 };
            ws3.getRow(2).values = ['Judul Publikasi', 'Jenis Publikasi', 'Judul Penelitian', 'Tahun', 'Tautan (Link)'];
            styleHeader(ws3.getRow(2));

            rawData.forEach(item => {
                if(item.publikasi && item.publikasi.length > 0) {
                    item.publikasi.forEach(p => {
                        const row = ws3.addRow([p.judul_publikasi, p.jenis_publikasi, item.judul_penelitian, item.id_tahun, p.link_bukti]);
                        styleData(row);
                    });
                }
            });
            ws3.columns = [{ width: 40 }, { width: 20 }, { width: 40 }, { width: 10 }, { width: 30 }];

            // SHEET 4: 3.C.3 HKI
            const ws4 = workbook.addWorksheet('3.C.3');
            ws4.mergeCells('A1:E1');
            ws4.getCell('A1').value = 'Tabel 3.C.3 Perolehan HKI';
            ws4.getCell('A1').font = { bold: true, size: 12 };
            ws4.getRow(2).values = ['Judul HKI', 'Jenis HKI', 'Judul Penelitian', 'Tahun', 'Tautan (Link)'];
            styleHeader(ws4.getRow(2));

            rawData.forEach(item => {
                if(item.hki && item.hki.length > 0) {
                    item.hki.forEach(h => {
                        const row = ws4.addRow([h.judul_hki, h.jenis_hki, item.judul_penelitian, item.id_tahun, h.link_bukti]);
                        styleData(row);
                    });
                }
            });
            ws4.columns = [{ width: 40 }, { width: 20 }, { width: 40 }, { width: 10 }, { width: 30 }];

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=LKPS_3A2_Penelitian_Prodi_${id_prodi}.xlsx`);
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) { res.status(500).send(error.message); }
    }
};

module.exports = penelitianController;

const Model = require('../../models/master/bentuk_pembelajaran');

const controller = {
    index: async (req, res) => {
        try {
            const data = await Model.findAll();
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = controller;

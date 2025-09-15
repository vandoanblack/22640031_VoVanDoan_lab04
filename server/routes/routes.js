// server/routes/routes.js
const express = require('express');
const router = express.Router();

const validateDrug = require('../../middlewares/validateDrug');
const Drug = require('../model/model');

// ───────────────────────────────────────────
// HOME
router.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

// ───────────────────────────────────────────
// MANAGE (list)
router.get('/manage', async(req, res, next) => {
    try {
        const drugs = await Drug.find().lean();
        res.render('manage', { title: 'Manage', drugs });
    } catch (err) { next(err); }
});

// ───────────────────────────────────────────
// PURCHASE (page)
router.get('/purchase', async(req, res, next) => {
    try {
        const drugs = await Drug.find().lean();
        res.render('purchase', { title: 'Purchase', drugs });
    } catch (err) { next(err); }
});

// PURCHASE (action: trừ pack)
router.post('/drugs/:id/purchase', async(req, res, next) => {
    try {
        const qty = Number(req.body.qty || 1);
        const drug = await Drug.findById(req.params.id);
        if (!drug) return res.status(404).send('Drug not found');
        if (!Number.isFinite(qty) || qty <= 0) return res.status(400).send('Quantity invalid');
        if (drug.pack < qty) return res.status(400).send('Not enough stock');

        drug.pack -= qty;
        await drug.save();
        res.redirect('/purchase');
    } catch (err) { next(err); }
});

// ───────────────────────────────────────────
// ADD DRUG (form page)
router.get('/add-drug', (req, res) => {
    res.render('add_drug', { title: 'Add Drug' });
});

// CREATE (nhận form)
router.post('/add-drug', validateDrug, async(req, res, next) => {
    try {
        await Drug.create(req.body);
        res.redirect('/manage');
    } catch (err) { next(err); }
});

// CREATE (API thuần: /drugs)
router.post('/drugs', validateDrug, async(req, res, next) => {
    try {
        await Drug.create(req.body);
        res.redirect('/manage');
    } catch (err) { next(err); }
});

// ───────────────────────────────────────────
// UPDATE (form page) – khớp với link: /update-drug?id=<id>
router.get('/update-drug', async(req, res, next) => {
    try {
        const id = req.query.id;
        const drug = await Drug.findById(id).lean();
        if (!drug) return res.status(404).send('Drug not found');
        res.render('update_drug', { title: 'Update Drug', drug });
    } catch (err) { next(err); }
});

// UPDATE (PUT API)
router.put('/drugs/:id', validateDrug, async(req, res, next) => {
    try {
        await Drug.findByIdAndUpdate(req.params.id, req.body, { runValidators: true });
        res.redirect('/manage');
    } catch (err) { next(err); }
});
// ───────────────────────────────────────────
router.get('/dosage', async(req, res, next) => {
    try {
        const drugs = await Drug.find().lean();
        res.render('dosage', { title: 'Check Dosage', drugs });
    } catch (err) { next(err); }
});

// ───────────────────────────────────────────
// DELETE
router.delete('/drugs/:id', async(req, res, next) => {
    try {
        console.log('DELETE HIT =>', req.params.id);
        const removed = await Drug.findByIdAndDelete(req.params.id);
        if (!removed) return res.status(404).send('Drug not found');
        return res.status(200).send('Deleted'); // trả text, không redirect
    } catch (err) { next(err); }
});


// ───────────────────────────────────────────
module.exports = router;
module.exports = function validateDrug(req, res, next) {
    const { name, dosage, card, pack, perDay } = req.body;

    if (!name || name.trim().length <= 5)
        return res.status(400).json({ error: 'Name must be more than 5 characters' });

    if (!/^\d+-morning,\d+-afternoon,\d+-night$/.test((dosage || '').trim()))
        return res.status(400).json({ error: 'Dosage must be XX-morning,XX-afternoon,XX-night' });

    if (!(Number(card) > 1000))
        return res.status(400).json({ error: 'Card must be > 1000' });

    if (!(Number(pack) > 0))
        return res.status(400).json({ error: 'Pack must be > 0' });

    if (!(Number(perDay) > 0 && Number(perDay) < 90))
        return res.status(400).json({ error: 'PerDay must be between 1 and 89' });

    next();
};
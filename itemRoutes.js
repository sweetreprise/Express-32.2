const express = require('express');
const ExpressError = require('./expressError');
const router = new express.Router();
const items = require('./fakeDb');

router.get('/', (req, res) => {
    res.json({ items });
});

router.post('/', (req, res) => {
    try {
        if(!req.body.name || !req.body.price) {
            throw new ExpressError('Item and/or price cannot be empty!', 400);
        }
        const newItem = { name: req.body.name, price: req.body.price };
        items.push(newItem);
        return res.status(201).json({ "added": newItem });
    } catch(error) {
        return next(error)
    }
});

router.get('/:name', (req, res) => {
    const item = items.find(item => item.name === req.params.name);
    if(!item) {
        throw new ExpressError('Item not found.', 404);
    }
    res.json({ name: item.name, price: item.price });
});

router.patch('/:name', (req, res) => {
    const item = items.find(item => item.name === req.params.name);
    if(!item) {
        throw new ExpressError('Item not found.', 404);
    }
    item.name = req.body.name || item.name;
    item.price = req.body.price || item.price;
    res.json({ "updated": { item }});
})

router.delete('/:name', (req, res) => {
    const item = items.findIndex(item => item.name === req.params.name);
    console.log(item)
    if(item === -1) {
        throw new ExpressError('Item not found.', 404);
    }
    items.splice(item, 1);
    res.json({ message: 'Deleted!' });
});

module.exports = router;
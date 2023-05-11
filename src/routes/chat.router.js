const { Router, response } = require('express');
const messageModel = require('../dao/models/message.model');

const router = Router();

router.get('/', async (req, res) => {
	const messages = await messageModel.find().lean().exec();
	res.send({ messages });
});

router.post('/', async (req, res) => {
	if (!req.body.user || !req.body.message) {
		res.status(400).send({ error: 'Missing parameters' });
		return;
	}

	const message = {
		user: req.body.user,
		message: req.body.message,
		date: new Date(),
	};

	try {
		const newMessage = await messageModel.create(message);
		res.send({ newMessage });
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

module.exports = router;

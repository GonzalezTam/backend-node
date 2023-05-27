const { Router } = require('express');
const userModel = require('./../dao/models/user.model');

const router = Router();

router.post('/register', async (req, res) => {
	const emailRegex = /\S+@\S+\.\S+/;
	const { email, password, password2, firstName, lastName, age, role } = req.body

	// Unavailable admin user
	if (!firstName) return res.status(400).send({ message: 'First name is required.' })
	if (!lastName) return res.status(400).send({ message: 'Last name is required.' })
	if (!age || age > 100 || age < 18) return res.status(400).send({ message: 'Specify a valid age between 18 and 100.' })
	if (!email || !emailRegex.test(email)) return res.status(400).send({ message: 'Provide a valid email.' })
	if (email === 'adminCoder@coder.com') return res.status(400).send({ message: 'Email not available.' })
	if (!password) return res.status(400).send({ message: 'Password is required.' })
	if (!password2) return res.status(400).send({ message: 'Password confirmation is required.' })
	if (password !== password2) return res.status(400).send({ message: 'Passwords do not match.' })

	const user = {
		email,
		password,
		firstName,
		lastName,
		age,
		role
	}

	try {
		const newUser = await userModel.create(user)
		res.send({ message: 'User created', user: { email: newUser.email, firstName: newUser.firstName, lastName: newUser.lastName, age: newUser.age, role: newUser.role } })
	}catch (error){
		res.status(400).send({ message: 'User not created.', error: error.message });
	}
})

router.post('/login', async (req, res) => {
	const emailRegex = /\S+@\S+\.\S+/;
	const { email, password } = req.body
	if (!email && !password) return res.status(400).send({ message: 'Email and password are required.' });
	if (!email || !emailRegex.test(email)) return res.status(400).send({ message: 'Email is required.' })
	if (!password) return res.status(400).send({ message: 'Password is required.' })

	// Hardcoded admin user
	if (email === 'adminCoder@coder.com'){
		if (password !== 'adminCod3r123') return res.status(400).send({ message: 'Login failed. Wrong password.' })
		const reqSessionUser = {
			_id: undefined,
			email: email,
			firstName: 'Coder',
			lastName: 'House',
			age: 100,
			role: 'admin'
		}
		req.session.user = reqSessionUser;
		return res.send({ message: 'Login success!', user: reqSessionUser })
	}

	// User from DB
	try {
		const user = await userModel.findOne({ email }).lean().exec();
		if (user) {
			const reqSessionUser = {
				_id: user._id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				age: user.age,
				role: (user.email === 'adminCoder@coder.com') ? 'admin' : 'user'
			}
			if(user.password !== password){
				return res.status(400).send({ message: 'Login failed. Wrong password.' })
			}
			req.session.user = reqSessionUser;
			res.send({ message: 'Login success!', user: reqSessionUser })
		} else {
			throw new Error('User not found.')
		}
	}catch (error){
		res.status(400).send({ message: `Login failed. ${error.message}` })
	}
})

router.get('/logout', function (req, res) {
	req.session.destroy(err => {
		if (err) return res.send({ message: 'Logout failed' })
	})
	res.send({ message: 'Logout success!' })
});

module.exports = router;

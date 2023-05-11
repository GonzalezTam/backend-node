let messagesArray = [];
let chatBox = document.getElementById('chatBox')
let history = document.getElementById('history')
document.onreadystatechange = async () => {
	await fetch('http://localhost:8080/api/chat')
		.then(res => res.json())
		.then(data => {
			//console.log('fetch', data);
			messagesArray = data.messages;
		})
		.catch(err => console.log(err))
}

let socket
let user = ''
socket = io()
socket.on('history', data => {
	//console.log('history', data);
	messagesArray[data._id] = data;
	let messageDiv = ''
	Object.values(messagesArray).reverse().forEach(m => {
		messageDiv += `<div class="container message mx-3"><span class="mx-4 small" style="color:lightgray">${new Date(m.date).toLocaleString()}</span><strong>[${m.user}]</strong>: ${m.message}</div>`
	})
	history.innerHTML = '';
	history.innerHTML = messageDiv;
})

Swal.fire({
	title: 'Welcome to the chat!',
	input: 'text',
	text: 'Log in with an email address',
	inputValidator: value => {
			return !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) && 'Please provide a valid email address'
	},
	allowOutsideClick: false
})
	.then(result => {
		user = result.value
		document.getElementById('username').innerHTML = user
		document.getElementById('chatBox').hidden = false
		document.getElementById('chatBox').focus()
		socket = io()


		chatBox.addEventListener('keyup', async (e) => {
			if (e.key == "Enter")  {
				if (chatBox.value.trim().length > 0) {
					//console.log('Enter');
					try {
						const body = {
							user,
							message: chatBox.value,
							date: new Date()
						}
						const response = await fetch('http://localhost:8080/api/chat', {
							method: 'post',
							body: JSON.stringify(body),
							headers: { 'Content-Type': 'application/json' },
						});
						if (response.status === 200) {
							const data = await response.json();
							socket = io();
							socket.emit('messageSent', data.newMessage)
						} else if (response.status === 400) {
							const data = await response.json();
								console.error(data.error);
						} else {
							throw new Error('Unexpected response');
						}
					} catch (err) {
						console.error(`Error: ${err}`);
					}
				}
				chatBox.value = ""
			}
		})

		//socket.on('history', data => {
		//	console.log('history', data);
		//	messagesArray[data._id] = data;
		//	let messageDiv = ''
		//	Object.values(messagesArray).reverse().forEach(m => {
		//		messageDiv += `<div class="container message mx-3"><span class="mx-4 small" style="color:lightgray">${new Date(m.date).toLocaleString()}</span><strong>[${m.user}]</strong>: ${m.message}</div>`
		//	})
		//	history.innerHTML = '';
		//	history.innerHTML = messageDiv;
		//})
	})

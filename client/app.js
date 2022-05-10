//https://ipinfo.io
const ipInfoToken = 'f0c9a2d2e92d12',
	  ipUrl = `https://ipinfo.io/json?token=${ipInfoToken}`,
	  button = document.querySelector('button');

let country = '';
fetch(ipUrl).then(
	(response) => response.json()
).then(
	(jsonResponse) => console.log(jsonResponse)
)

button.addEventListener('click', function () {
	console.log('checkout');

	//use this if server and client code are in the same place as the url /create-checkout-session
	fetch('http://localhost:3000/create-checkout-session', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			items: [
				{id: 1, quantity: 3},
				{id: 2, quantity: 1}
			]
		})
	}).then(res => {
		if (res.ok) {
			return res.json();
		}
		return res.json.then(json => Promise.reject(json))
	}).then(({url}) => {
		// console.log(url)
		window.location = url;
	}).catch(err => {
		console.error(err.error)
	})
});

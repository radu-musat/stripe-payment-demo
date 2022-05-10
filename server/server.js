require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());

//schimba in functie de ce folosesti pt client code server ex: localhost:xxxxx - valoarea * permite de peste tot
app.use(
	cors({
		origin: "*"
	})
)

//folosesti daca client e pe acelasi server
app.use(express.static("public"));

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
//fictive db
const  storeItems = new Map([
	[1, { priceInCents: 10000, name: 'Course A' }],
	[2, { priceInCents: 20000, name: 'Course B' }]
]);

app.post('/create-checkout-session', async(req, res) =>{
	try {
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			mode: 'payment',
			line_items: req.body.items.map(item => {
				const storeItem = storeItems.get(item.id);
				return {
					price_data: {
						currency: 'usd',
						product_data: {
							name: storeItem.name
						},
						unit_amount: storeItem.priceInCents
					},
					quantity: item.quantity
				}
			}),
			success_url: `${process.env.SERVER_URL}/success.html`,
			cancel_url: `${process.env.SERVER_URL}/cancel.html`,
		})
		res.json( { url: session.url } )
	} catch (err) {
		res.status(500).json({ error: err.message  })
	}

});
app.listen(3000);

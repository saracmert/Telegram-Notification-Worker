export default {
	async fetch(request, env, ctx) {
		if (env.CLOUDFLARE_NOTIFICATIONS_WEBHOOK_SECRET == "YOUR_CLOUDFLARE_NOTIFICATIONS_WEBHOOK_SECRET") {
			return new Response('Missing environment variable: CLOUDFLARE_NOTIFICATIONS_WEBHOOK_SECRET', {
				status: 500
			});
		}

		if (env.TELEGRAM_BOT_TOKEN == "YOUR_TELEGRAM_BOT_TOKEN") {
			return new Response('Missing environment variable: TELEGRAM_BOT_TOKEN', {
				status: 500
			});
		}

		if (env.TELEGRAM_GROUP_ID == -123456789) {
			return new Response('Missing environment variable: TELEGRAM_GROUP_ID', {
				status: 500
			});
		}

		if (request.method == 'POST' && request.headers.get("cf-webhook-auth") == env.CLOUDFLARE_NOTIFICATIONS_WEBHOOK_SECRET) {
			let data = await request.json();
			if (data.text !== undefined) {
				await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, 'sendmessage', {
					chat_id: env.TELEGRAM_GROUP_ID,
					text: data.text
				});
				return new Response('Success', {
					status: 200
				});
			} else {
				return new Response('Invalid request!', {
					status: 500
				});
			}
		} else {
			return new Response('Invalid request!', {
				status: 500
			});
		}
	},
};

async function sendTelegramMessage(token, type, data, n = true) {
	try {
		let t = await fetch('https://api.telegram.org/bot' + token + '/' + type, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		let d = await t.json();

		if (!d.ok && n) {
			throw d;
		} else {
			return d;
		}
	} catch (e) {
		await telegramBot(token, 'sendmessage', {
			chat_id: group_id,
			text: 'Request to Telegram error\n\n' + JSON.stringify(e)
		}, false);
		return e;
	}
}
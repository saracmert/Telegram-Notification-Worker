const bot_token = 'YOUR_TELEGRAM_BOT_TOKEN';
const group_id = -123456789; // YOUR_TELEGRAM_GROUP_ID
const secret = ""; // YOUR_CLOUDFLARE_NOTIFICATIONS_WEBHOOK_SECRET

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
})

async function handleRequest(request) {
    if (request.method == 'POST' && request.headers.get("cf-webhook-auth") == secret) {
        let data = await request.json();
        if (data.text !== undefined) {
            await telegramBot(bot_token, 'sendmessage', {
              chat_id: group_id,
              text: data.text
            });
            return new Response('Success', {
                status: 200
            });
        } else {
            return new Response('Failed', {
                status: 500
            });
        }
    } else {
        return new Response('Failed', {
            status: 500
        });
    }
}

async function telegramBot(token, type, data, n = true) {
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

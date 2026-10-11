const PAYPAL_API = process.env.PAYPAL_ENVIRONMENT === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

async function getAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials are missing.');
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      authorization: `Basic ${credentials}`,
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('PayPal authentication failed.');
  }

  return (await response.json()).access_token;
}

export async function handler(event) {
  const siteOrigin =
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    `https://${event.headers.host}`;
  const orderId = event.queryStringParameters?.token;

  if (!orderId) {
    return {
      statusCode: 302,
      headers: { location: `${siteOrigin}/?checkout=error` },
    };
  }

  try {
    const accessToken = await getAccessToken();
    const response = await fetch(
      `${PAYPAL_API}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
      {
        method: 'POST',
        headers: {
          authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json',
        },
        body: '{}',
      },
    );
    const capture = await response.json();
    const status = response.ok && capture.status === 'COMPLETED' ? 'success' : 'error';

    if (status === 'error') {
      console.error('PayPal capture failed', capture);
    }

    const redirectUrl = new URL('/', siteOrigin);
    redirectUrl.searchParams.set('checkout', status);
    if (status === 'success') {
      const completedCapture = capture.purchase_units
        ?.flatMap((unit) => unit.payments?.captures ?? [])
        .find((payment) => payment.status === 'COMPLETED');
      const amount = Number(completedCapture?.amount?.value);

      redirectUrl.searchParams.set('order_id', orderId);
      if (Number.isFinite(amount) && amount > 0) {
        redirectUrl.searchParams.set('value', amount.toFixed(2));
      }
    }

    return {
      statusCode: 302,
      headers: { location: redirectUrl.toString() },
    };
  } catch (error) {
    console.error('PayPal return handler failed', error);
    return {
      statusCode: 302,
      headers: { location: `${siteOrigin}/?checkout=error` },
    };
  }
}


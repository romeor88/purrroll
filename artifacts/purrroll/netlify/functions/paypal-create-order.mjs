const PAYPAL_API = process.env.PAYPAL_ENVIRONMENT === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

const BUNDLES = {
  1: { quantity: 1, amount: '29.99', label: 'Buy 1 + free gift' },
  2: { quantity: 2, amount: '45.00', label: 'Buy 2 + free gift' },
  3: { quantity: 3, amount: '99.99', label: 'Buy 3 + free gift' },
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  };
}

async function getAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      'PayPal is not configured. Add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in Netlify.',
    );
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
    throw new Error('PayPal authentication failed. Check the configured credentials.');
  }

  const data = await response.json();
  return data.access_token;
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const bundleId = Number(payload.bundle);
    const bundle = BUNDLES[bundleId];

    if (!bundle) {
      return json(400, { error: 'Choose a valid bundle.' });
    }

    const colors = Array.isArray(payload.colors)
      ? payload.colors
          .slice(0, bundle.quantity)
          .map((color) => String(color).trim())
          .filter(Boolean)
      : [];

    if (colors.length !== bundle.quantity) {
      return json(400, {
        error: `Choose ${bundle.quantity} color${bundle.quantity === 1 ? '' : 's'} for this bundle.`,
      });
    }

    const allowedColors = new Set(['black', 'blue', 'mint', 'pink']);
    if (colors.some((color) => !allowedColors.has(color))) {
      return json(400, { error: 'One or more selected colors are invalid.' });
    }

    const accessToken = await getAccessToken();
    const siteOrigin =
      process.env.URL ||
      process.env.DEPLOY_PRIME_URL ||
      `https://${event.headers.host}`;
    const returnUrl = `${siteOrigin}/.netlify/functions/paypal-return`;
    const cancelUrl = `${siteOrigin}/?checkout=cancelled`;

    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
        'paypal-request-id': crypto.randomUUID(),
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            description: `PurrRoll Outdoor Pet Playpen — ${bundle.label}`,
            custom_id: `purrroll-bundle-${bundleId}`,
            amount: {
              currency_code: 'USD',
              value: bundle.amount,
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: bundle.amount,
                },
              },
            },
            items: [
              {
                name: `PurrRoll — ${colors.join(', ')}`,
                quantity: '1',
                unit_amount: {
                  currency_code: 'USD',
                  value: bundle.amount,
                },
              },
            ],
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              brand_name: 'PurrRoll',
              user_action: 'PAY_NOW',
              return_url: returnUrl,
              cancel_url: cancelUrl,
            },
          },
        },
      }),
    });

    const order = await response.json();
    if (!response.ok) {
      console.error('PayPal create order failed', order);
      return json(502, { error: 'PayPal could not create the order.' });
    }

    const approveUrl = order.links?.find((link) => link.rel === 'payer-action')?.href
      ?? order.links?.find((link) => link.rel === 'approve')?.href;

    if (!approveUrl) {
      return json(502, { error: 'PayPal did not return an approval link.' });
    }

    return json(200, { orderId: order.id, approveUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Checkout failed.';
    return json(500, { error: message });
  }
}


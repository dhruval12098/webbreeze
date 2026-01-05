import crypto from 'crypto';

/**
 * Test script to simulate Razorpay webhook calls
 * This will help verify that the webhook endpoint is working properly
 */

async function testWebhook() {
  // Simulate a payment.captured webhook payload from Razorpay
  const webhookPayload = {
    "entity": "event",
    "account_id": "acc_HXXd2KtN6X7CzA",
    "event": "payment.captured",
    "status": "success",
    "id": "evt_3Lx6j2HKEhp5q1",
    "created_at": 1655756411,
    "payload": {
      "payment": {
        "entity": {
          "id": "pay_S0CPq5qCS2NNlr",
          "entity": "payment",
          "amount": 105,
          "currency": "INR",
          "status": "captured",
          "order_id": "order_S0CPef5rUBYPTe",
          "invoice_id": null,
          "international": false,
          "method": "upi",
          "amount_refunded": 0,
          "refund_status": null,
          "captured": true,
          "description": "Room Booking Payment",
          "card_id": null,
          "bank": null,
          "wallet": null,
          "vpa": "9284695568@ybl",
          "email": "dhruvalpatel273@gmail.com",
          "contact": "+919284695568",
          "notes": [],
          "fee": 3,
          "tax": 0,
          "error_code": null,
          "error_description": null,
          "created_at": 1655756411
        }
      }
    }
  };

  // Convert to string
  const payloadString = JSON.stringify(webhookPayload);

  // Calculate signature (you'll need your actual webhook secret)
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'E2ViKhB3K1L9M19Bguxp87GgFs'; // From your .env.local file
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(payloadString)
    .digest('hex');

  console.log('Testing webhook with payload:');
  console.log(payloadString);
  console.log('\nExpected signature:', expectedSignature);

  // Make a request to the webhook endpoint
  try {
    const response = await fetch('http://localhost:3000/api/webhooks/razorpay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Razorpay-Signature': expectedSignature
      },
      body: payloadString
    });

    console.log('\nWebhook response status:', response.status);
    console.log('Webhook response headers:', [...response.headers.entries()]);
    
    const responseBody = await response.text();
    console.log('Webhook response body:', responseBody);
    
    if (response.status === 200) {
      console.log('\n✅ Webhook endpoint is working correctly!');
    } else {
      console.log('\n❌ Webhook endpoint returned an error status:', response.status);
    }
  } catch (error) {
    console.error('\n❌ Error making request to webhook:', error.message);
  }
}

// Also test with a different event type
async function testWebhookOrderPaid() {
  const webhookPayload = {
    "entity": "event",
    "account_id": "acc_HXXd2KtN6X7CzA",
    "event": "order.paid",
    "status": "success",
    "id": "evt_3Lx6j2HKEhp5q2",
    "created_at": 1655756412,
    "payload": {
      "order": {
        "entity": {
          "id": "order_S0CPef5rUBYPTe",
          "entity": "order",
          "amount": 105,
          "amount_paid": 105,
          "amount_due": 0,
          "currency": "INR",
          "receipt": "receipt#1",
          "offer_id": null,
          "status": "paid",
          "attempts": 1,
          "notes": [],
          "created_at": 1655756412
        }
      },
      "payment": {
        "entity": {
          "id": "pay_S0CPq5qCS2NNlr",
          "entity": "payment",
          "amount": 105,
          "currency": "INR",
          "status": "captured",
          "order_id": "order_S0CPef5rUBYPTe",
          "invoice_id": null,
          "international": false,
          "method": "upi",
          "amount_refunded": 0,
          "refund_status": null,
          "captured": true,
          "description": "Room Booking Payment",
          "card_id": null,
          "bank": null,
          "wallet": null,
          "vpa": "9284695568@ybl",
          "email": "dhruvalpatel273@gmail.com",
          "contact": "+919284695568",
          "notes": [],
          "fee": 3,
          "tax": 0,
          "error_code": null,
          "error_description": null,
          "created_at": 1655756412
        }
      }
    }
  };

  // Convert to string
  const payloadString = JSON.stringify(webhookPayload);

  // Calculate signature
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'E2ViKhB3K1L9M19Bguxp87GgFs';
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(payloadString)
    .digest('hex');

  console.log('\n\nTesting order.paid webhook with payload:');
  console.log(payloadString);
  console.log('\nExpected signature:', expectedSignature);

  // Make a request to the webhook endpoint
  try {
    const response = await fetch('http://localhost:3000/api/webhooks/razorpay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Razorpay-Signature': expectedSignature
      },
      body: payloadString
    });

    console.log('\nOrder paid webhook response status:', response.status);
    console.log('Order paid webhook response headers:', [...response.headers.entries()]);
    
    const responseBody = await response.text();
    console.log('Order paid webhook response body:', responseBody);
    
    if (response.status === 200) {
      console.log('\n✅ Order paid webhook endpoint is working correctly!');
    } else {
      console.log('\n❌ Order paid webhook endpoint returned an error status:', response.status);
    }
  } catch (error) {
    console.error('\n❌ Error making request to order paid webhook:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('Testing webhook functionality...\n');
  
  // Load environment variables from .env.local
  import('fs').then(fs => {
    import('path').then(path => {
      const envPath = path.resolve(process.cwd(), '.env.local');
      if (fs.existsSync(envPath)) {
        const envFile = fs.readFileSync(envPath, 'utf8');
        const lines = envFile.split('\n');
        
        lines.forEach(line => {
          if (line.trim() && !line.startsWith('#')) {
            const [key, ...value] = line.split('=');
            if (key && value) {
              const envKey = key.trim();
              const envValue = value.join('=').trim();
              process.env[envKey] = envValue.replace(/(^"|"$|^'|'$)/g, '');
            }
          }
        });
      }
      
      // Run the tests after loading env vars
      testWebhook().then(() => {
        testWebhookOrderPaid();
      });
    });
  });
}

runTests();
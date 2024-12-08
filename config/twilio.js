// config/twilio.js
const dotenv = require('dotenv');
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !fromPhone) {
    throw new Error('Twilio credentials are not properly configured.');
}

const twilioClient = require('twilio')(accountSid, authToken);

module.exports = { twilioClient, fromPhone };

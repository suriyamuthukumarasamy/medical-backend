const { MailtrapClient } = require("mailtrap");
const dotenv = require("dotenv");

dotenv.config();

const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
});

const sender = {
  email: "hello@demomailtrap.com",
  name: "Suriya",
};

module.exports = {mailtrapClient, sender};
const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
    try {
        if (!process.env.MAILTRAP_TOKEN || process.env.MAILTRAP_TOKEN === 'your_mailtrap_token_here') {
            console.log("==================================================");
            console.log(`[sendEmail] Simulated email sent:`);
            console.log(`TO: ${options.to}`);
            console.log(`SUBJECT: ${options.subject}`);
            console.log(`TEXT:\n${options.text}`);
            console.log("==================================================");
            return;
        }

        const { MailtrapTransport } = require("mailtrap");
        const transporter = nodeMailer.createTransport(
            MailtrapTransport({
                token: process.env.MAILTRAP_TOKEN
            })
        );

        const sender = {
            address: "hello@demomailtrap.co",
            name: "ShopWave Mail",
        };

        await transporter.sendMail({
            from: sender,
            to: options.to,
            subject: options.subject,
            text: options.text,
            category: "Verification",
        });
    } catch (error) {
        console.log("==================================================");
        console.log("[sendEmail] Error sending email (falling back to console):", error.message);
        console.log(`TO: ${options.to}`);
        console.log(`SUBJECT: ${options.subject}`);
        console.log(`TEXT:\n${options.text}`);
        console.log("==================================================");
        // Fallback gracefully so registration flow completes
    }
};

module.exports = sendEmail;

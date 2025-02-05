'use strict';

const nodemailer = require('nodemailer');
const { Service } = require('@hapipal/schmervice');

module.exports = class MailService extends Service {

    constructor() {
        super();
        
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || 'smtp.ethereal.email',
            port: process.env.MAIL_PORT || 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        console.log('Mail service initialized with account:', process.env.MAIL_USER);
    }

    async sendWelcomeEmail(user) {
        const mailOptions = {
            from: `"IUT Project" <${process.env.MAIL_USER}>`,
            to: user.email,
            subject: 'Welcome to IUT Project!',
            html: `
                <h1>Welcome ${user.firstName}!</h1>
                <p>Thank you for joining IUT Project. We're excited to have you on board!</p>
                <p>Your account details:</p>
                <ul>
                    <li>Username: ${user.username}</li>
                    <li>Email: ${user.email}</li>
                </ul>
                <p>If you have any questions, feel free to contact us.</p>
                <p>Best regards,<br>The IUT Project Team</p>
            `
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Welcome email sent to:', user.email);
            console.log('Message ID:', info.messageId);
            
            // URL pour voir l'email dans Ethereal
            const previewUrl = nodemailer.getTestMessageUrl(info);
            console.log('Preview URL:', previewUrl);
            
            return {
                messageId: info.messageId,
                previewUrl
            };
        } catch (error) {
            console.error('Failed to send welcome email:', error);
            throw error;
        }
    }
};

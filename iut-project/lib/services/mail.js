'use strict';

const nodemailer = require('nodemailer');
const { Service } = require('@hapipal/schmervice');

module.exports = class MailService extends Service {

    constructor() {
        super();
        
        this.transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: 'clifford60@ethereal.email',
                pass: 'S163jShn8PqQpvy2zf'
            }
        });

        console.log('Mail service initialized with account: clifford60@ethereal.email');
    }

    async sendWelcomeEmail(user) {
        const mailOptions = {
            from: '"IUT Project" <clifford60@ethereal.email>',
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
                success: true,
                messageId: info.messageId,
                previewUrl: previewUrl
            };
        } catch (error) {
            console.error('Error sending welcome email:', error);
            throw error;
        }
    }
};

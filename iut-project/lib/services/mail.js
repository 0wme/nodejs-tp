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

    async sendNewMovieNotification(users, movie) {
        const subject = `New Movie Added: ${movie.title}`;
        const html = `
            <h1>New Movie Added to Our Library!</h1>
            <h2>${movie.title}</h2>
            <p><strong>Director:</strong> ${movie.director}</p>
            <p><strong>Release Date:</strong> ${new Date(movie.releaseDate).toLocaleDateString()}</p>
            <p><strong>Description:</strong> ${movie.description}</p>
            <p>Log in to your account to add this movie to your favorites!</p>
            <p>Best regards,<br>The IUT Project Team</p>
        `;

        const results = [];
        for (const user of users) {
            try {
                const info = await this.transporter.sendMail({
                    from: `"IUT Project" <${process.env.MAIL_USER}>`,
                    to: user.email,
                    subject,
                    html
                });
                console.log('New movie notification sent to:', user.email);
                console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
                results.push({ email: user.email, success: true });
            } catch (error) {
                console.error('Failed to send new movie notification to:', user.email, error);
                results.push({ email: user.email, success: false, error: error.message });
            }
        }
        return results;
    }

    async sendMovieUpdateNotification(users, movie, changes) {
        const subject = `Movie Updated: ${movie.title}`;
        const changesHtml = Object.entries(changes)
            .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
            .join('');

        const html = `
            <h1>Movie Update Notification</h1>
            <h2>${movie.title}</h2>
            <p>This movie has been updated with the following changes:</p>
            <ul>
                ${changesHtml}
            </ul>
            <p><strong>Current Details:</strong></p>
            <ul>
                <li><strong>Director:</strong> ${movie.director}</li>
                <li><strong>Release Date:</strong> ${new Date(movie.releaseDate).toLocaleDateString()}</li>
                <li><strong>Description:</strong> ${movie.description}</li>
            </ul>
            <p>Best regards,<br>The IUT Project Team</p>
        `;

        const results = [];
        for (const user of users) {
            try {
                const info = await this.transporter.sendMail({
                    from: `"IUT Project" <${process.env.MAIL_USER}>`,
                    to: user.email,
                    subject,
                    html
                });
                console.log('Movie update notification sent to:', user.email);
                console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
                results.push({ email: user.email, success: true });
            } catch (error) {
                console.error('Failed to send movie update notification to:', user.email, error);
                results.push({ email: user.email, success: false, error: error.message });
            }
        }
        return results;
    }
};

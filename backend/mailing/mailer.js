require('../config/loadEnv');

const sendVerificationEmail = async (email, firstName, url) =>{
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: process.env.EMAIL_FROM || 'Breadboxd <welcome@breadboxd.xyz>',
            to: [email],
            subject: 'Verify your email for Breadboxd',
            html: `<p>Hi ${firstName},</p>
               <p>Thank you for registering with Breadboxd! Please click the link below to verify your email address:</p>
               <a href="${url}">Verify Email</a>
               <p>If you did not create an account, please ignore this email.</p>
               <p>Best regards,<br/>The Breadboxd Team</p>`
        })
    });

    if (!response.ok) {
        let errorMessage = `Resend request failed with status ${response.status}`;

        try {
            const payload = await response.json();
            errorMessage = payload?.message || payload?.error || errorMessage;
        } catch {}

        throw new Error(errorMessage);
    }

    return response.json();
}

function validateMailerConfig() {
    if (!process.env.RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY is not configured');
    }
}

validateMailerConfig();

module.exports = { sendVerificationEmail };

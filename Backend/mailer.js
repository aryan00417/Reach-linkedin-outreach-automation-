const nodemailer = require("nodemailer");

async function sendMail(toEmail,gmail,appPassword,keyword,resumePath) {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: gmail,
            pass: appPassword
        }
    });

    const mailOptions = {
        from: gmail,
        to: toEmail,
        subject: `Application for ${keyword} Opportunities`,

        text: `
Hello,

I recently came across your hiring post regarding ${keyword} opportunities and wanted to express my interest.

Please find my resume attached for your reference.

I would appreciate the opportunity to connect and discuss any relevant openings.

Thank you for your time and consideration.

Best Regards
`,

        attachments: [
            {
                filename: "resume.pdf",
                path: resumePath
            }
        ]
    };

    await transporter.sendMail(mailOptions);

    console.log(`Email sent to ${toEmail}`);
}

module.exports = sendMail;
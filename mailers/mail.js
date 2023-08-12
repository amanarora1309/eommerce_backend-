import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'amanarora002242@gmail.com',
        pass: 'rvgsjylgjdlmkmfy'
    }
})

const mailOptions = {
    from: 'amanarora002242@gmail.com',
    to: '',
    subject: '',
    text: ''
}


const sendMail = async (to, subject, text) => {
    mailOptions['to'] = to;
    mailOptions['subject'] = subject;
    mailOptions['text'] = text;

    await transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(info);
        }
    })
}

export default sendMail;
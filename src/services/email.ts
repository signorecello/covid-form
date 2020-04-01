const nodemailer = require("nodemailer");
var handlebars = require('handlebars');
const fs = require('fs')

let transporter = nodemailer.createTransport({
    host: process.env.SMTP_NAME,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USERNAME, // generated ethereal user
      pass: process.env.MAIL_PASSWORD // generated ethereal password
    },
    requireTLS: true,
    debug: true
});

export async function sendMail(msg : any, data : any) {
    const html = await fs.readFileSync(__dirname + "/emailModel.html", {encoding: 'utf-8'})
    var template = handlebars.compile(html);
    var replacements = data;
    const htmlToSend = template(replacements)
    msg.html = htmlToSend;
    // transporter.sendMail({
    //     from: process.env.MAIL_USERNAME, // sender address
    //     to: "jpedrosous@gmail.com", // list of receivers
    //     subject: "Hello ✔", // Subject line
    //     text: "Hello world?", // plain text body
    //     html: "<b>Hello world?</b>" // html body
    // });

    transporter.sendMail(msg)
}
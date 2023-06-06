const express = require('express');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const cors = require('cors');

dotenv.config({ path: './config.env' });
const app = express();
app.use(express.json());
app.use(cors());

const sendEmail = async options =>{
    // 1)Create Transporter
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASSWORD
        }
    });

    // 2)Define Email options
    const mailOptions = {
        from:'youremail@gmail.com',
        to:options.email,
        subject:options.subject,
        html:options.htmlToSend
    }
    // 3)Actually send the email to the email address
    await transporter.sendMail(mailOptions);
}

app.get('/',(req,res)=>{
    res.status(200).json({
        status:'Success',
        message:'Your api is working fine'
    })
})

app.post('/sendmail',async(req,res)=>{
    const data = req.body;
    let html =  `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Response</title></head><body><h1>Data sent from form :-</h1><h4>Name : {userData.name}</h4><h4>Phone : {userData.phone}</h4><h4>Gender : {userData.gender}</h4><h4>Email : {userData.email}</h4><h4>Subject : {userData.subject}</h4><h4>Message : {userData.message}</h4></body></html>`
    html = html.replace('{userData.name}',`'${data.message.name}'`).replace('{userData.phone}',`'${data.message.phone}'`).replace('{userData.gender}',`'${data.message.gender}'`).replace('{userData.email}',`'${data.email}'`);
    html = html.replace('{userData.subject}',`${data.subject}`).replace('{userData.message}',`${data.message.message}`);
    try{
        await sendEmail({
            email:data.email,
            subject:data.subject,
            htmlToSend:html
        })
        res.status(200).json({
            status:'success',
            message:'Mail sent successfully'
        })
    }
    catch(err){
        console.log(err);
        res.status(400).json({
            status:'fail',
            message:err
        });
    }
})

app.all('*',(req,res)=>{
    res.status(400).json({
        status:'fail',
        message:'An unexpected error has occured'
    })
});

const port = process.env.PORT || 5000;
const server = app.listen(port,()=>{
    console.log(`Server is listening on port ${port}`);
});

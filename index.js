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
        text:options.message
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
    try{
        await sendEmail({
            email:data.email,
            subject:data.subject,
            message:data.message
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
        message:err
    })
});

const port = process.env.PORT || 5000;
const server = app.listen(port,()=>{
    console.log(`Server is listening on port ${port}`);
});

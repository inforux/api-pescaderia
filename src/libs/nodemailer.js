/*
import nodemailer from 'nodemailer'

const createTransporter = () =>{
  const transport = nodemailer.createTransport({

    host: "smtp.gmail.com", //mail.domain.com
    port: 465,
    secure: true, //ssl
    auth: {
    user: "app.mail.poliza@gmail.com", //info@domain.com
    pass: "hwfykpcrauqgwvaz" //123456
    },
    tls:{
      rejectUnauthorized:false
    }

  });
  return transport
}

export const sendMail = async (user, token) =>{
  const transporter = createTransporter()
  const email ='<b>Bienvenido - Confirme su cuenta. <b>&nbsp;<a href=http://144.126.147.78:3000/api/users/confirm/'.concat(token,'">Comfirmar correo!</a><br><h3>Atentamente: <br> Vladimir Putin ...</h3>')
  const info = await transporter.sendMail({
    from: '"Informes - " <info@poliza.com>', // sender address
    to:user.email,
    subject:"Confirmación correo - Poliza ",
    html: email
  }) 
  console.log("email sent: %s", info.messageId )
  return 
}
*/
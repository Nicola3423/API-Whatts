require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();

// Configurações
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do transporte de e-mail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true,
  debug: true,
});

app.post('/webhook', async (req, res) => {
  console.log('Dados recebidos no webhook:', req.body);

  try {
    const { Body, From, ProfileName, To } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECEIVER,
      subject: `Nova mensagem do WhatsApp de ${ProfileName || From || 'Remetente desconhecido'}`,
      text: `
        Você recebeu uma nova mensagem do WhatsApp!
        
        Perfil: ${ProfileName || 'Não disponível'}
        Número do remetente: ${From || 'Não disponível'}
        Mensagem: ${Body || 'Sem conteúdo'}
      `,
    };
    await transporter.sendMail(mailOptions);

    console.log('E-mail enviado com sucesso!');
    res.status(200).send('Mensagem encaminhada por e-mail!');
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    res.status(500).send('Erro ao encaminhar a mensagem.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

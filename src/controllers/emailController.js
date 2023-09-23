const mg = require('mailgun-js');
const sg = require('@sendgrid/mail');

const { Op } = require('sequelize');
const { User } = require('../models/User');

require('dotenv').config();

const mailgun = () =>
  mg({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
    host: process.env.MAILGUN_HOST,
  });

sg.setApiKey(process.env.SENDGRID_API_KEY);

const createEmail = async (req, res) => {
  const { to, subject, message } = req.body;
  const userId = req.user; 
  console.log(req.user);

  try {
    const user = await User.findByPk(userId.id);

    if (!user) {
        return res.status(403).json({ message: "Usuario no encontrado." });
      }

    if (user.mailPerDay >= 1000) {
      return res
        .status(403)
        .json({ message: 'Has alcanzado tu límite diario de correos electrónicos.' });
    }

    const emailInfo = {
      from: 'schcolnikj@gmail.com',
      to: `${to}`,
      subject: `${subject}`,
      text: `${message}`,
      html: '<h1>Hello, this is a test</h1>',
    };

    mailgun().messages().send(emailInfo, async (error, body) => {
      if (error) {
        try {
          sg.send(emailInfo).catch((err) => new Error(err));
          res.status(200).json({message: 
            'Tuvimos problemas para enviar el correo, gracias por esperar mientras cambiábamos de sistema. El correo ya se envió exitosamente!'}
          );

          user.mailPerDay += 1;
          await user.save();
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      } else {
        res.status(200).send({ message: 'Correo enviado correctamente!' });
        user.mailPerDay += 1;
        await user.save();
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getEmails = async (req, res ) => {
  try {
    const user = req.user;

    if(user.isAdmin) {
      const stats = await User.findAll({
        attributes: ['name', 'email', 'mailPerDay'],
        where: {
          mailPerDay: {
            [Op.gt]: 0,
          }
        },
      });

      res.status(200).json(stats)
    } else {
      res.status(403).json({ message: 'Acceso prohibido.'})
    }
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener estadísticas.' });
  }
}

module.exports = {
  createEmail,
  getEmails,
};
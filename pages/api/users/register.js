import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import User from '../../../model/userModal';
import db from '../../../utils/db';
import { signToken } from '../../../utils/auth';

const handler = nc();

handler.post(async (req, res) => {
  await db.connect();
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
    isAdmin: false,
    // avatar: User.avatar
  });
  
  const user = await newUser.save();
  await db.disconnect();

  const token = signToken(user);
    res.send({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar
    });
  
});

export default handler;
import nc from 'next-connect';
import Coupon from '../../../model/couponMModel';
import db from '../../../utils/db';
import { signToken } from '../../../utils/auth';

const handler = nc();

handler.post(async (req, res) => {
  await db.connect();
  const newCoupon = new Coupon({
    name: req.body.name,
    email: req.body.email,
    
    isAdmin: false,
  });
  
  const coupon = await newCoupon.save();
  await db.disconnect();

  const token = signToken(coupon);
    res.send({
      token,
      _id: coupon._id,
      nameCoupon: coupon.name,
      
    });
  
});

export default handler;
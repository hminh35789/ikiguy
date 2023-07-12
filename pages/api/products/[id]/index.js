import nc from 'next-connect';
import Product from '../../../../model/productModal';
import db from '../../../../utils/db';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
 
  res.send(product);
});
export default handler;
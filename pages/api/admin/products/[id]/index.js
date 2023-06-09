import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../../utils/auth';
import Product from '../../../../../model/productModal';
import db from '../../../../../utils/db';

const handler = nc();
handler.use(isAuth, isAdmin);



handler.get(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
});

handler.put(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    product.name = req.body.name;
    product.slug = req.body.slug;
    product.price = req.body.price;
    product.category = req.body.category;
    product.image = req.body.image;
    product.brand = req.body.brand;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;
    product.isFeatured = req.body.isFeatured;
    product.featuredImage = req.body.featuredImage;
    await product.save();
    await db.disconnect();
    res.send({ message: 'Product updated successfully' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Product not found' });
  }
});

handler.delete(async (req, res) => {
  try {
    await db.connect();
    const {id} = req.query
    await Product.findByIdAndDelete(id);
    await db.disconnect();
    res.send({ message: 'Product Deleted' });
  } catch (error) {
    await db.disconnect();
    res.status(404).send({ message: 'Product Not Found' });
  }
  
 
});

export default handler;
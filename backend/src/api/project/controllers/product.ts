import find from './product/find';
import findOne from './product/findOne';
import create from './product/create';
import update from './product/update';
import deleteProduct from './product/delete';

export default {
  find,
  findOne,
  create,
  update,
  delete: deleteProduct,
};

import config from 'config';
import { authHeader, handleResponse } from '@/helpers';
import axios from 'axios';

export const productService = {
	addProduct,
	deleteProduct,
	updateProduct,
	getAllProduct,
  addQuantity
};

function addProduct(product) {
  return axios.post(`${config.apiUrl}/product`, product)
  .then(res => {
    return res.data;
  });
}

function deleteProduct(productId) {
  axios.delete(`${config.apiUrl}/product`+ productId)
  .then(res => {
    console.log(res);
  });
}

function updateProduct(product) {
	axios.put(`${config.apiUrl}/product`, product )
  .then(res => {
    console.log(res);
  });
}

function addQuantity(id, quantity) {
  axios.put(`${config.apiUrl}/product/` + id + `/add/` + quantity)
  .then(res => {
    console.log(res);
  });
}

function getAllProduct() {
	return axios.get(`${config.apiUrl}/product`);
}
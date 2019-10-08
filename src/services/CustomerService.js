import config from 'config';
import { authHeader, handleResponse } from '@/helpers';
import axios from 'axios';

export const customerService = {
	addCustomer,
	deleteCustomer,
	updateCustomer,
	getAllCustomers
};

function addCustomer(customer) {
  return axios.post(`${config.apiUrl}/customer`, customer)
  .then(res => {
    return res.data;
  });
}

function deleteCustomer(customerId) {
  axios.delete(`${config.apiUrl}/customer/`+ customerId)
  .then(res => {
    console.log(res);
  });
}

function updateCustomer(customer) {
	axios.put(`${config.apiUrl}/customer`, customer )
  .then(res => {
    console.log(res);
  });
}

function getAllCustomers() {
	return axios.get(`${config.apiUrl}/customer`);
}
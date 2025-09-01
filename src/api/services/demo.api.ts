import { apiClient } from '../client';

export class DemoAPI {
  static async websites() {
    return apiClient.get('/api/demo/websites');
  }

  static async stores() {
    return apiClient.get('/api/demo/stores');
  }

  static async orders() {
    return apiClient.get('/api/demo/orders');
  }

  static async products() {
    return apiClient.get('/api/demo/products');
  }

  static async supportTickets() {
    return apiClient.get('/api/demo/support-tickets');
  }

  static async chatbots() {
    return apiClient.get('/api/demo/chatbots');
  }
}



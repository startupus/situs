import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { demoOrders, demoProducts, demoStores, demoSupportTickets, demoWebsites, demoChatbots } from './demo.data';

@Controller('demo')
export class DemoController {
  @Get('websites')
  @Public()
  getWebsites() {
    return { success: true, data: demoWebsites };
  }

  @Get('stores')
  @Public()
  getStores() {
    return { success: true, data: demoStores };
  }

  @Get('orders')
  @Public()
  getOrders() {
    return { success: true, data: demoOrders };
  }

  @Get('products')
  @Public()
  getProducts() {
    return { success: true, data: demoProducts };
  }

  @Get('support-tickets')
  @Public()
  getSupportTickets() {
    return { success: true, data: demoSupportTickets };
  }

  @Get('chatbots')
  @Public()
  getChatbots() {
    return { success: true, data: demoChatbots };
  }
}

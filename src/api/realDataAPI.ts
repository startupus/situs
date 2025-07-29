// Временная заглушка для обратной совместимости 
// TODO: Полностью мигрировать на новые API сервисы

class RealDataAPI {
  async getSites() {
    return [];
  }
  
  async getSite(id: string) {
    return null;
  }
  
  async createSite(site: any) {
    return { id: '1', ...site };
  }
  
  async updateSite(id: string, site: any) {
    return { id, ...site };
  }
  
  async createPage(page: any) {
    return { id: '1', ...page };
  }
  
  async updatePage(id: string, page: any) {
    return { id, ...page };
  }
  
  async deletePage(id: string) {
    return;
  }
}

export default new RealDataAPI(); 
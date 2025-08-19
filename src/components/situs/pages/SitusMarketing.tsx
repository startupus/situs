import React, { useState } from "react";
import { 
  FiTarget, FiSearch, FiMail, FiSmartphone, FiBarChart, 
  FiGlobe, FiShoppingCart, FiMessageSquare, FiFile,
  FiUsers, FiSettings, FiDollarSign, FiTrendingUp,
  FiZap
} from 'react-icons/fi';

interface MarketingProject {
  id: string;
  name: string;
  type: "website" | "store" | "chatbot";
  conversionRate: number;
  monthlyVisitors: number;
  revenue: number;
  roi: number;
}

interface MarketingTool {
  id: string;
  name: string;
  category: "seo" | "advertising" | "email" | "social" | "analytics" | "partnerships";
  description: string;
  icon: string;
  status: "active" | "inactive" | "pending";
  performance: number;
}

interface PartnerProgram {
  id: string;
  name: string;
  type: "affiliate" | "referral" | "integration";
  commission: number;
  activePartners: number;
  monthlyEarnings: number;
  status: "active" | "paused";
}

const SitusMarketing: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Mock data для проектов
  const marketingProjects: MarketingProject[] = [
    {
      id: "1",
      name: "Корпоративный сайт",
      type: "website",
      conversionRate: 3.2,
      monthlyVisitors: 15420,
      revenue: 245000,
      roi: 380
    },
    {
      id: "2", 
      name: "Интернет-магазин",
      type: "store",
      conversionRate: 2.8,
      monthlyVisitors: 8650,
      revenue: 156000,
      roi: 420
    },
    {
      id: "3",
      name: "Чат-бот поддержки",
      type: "chatbot",
      conversionRate: 1.9,
      monthlyVisitors: 3200,
      revenue: 45000,
      roi: 280
    }
  ];

  // Mock data для маркетинговых инструментов
  const marketingTools: MarketingTool[] = [
    {
      id: "1",
      name: "Google Ads",
      category: "advertising",
      description: "Контекстная реклама в поисковых системах",
      icon: "target",
      status: "active",
      performance: 92
    },
    {
      id: "2",
      name: "SEO оптимизация",
      category: "seo", 
      description: "Продвижение в органической выдаче",
      icon: "search",
      status: "active",
      performance: 85
    },
    {
      id: "3",
      name: "Email рассылки",
      category: "email",
      description: "Автоматизированный email-маркетинг",
      icon: "mail",
      status: "active",
      performance: 78
    },
    {
      id: "4",
      name: "Социальные сети",
      category: "social",
      description: "SMM продвижение в социальных сетях",
      icon: "smartphone",
      status: "pending",
      performance: 65
    },
    {
      id: "5",
      name: "Яндекс.Метрика",
      category: "analytics",
      description: "Глубокая аналитика поведения пользователей",
      icon: "bar-chart",
      status: "active",
      performance: 95
    }
  ];

  // Mock data для партнерских программ
  const partnerPrograms: PartnerProgram[] = [
    {
      id: "1",
      name: "Реферальная программа",
      type: "referral",
      commission: 15,
      activePartners: 24,
      monthlyEarnings: 48500,
      status: "active"
    },
    {
      id: "2",
      name: "Афилиатская сеть",
      type: "affiliate", 
      commission: 8,
      activePartners: 156,
      monthlyEarnings: 127300,
      status: "active"
    },
    {
      id: "3",
      name: "API интеграции",
      type: "integration",
      commission: 25,
      activePartners: 12,
      monthlyEarnings: 89400,
      status: "paused"
    }
  ];

  const getProjectTypeIcon = (type: string) => {
    switch (type) {
      case "website": return <FiGlobe size={16} />;
      case "store": return <FiShoppingCart size={16} />;
      case "chatbot": return <FiMessageSquare size={16} />;
      default: return <FiFile size={16} />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "seo": return <FiSearch size={16} />;
      case "advertising": return <FiTarget size={16} />;
      case "email": return <FiMail size={16} />;
      case "social": return <FiSmartphone size={16} />;
      case "analytics": return <FiBarChart size={16} />;
      case "partnerships": return <FiUsers size={16} />;
      default: return <FiSettings size={16} />;
    }
  };

  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case "target": return <FiTarget size={24} className="text-primary" />;
      case "search": return <FiSearch size={24} className="text-primary" />;
      case "mail": return <FiMail size={24} className="text-primary" />;
      case "smartphone": return <FiSmartphone size={24} className="text-primary" />;
      case "bar-chart": return <FiBarChart size={24} className="text-primary" />;
      default: return <FiSettings size={24} className="text-primary" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "inactive": return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      case "paused": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const filteredTools = marketingTools.filter(tool => 
    selectedCategory === "all" || tool.category === selectedCategory
  );

  const totalRevenue = marketingProjects.reduce((sum, project) => sum + project.revenue, 0);
  const averageROI = marketingProjects.reduce((sum, project) => sum + project.roi, 0) / marketingProjects.length;
  const totalVisitors = marketingProjects.reduce((sum, project) => sum + project.monthlyVisitors, 0);
  const totalPartnerEarnings = partnerPrograms.reduce((sum, program) => sum + program.monthlyEarnings, 0);

  return (
    <div className="flex min-h-screen">
      {/* Боковое меню маркетинга */}
      <div className="w-80 border-r border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-dark dark:text-white">
            Маркетинг
          </h1>
          <p className="text-body-color dark:text-dark-6 mt-2">
            Аналитика и инструменты развития проектов
          </p>
        </div>

        {/* Фильтр по проектам */}
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-medium text-dark dark:text-white">
            Проекты
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedProject("all")}
              className={`w-full rounded-lg p-3 text-left transition-colors ${
                selectedProject === "all"
                  ? "bg-primary text-white"
                  : "hover:bg-gray-50 dark:hover:bg-dark-3"
              }`}
            >
              <FiBarChart size={16} className="mr-2" />
              Все проекты
            </button>
            {marketingProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project.id)}
                className={`w-full rounded-lg p-3 text-left transition-colors ${
                  selectedProject === project.id
                    ? "bg-primary text-white"
                    : "hover:bg-gray-50 dark:hover:bg-dark-3"
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-2">{getProjectTypeIcon(project.type)}</span>
                  <div>
                    <div className="font-medium">{project.name}</div>
                    <div className="text-sm opacity-70">
                      ROI: {project.roi}%
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Фильтр по категориям инструментов */}
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-medium text-dark dark:text-white">
            Категории инструментов
          </h3>
          <div className="space-y-2">
            {["all", "seo", "advertising", "email", "social", "analytics", "partnerships"].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full rounded-lg p-2 text-left transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-white"
                    : "hover:bg-gray-50 dark:hover:bg-dark-3"
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-2">{getCategoryIcon(category)}</span>
                  {category === "all" ? "Все категории" : 
                   category === "seo" ? "SEO" :
                   category === "advertising" ? "Реклама" :
                   category === "email" ? "Email-маркетинг" :
                   category === "social" ? "Соцсети" :
                   category === "analytics" ? "Аналитика" :
                   category === "partnerships" ? "Партнерство" : category}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Основная область */}
      <div className="flex-1 p-6">
        {/* Статистические карточки */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow-1 dark:bg-dark-2 dark:shadow-box-dark">
            <div className="flex items-center">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800">
                <FiDollarSign className="text-xl text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-dark dark:text-white">
                  {new Intl.NumberFormat('ru-RU').format(totalRevenue)} ₽
                </h3>
                <p className="text-body-color dark:text-dark-6">Общая выручка</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-1 dark:bg-dark-2 dark:shadow-box-dark">
            <div className="flex items-center">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-800">
                <FiTrendingUp className="text-xl text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-dark dark:text-white">
                  {Math.round(averageROI)}%
                </h3>
                <p className="text-body-color dark:text-dark-6">Средний ROI</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-1 dark:bg-dark-2 dark:shadow-box-dark">
            <div className="flex items-center">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-800">
                <FiUsers className="text-xl text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-dark dark:text-white">
                  {new Intl.NumberFormat('ru-RU').format(totalVisitors)}
                </h3>
                <p className="text-body-color dark:text-dark-6">Посетители/месяц</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-1 dark:bg-dark-2 dark:shadow-box-dark">
            <div className="flex items-center">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-800">
                <FiUsers className="text-xl text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-dark dark:text-white">
                  {new Intl.NumberFormat('ru-RU').format(totalPartnerEarnings)} ₽
                </h3>
                <p className="text-body-color dark:text-dark-6">Партнерские доходы</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          {/* Маркетинговые инструменты */}
          <div className="rounded-lg bg-white p-6 shadow-1 dark:bg-dark-2 dark:shadow-box-dark">
            <div className="mb-6 flex items-center justify-between">
              <h5 className="text-xl font-semibold text-dark dark:text-white">
                Маркетинговые инструменты
              </h5>
              <button className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary-dark">
                Добавить инструмент
              </button>
            </div>
            
            <div className="space-y-4">
              {filteredTools.map((tool) => (
                <div key={tool.id} className="flex items-center justify-between rounded-lg border border-stroke p-4 dark:border-dark-3">
                  <div className="flex items-center">
                    <div className="mr-3">{getToolIcon(tool.icon)}</div>
                    <div>
                      <h6 className="font-medium text-dark dark:text-white">{tool.name}</h6>
                      <p className="text-sm text-body-color dark:text-dark-6">{tool.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(tool.status)}`}>
                      {tool.status === "active" ? "Активен" : 
                       tool.status === "pending" ? "Ожидает" : "Неактивен"}
                    </div>
                    <div className="mt-1 text-sm font-medium text-dark dark:text-white">
                      {tool.performance}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Партнерские программы */}
          <div className="rounded-lg bg-white p-6 shadow-1 dark:bg-dark-2 dark:shadow-box-dark">
            <div className="mb-6 flex items-center justify-between">
              <h5 className="text-xl font-semibold text-dark dark:text-white">
                Партнерские программы
              </h5>
              <button className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary-dark">
                Создать программу
              </button>
            </div>
            
            <div className="space-y-4">
              {partnerPrograms.map((program) => (
                <div key={program.id} className="rounded-lg border border-stroke p-4 dark:border-dark-3">
                  <div className="mb-3 flex items-center justify-between">
                    <h6 className="font-medium text-dark dark:text-white">{program.name}</h6>
                    <div className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(program.status)}`}>
                      {program.status === "active" ? "Активна" : "Приостановлена"}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-body-color dark:text-dark-6">Комиссия</p>
                      <p className="font-medium text-dark dark:text-white">{program.commission}%</p>
                    </div>
                    <div>
                      <p className="text-body-color dark:text-dark-6">Партнеры</p>
                      <p className="font-medium text-dark dark:text-white">{program.activePartners}</p>
                    </div>
                    <div>
                      <p className="text-body-color dark:text-dark-6">Доход/месяц</p>
                      <p className="font-medium text-dark dark:text-white">
                        {new Intl.NumberFormat('ru-RU').format(program.monthlyEarnings)} ₽
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Рекомендации по развитию */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow-1 dark:bg-dark-2 dark:shadow-box-dark">
          <h5 className="mb-6 text-xl font-semibold text-dark dark:text-white">
            Рекомендации по развитию
          </h5>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-lg border border-stroke p-4 dark:border-dark-3">
              <div className="mb-3 flex items-center">
                <FiTarget className="mr-2 text-xl text-primary" />
                <h6 className="font-medium text-dark dark:text-white">Ретаргетинг</h6>
              </div>
              <p className="text-sm text-body-color dark:text-dark-6">
                Настройте ретаргетинг для повышения конверсии на 15-25%
              </p>
              <button className="mt-3 text-sm text-primary hover:underline">
                Настроить →
              </button>
            </div>

            <div className="rounded-lg border border-stroke p-4 dark:border-dark-3">
              <div className="mb-3 flex items-center">
                <FiMail className="mr-2 text-xl text-primary" />
                <h6 className="font-medium text-dark dark:text-white">Email-воронка</h6>
              </div>
              <p className="text-sm text-body-color dark:text-dark-6">
                Автоматизируйте email-последовательности для увеличения LTV
              </p>
              <button className="mt-3 text-sm text-primary hover:underline">
                Создать воронку →
              </button>
            </div>

            <div className="rounded-lg border border-stroke p-4 dark:border-dark-3">
              <div className="mb-3 flex items-center">
                <FiZap className="mr-2 text-xl text-primary" />
                <h6 className="font-medium text-dark dark:text-white">A/B тестирование</h6>
              </div>
              <p className="text-sm text-body-color dark:text-dark-6">
                Запустите тесты лендингов для оптимизации конверсии
              </p>
              <button className="mt-3 text-sm text-primary hover:underline">
                Запустить тест →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitusMarketing; 
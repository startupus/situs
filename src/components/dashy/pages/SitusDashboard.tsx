import DataStats from '../DataStats.jsx';

const SitusDashboard = () => {
  return (
    <>
      <div className="w-full">
        <DataStats />
      </div>

      <div className="w-full">
        <div className="shadow-1 dark:bg-dark-2 dark:shadow-box-dark rounded-[10px] bg-white p-6">
          <h2 className="text-xl font-semibold text-dark dark:text-white mb-4">Добро пожаловать в Situs Platform</h2>
          <p className="text-body-color dark:text-dark-6 mb-6">
            Управляйте вашими проектами, страницами и заказами в одном месте.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-lg">
              <h3 className="font-semibold text-dark dark:text-white mb-2">Быстрый старт</h3>
              <p className="text-sm text-body-color dark:text-dark-6">Создайте новый проект за несколько кликов</p>
            </div>

            <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-dark dark:text-white mb-2">Заказы</h3>
              <p className="text-sm text-body-color dark:text-dark-6">Управляйте заказами и заявками клиентов</p>
            </div>

            <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-dark dark:text-white mb-2">Редактор</h3>
              <p className="text-sm text-body-color dark:text-dark-6">Создавайте страницы с визуальным редактором</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SitusDashboard;

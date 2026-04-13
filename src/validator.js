import fs from 'fs/promises'; // ПОЧЕМУ: работаем асинхронно, чтобы не блокировать поток при чтении тяжелых отчетов
import chalk from 'chalk';

async function validateData() {
  try {
    // Читаем базу данных испытаний
    const data = await fs.readFile('./data/db.json', 'utf-8');
    const parsed = JSON.parse(data);

    // 1. Проверяем корневую структуру для стейта React
    if (!parsed.products || !Array.isArray(parsed.products)) {
      throw new Error('Некорректная структура: отсутствует реестр изделий');
    }

    // 2. Валидация под специфику «Виртуальных испытаний»
    const isValid = parsed.products.every(product => {
      // ПОЧЕМУ: Для виртуального моделирования важен ID (связь с чертежом) 
      // и наличие числовых характеристик для расчетов
      return (
        product.id && 
        typeof product.name === 'string' &&
        !isNaN(parseFloat(product.price)) // В контексте испытаний это может быть "предельная нагрузка" или "стоимость материала"
      );
    });

    if (isValid) {
      console.log(chalk.blue('🔍 Валидация пройдена: данные пригодны для виртуального моделирования.'));
      console.log(chalk.gray(`Проверено объектов: ${parsed.products.length}`));
    } else {
      console.log(chalk.red('❌ Ошибка данных: найдены объекты с неполными характеристиками для испытаний.'));
    }

  } catch (error) {
    // Используем желтый для предупреждений, как советовал Виталий Валентинович
    console.error(chalk.yellow('⚠️ Ошибка валидации:'), error.message);
  }
}

validateData();

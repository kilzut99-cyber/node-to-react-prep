import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

// Настройка путей для ES-модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function validateDatabase() {
  const dataPath = path.join(__dirname, '../data/db.json');
  // ПОЧЕМУ: Используем path.join для формирования абсолютного пути, чтобы скрипт корректно находил файл db.json вне зависимости от того, из какой папки запущен терминал.

  try {
    // Чтение данных
    const rawData = await fs.readFile(dataPath, 'utf-8');
    // ПОЧЕМУ: Используем асинхронный readFile, чтобы не блокировать выполнение других процессов (Non-blocking I/O).
    
    const tasks = JSON.parse(rawData);

    console.log(chalk.blue('--- Запуск валидации данных (Машиностроение) ---'));

    tasks.forEach((task, index) => {
      const errors = [];

      // Проверка структуры (ЭТАП 2 JUNIOR)
      if (!task.id) errors.push("Отсутствует уникальный ID");
      if (!task.title) errors.push("Отсутствует название испытания");
      if (task.industry !== 'machinery') errors.push("Неверная отраслевая принадлежность");

      if (errors.length === 0) {
        console.log(chalk.green(`[OK] Запись ${index + 1}: ${task.title}`));
      } else {
        console.log(chalk.red(`[ERROR] Запись ${index + 1}: ${errors.join(', ')}`));
      }
    });

    console.log(chalk.blue('-----------------------------------------------'));
  } catch (error) {
    // ПОЧЕМУ: Оборачиваем в try...catch, чтобы в случае отсутствия файла или ошибки в JSON программа не "падала", а выводила понятное сообщение.
    console.error(chalk.bgRed(' ОШИБКА ЧТЕНИЯ БАЗЫ ДАННЫХ: '), error.message);
  }
}

validateDatabase();

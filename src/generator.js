import fs from 'fs/promises'; 
import path from 'path';
import { fileURLToPath } from 'url';
import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';
import chalk from 'chalk';

// Настройка путей для ES-модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateData() {
  try {
    const tasks = Array.from({ length: 5 }, () => ({
      id: nanoid(), // ПОЧЕМУ: React нужны уникальные key для идентификации элементов списка
      title: `Испытание: ${faker.commerce.productMaterial()}`,
      priority: faker.helpers.arrayElement(['Low', 'High', 'Critical']),
      industry: 'machinery'
    }));

    const dataPath = path.join(__dirname, '../data/db.json'); 
    // ПОЧЕМУ: path.join гарантирует правильные слэши (/) в путях на Windows и Linux

    await fs.writeFile(dataPath, JSON.stringify(tasks, null, 2)); 
    // ПОЧЕМУ: writeFile (асинхронный) не блокирует основной поток, в отличие от writeFileSync

    console.log(chalk.green('✔ Успех: База задач для машиностроения создана!'));
  } catch (error) {
    console.error(chalk.red('✘ Ошибка генерации:'), error);
  }
}
generateData();

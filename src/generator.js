import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';
import fs from 'fs/promises'; // ПОЧЕМУ: асинхронность обязательна для неблокирующего Event Loop
import path from 'path';
import chalk from 'chalk';

const DB_PATH = path.join('data', 'db.json');

async function generateData() {
  try {
    const products = Array.from({ length: 10 }, () => ({
      // ПОЧЕМУ nanoid: в React это уникальный key для рендеринга строк в таблице испытаний
      id: nanoid(), 
      // Специфика: название детали и её инженерные параметры
      name: faker.commerce.productMaterial() + " " + faker.commerce.productName(),
      strengthLimit: faker.number.int({ min: 200, max: 800 }), // МПа (Предел прочности)
      tolerance: faker.number.float({ min: 0.01, max: 0.1, fractionDigits: 2 }) // Допуск в мм
    }));

    const data = JSON.stringify({ products }, null, 2);
    
    // Используем await, чтобы не блокировать поток выполнения
    await fs.writeFile(DB_PATH, data); 
    
    console.log(chalk.green('✅ Данные для виртуальных испытаний успешно сгенерированы!'));
  } catch (error) {
    console.error(chalk.red('❌ Ошибка генерации:'), error.message);
  }
}

generateData();


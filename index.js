import { dirname } from 'path';
import { fileURLToPath } from 'url';
// import { readFile } from 'fs/promises';
import fetch from 'node-fetch';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const fetchData = async (path, startDate, endDate) => {
  try {
    const { BASE_URL, EMAIL, KEY } = process.env;

    const headers = {
      'User-Agent': EMAIL, Authorization: `Basic ${Buffer.from(`${EMAIL}:${KEY}`).toString('base64')}`, 'Content-Type': 'application/json',
    };

    let queryParams = '';
    if (!path) {
      throw new Error('path is not defined');
    }
    if (startDate && endDate) {
      queryParams += `start_date=${startDate}&end_date=${endDate}`;
    }
    const response = await fetch(`${BASE_URL}/${path}?${queryParams}`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log('err', error);
  }
};

const transactions = async (initialYear, initialMonth) => {
  const currentYear = new Date().getFullYear();
  const monthsOfTheYear = 12;
  const january = 1;
  let data = [];

  if (!initialYear || !initialMonth) throw new Error('error!');

  for (let year = initialYear; year <= currentYear; year++) {
    for (let month = initialMonth; month <= monthsOfTheYear; month++) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      console.log('period', startDate, endDate);

      const transactions = await fetchData(
        'transactions',
        startDate.toISOString(),
        endDate.toISOString(),
      );

      if (transactions.length === 0) {
        console.log('not found transaction');
        continue;
      }

      data = [...data, ...transactions];
    }
    initialMonth = january;
  }

  return data;
};

const __dirname = dirname(fileURLToPath(import.meta.url));

const _transactions = await transactions(2018, 5);

fs.writeFileSync(`${__dirname}\\transactions.json`, `{"transactions": ${JSON.stringify(_transactions)}}`);

// const _data = JSON.parse(await readFile(new URL('./transactions.json', import.meta.url)));

import { dirname } from 'path';
import { fileURLToPath } from 'url';
// import { readFile } from 'fs/promises';
import fetch from 'node-fetch';
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config();

const fetchOrganizze = async (path, start_date, end_date) => {
    try {
        const BASE_URL = process.env.BASE_URL
        const EMAIL = process.env.EMAIL
        const KEY = process.env.KEY

        const _headers = {
            'User-Agent': EMAIL,
            'Authorization': `Basic  ${Buffer.from(`${EMAIL}:${KEY}`).toString('base64')}`,
            'Content-Type': 'application/json'
        }

        let queryParams = ''
        if(!path){
            throw new Error('path is not defined')
        }
        if(start_date && end_date){
            queryParams += `start_date=${start_date}&end_date=${end_date}`
        }    
        const response = await fetch(`${BASE_URL}/${path}?${queryParams}`, {
            method: 'GET',
            headers: _headers
        })
    
        const data = await response.json();
        return data;   
    } catch (error) {
        console.log('err', error)
    }
}

const transactions = async (initialYear, initialMonth) => {
    const currentYear = new Date().getFullYear();
    const monthsOfTheYear = 12;
    let data = [];

    if(!initialYear || !initialMonth)
        throw new Error('error!')

    for (var year = initialYear; year <= currentYear; year++) {
        for(var month = initialMonth; month <= monthsOfTheYear; month++){
            const start_date = new Date(year, month - 1, 1);
            const end_date = new Date(year, month, 0);
    
            const transactions = await fetchOrganizze('transactions', start_date.toISOString(), end_date.toISOString())

            if(transactions.length === 0){
                console.log('not found transaction')
                continue;
            }
    
            data = [...data, ...transactions]
        }
    }

    return data;
}

const __dirname = dirname(fileURLToPath(import.meta.url));

const _transactions = await transactions(2018, 5)

fs.writeFileSync(`${__dirname}\\transactions.json`, `{"transactions": ${JSON.stringify(_transactions)}}`);

//const _data = JSON.parse(await readFile(new URL('./transactions.json', import.meta.url)));

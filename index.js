import fetch from 'node-fetch';
import fs from 'fs'

const fetchOrganizze = async (path, params = {}) => {
    try {
        const BASE_URL = 'https://api.organizze.com.br/rest/v2';
        const EMAIL = 'samuel.rvg@gmail.com'
        const KEY = '87f4bc78a78e9802d861d32da5ff06bf729e51ba'

        const _headers = {
            'User-Agent': 'samuel.rvg@gmail.com',
            'Authorization': `Basic  ${Buffer.from(`${EMAIL}:${KEY}`).toString('base64')}`,
            'Content-Type': 'application/json'
        }

        let queryParams = ''
        const { start_date, end_date } = params;
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

const transactions = async (anoInicial, mesInicial) => {
    const anoAtual = new Date().getFullYear();
    let data = []

    if(!anoInicial && !mesInicial)
        throw new Error('error!')

    for (var ano = anoInicial; ano <= anoAtual; ano++) {
        for(var mes = mesInicial; mes <= 12; mes++){
            const start_date = new Date(ano, mes, 1);
            const end_date = new Date(ano, mes + 1, 0);
    
            const transactions = await fetchOrganizze('transactions', {
                start_date: start_date.toISOString(),
                end_date: end_date.toISOString()
            })

            if(transactions.length === 0){
                continue;
            }
    
            data = [...data, ...transactions]
        }
    }

    return data;
}

const organizzeapi = await transactions(2018, 4)
// console.log(organizzeapi)

// fs.writeFileSync('C:\\Pasta\\transactions.txt', JSON.stringify(data));

// import { data } from './transactions.js'

// console.log('local', data.length)
console.log('organizze', organizzeapi.length)

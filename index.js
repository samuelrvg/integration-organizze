import fetch from 'node-fetch';

const BASE_URL = 'https://api.organizze.com.br/rest/v2';
const EMAIL = 'samuel.rvg@gmail.com'
const KEY = '87f4bc78a78e9802d861d32da5ff06bf729e51ba'

const _headers = {
    'User-Agent': 'samuel.rvg@gmail.com',
    'Authorization': `Basic  ${Buffer.from(`${EMAIL}:${KEY}`).toString('base64')}`,
    'Content-Type': 'application/json'
}

const fetchOrganizze = async (path) => {
    try {
        if(!path){
            throw new Error('path is not defined')
        }
    
        const response = await fetch(`${BASE_URL}/${path}`, {
            method: 'GET',
            headers: _headers
        })
    
        const data = await response.json();
        return data;   
    } catch (error) {
        console.log('err', error)
    }
}

const accounts = await fetchOrganizze('accounts')
console.log(accounts)


// fetch(`${BASE_URL}/accounts`, {
//     method: 'GET',
//     headers: _headers
// }).then(r => r.json()).then(r => console.log(r));

// fetch(`${BASE_URL}/categories`, {
//     method: 'GET',
//     headers: _headers
// }).then(r => r.json()).then(r => console.log(r));

// fetch(`${BASE_URL}/credit_cards`, {
//     method: 'GET',
//     headers: _headers
// }).then(r => r.json()).then(r => console.log(r));

// fetch(`${BASE_URL}/transactions`, {
//     method: 'GET',
//     headers: _headers
// }).then(r => r.json()).then(r => console.log(r));

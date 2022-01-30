import fs from 'fs'

const { transactions } = JSON.parse(fs.readFileSync('./transactions.json'));

const filterTransactions = (description, earning = false, expense = false) => {
    let data = transactions;
    if(description)
        data = data.filter(e => e.description === description)
    if(earning)
        data = data.filter(e => e.amount_cents > 0)
    if(expense)
        data = data.filter(e => e.amount_cents < 0)

    return data;
}

console.log(filterTransactions('').length)

// const data = transactions
//     .filter(e => e.description === '' && e.amount_cents > 0)
//     .map(e => e.amount_cents)
//     .reduce((partialSum, a) => partialSum + (a / 100), 0);

// console.log('data', data)
// console.log('resultado', 14873.82)
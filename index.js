const pup = require('puppeteer')

const url = 'https://www.mercadolivre.com.br'
const searchTerm = 'Macbook'
let list = []

let c = 1;

(async () => {
  const browser = await pup.launch({ headless: false })
  const page = await browser.newPage()

  await page.goto(url)

  await page.waitForSelector('#cb1-edit')

  await page.type('#cb1-edit', searchTerm)

  await Promise.all([
    page.click('.nav-search-btn'),
    page.waitForNavigation()
  ])
  console.log('estou aq')

  const links = await page.$$eval('.ui-search-result__image > a', el => el.map(link => link.href))

  for (const link of links) {
    if (c === 10) continue
    await page.goto(link)
    await page.waitForSelector('.ui-pdp-title')

    const title = await page.$eval('.ui-pdp-title', (element) => element.innerText) 
    const price = await page.$eval('.andes-money-amount__fraction', (element) => element.innerText)

    const obj = {
      title,
      price,
      link
    }

    list.push(obj)

    c++

  }

  console.log(list)
  new Promise(r => setTimeout(r, 3000));
  await browser.close()
})()
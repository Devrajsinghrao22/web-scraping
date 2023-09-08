const { default: puppeteer } = require('puppeteer')
const { writeFile, readFile } = require('fs/promises')
const { load } = require('cheerio')

const main = async () => {
    const browse = await puppeteer.launch({
        headless: false,
        defaultViewport: {
          height: 600,
          width: 1400,
        }
      })
    const page = await browse.newPage()
    await page.goto('https://www.myntra.com/men-jackets')

    const productsData = []
    const $ = load(await page.content())
    $('.results-base > li').each((_, el) => {
        // productsData.push({
        // name: $(el).text()
        // })
        const productcard = $(el);
        const title = productcard.find('.product-brand').text().trim();
        const price = productcard.find('.product-discountedPrice').text().trim();
        const imagelink = productcard.find('img.img-responsive').attr('src');

    productsData.push({
        title,
        price,
        imagelink,
    })
})
    const data = JSON.stringify(productsData, null, 2);
    await writeFile('products.json',data);
    await browse.close();
    
}
main()

// const second = async () => {
//     const productsData = JSON.parse(await readFile('products.json', 'utf-8'))
//     console.log(Object.entries(productsData[0]))
// }

// second()
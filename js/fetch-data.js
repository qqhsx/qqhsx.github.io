document.addEventListener('DOMContentLoaded', function() {
    const bitcoinPriceDiv = document.getElementById('bitcoin-price');
    const dailyNewsDiv = document.getElementById('daily-news');

    function fetchBitcoinPrice() {
        fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('网络响应失败');
                }
                return response.json();
            })
            .then(bitcoinData => {
                const usdRate = bitcoinData.bpi.USD.rate;
                bitcoinPriceDiv.innerHTML = `当前比特币价格：$${usdRate}`;
            })
            .catch(error => {
                console.error('获取比特币价格失败:', error);
                bitcoinPriceDiv.innerHTML = '获取比特币价格失败';
            });
    }

    function fetchHolidayInfo() {
        fetch('https://timor.tech/api/holiday/tts')
            .then(response => {
                if (!response.ok) {
                    throw new Error('网络响应失败');
                }
                return response.json();
            })
            .then(holidayData => {
                const holidayMessage = holidayData.tts;
                dailyNewsDiv.innerHTML = `<p>${holidayMessage}</p>`;
            })
            .catch(error => {
                console.error('获取节假日信息失败:', error);
                dailyNewsDiv.innerHTML = '获取节假日信息失败';
            });
    }

    // 初次加载数据
    fetchBitcoinPrice();
    fetchHolidayInfo();

    // 设置自动刷新，每毫秒刷新一次
    setInterval(fetchBitcoinPrice, 100);
    setInterval(fetchHolidayInfo, 100);
});
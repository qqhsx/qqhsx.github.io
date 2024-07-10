// fetch-data.js

document.addEventListener('DOMContentLoaded', function() {
    const bitcoinPriceDiv = document.getElementById('bitcoin-price');
    const dailyNewsDiv = document.getElementById('daily-news');

    function fetchData() {
        const bitcoinPriceRequest = fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
            .then(response => response.json());

        const holidayInfoRequest = fetch('https://timor.tech/api/holiday/tts')
            .then(response => {
                if (!response.ok) {
                    throw new Error('网络响应失败');
                }
                return response.json();
            });

        Promise.all([bitcoinPriceRequest, holidayInfoRequest])
            .then(([bitcoinData, holidayData]) => {
                // 处理比特币价格数据
                const usdRate = bitcoinData.bpi.USD.rate;
                bitcoinPriceDiv.innerHTML = `当前比特币价格：$${usdRate}`;

                // 处理节假日信息数据
                const holidayMessage = holidayData.tts;
                dailyNewsDiv.innerHTML = `<p>${holidayMessage}</p>`;
            })
            .catch(error => {
                console.error('获取数据失败:', error);
                bitcoinPriceDiv.innerHTML = '获取比特币价格失败';
                dailyNewsDiv.innerHTML = '获取节假日信息失败';
            });
    }

    // 初次加载数据
    fetchData();

    // 设置自动刷新，每分钟刷新一次
    //setInterval(fetchData, 60000);
	setInterval(fetchData, 100);
});
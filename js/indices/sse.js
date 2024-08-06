document.addEventListener('DOMContentLoaded', function() {
    // 创建一个函数，用于处理 JSONP 数据
    window.historySearchHandler = function(data) {
        const stockDataContainer = document.getElementById('stock-data');
        let selectedDataHtml = '';

        // 检查数据是否符合预期
        if (data.length === 0) {
            selectedDataHtml += '<p>没有数据可显示</p>';
        } else {
            // 遍历每只股票的数据
            data.forEach(stock => {
                if (stock.hq && stock.hq.length > 0) {
                    const item = stock.hq[0]; // 选择第一个数据项进行显示
                    const [日期, 今开, 当前价, 涨跌额, 涨跌幅, 最低, 最高, 总手, 成交额, 换手率] = item;

                    // 获取股票代码和名称
                    const stockCode = stock.code; // 股票代码
                    const stockName = {
                        'zs_000001': '上证综合指数',
                        'zs_000016': '上证50',
                        'zs_399300': '沪深300'
                    }[stockCode] || '未知股票'; // 根据股票代码设置名称

                    // 选择需要显示的数据
                    const currentPrice = 当前价;
                    const changeRate = 涨跌幅;

                    selectedDataHtml += `
                        <div class="selected-data-box">
                            <strong>${stockCode}</strong>
                            <div class="stock-name">${stockName}</div>
                            <div class="price-change-container">
                                <div class="price">${currentPrice}</div>
                                <div class="change-rate">${changeRate}</div>
                            </div>
                        </div>
                    `;
                }
            });
        }
        stockDataContainer.innerHTML = selectedDataHtml;
    };

    // 使用有效的接口进行测试
    const script = document.createElement('script');
    script.src = 'https://q.stock.sohu.com/hisHq?code=zs_000016,zs_000001,zs_399300&stat=1&order=D&period=d&callback=historySearchHandler&rt=jsonp';
    document.body.appendChild(script);
});

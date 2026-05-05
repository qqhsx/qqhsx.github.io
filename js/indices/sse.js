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
                        'zs_000001': '上证指数',
                        'zs_000016': '上证50',
                        'zs_399300': '沪深300',
                        'zs_399106': '深证综指',
                        'zs_399005': '中小100',
                        'zs_399006': '创业板指',
						'zs_899050': '北证50',
                        'zs_399001': '深证成指' // 新增的股票名称
                    }[stockCode] || '未知股票'; // 根据股票代码设置名称

                    // 确定涨跌幅的颜色
                    const changeRateClass = 涨跌幅.startsWith('-') ? 'down' : 'up';

                    // 选择需要显示的数据
                    const currentPrice = 当前价;
                    const changeRate = 涨跌幅;

                    selectedDataHtml += `
                        <div class="selected-data-box">
                            <strong>${stockCode}</strong>
                            <div class="stock-name">${stockName}</div>
                            <div class="price-change-container">
                                <div class="price">${currentPrice}</div>
                                <div class="change-rate ${changeRateClass}">${changeRate}</div>
                            </div>
                        </div>
                    `;
                }
            });
        }
        stockDataContainer.innerHTML = selectedDataHtml;
    };

    // 使用有效的接口进行测试，包含新股票代码
    const script = document.createElement('script');
    script.src = 'https://q.stock.sohu.com/hisHq?code=zs_000001,zs_399001,zs_899050,zs_399006,zs_399300,zs_000016,zs_399106,zs_399005&stat=1&order=D&period=d&callback=historySearchHandler&rt=jsonp';
    document.body.appendChild(script);

    // 获取按钮和容器
    const scrollLeftButton = document.getElementById('scroll-left');
    const scrollRightButton = document.getElementById('scroll-right');
    const stockDataContainer = document.getElementById('stock-data');

    // 设置滚动距离
    const scrollAmount = 200;

    // 绑定箭头按钮点击事件
    scrollLeftButton.addEventListener('click', () => {
        stockDataContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    scrollRightButton.addEventListener('click', () => {
        stockDataContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
});

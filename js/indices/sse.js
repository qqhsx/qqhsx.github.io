document.addEventListener('DOMContentLoaded', function() {
    // 创建一个函数，用于处理 JSONP 数据
    window.historySearchHandler = function(data) {
        const stockDataContainer = document.getElementById('stock-data');
        let selectedDataHtml = `
            <div id="selected-data-box">
                <strong>000001</strong>
                <div class="stock-name">上证综合指数数数数数数数数数数数数数数数数数数数</div>
                <div class="price-change-container">
        `;

        // 检查数据是否符合预期
        if (data.length === 0 || !data[0].hq || data[0].hq.length === 0) {
            selectedDataHtml += '<p>没有数据可显示</p>';
        } else {
            const item = data[0].hq[0]; // 选择第一个数据项进行显示
            const [日期, 今开, 当前价, 涨跌额, 涨跌幅, 最低, 最高, 总手, 成交额, 换手率] = item;

            // 选择需要显示的数据
            const currentPrice = 当前价; // 确保这些变量与数据项匹配
            const changeRate = 涨跌幅;

            selectedDataHtml += `
                    <div class="price">${currentPrice}</div>
                    <div class="change-rate">${changeRate}</div>
                </div>
            `;
        }
        selectedDataHtml += '</div>';

        stockDataContainer.innerHTML = selectedDataHtml;
    };

    // 使用有效的接口进行测试
    const script = document.createElement('script');
    script.src = 'https://q.stock.sohu.com/hisHq?code=zs_000001&stat=1&order=D&period=d&callback=historySearchHandler&rt=jsonp';
    document.body.appendChild(script);
});

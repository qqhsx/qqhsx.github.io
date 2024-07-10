const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
const scenarios = [
    { days: 0, weekend: true, message: "今天是周末，好好放松一下吧！" },
    { days: 1, weekend: false, message: "明天就是周末了，今天努力工作哦！" },
    { days: 2, weekend: false, message: "还有2天就是周末了，坚持住！" },
    { days: 3, weekend: false, message: "还有3天就是周末了，先好好工作吧！" },
    { days: 4, weekend: false, message: "工作周才刚开始，保持干劲哦！" },
    { days: 5, weekend: false, message: "又快到周末了，再加把劲！" },
    { days: 0, weekend: false, message: "新的一周开始了，迎接新的挑战吧！" },
];

// 定义节日
const holidays = [
    { name: "中秋节", date: new Date(new Date().getFullYear(), 8, 15), message: "最近的一个节日是中秋节。还要${daysUntilHoliday}天。早着呢！" },
    // 可以在此处添加更多节日
];

function showCurrentTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = (now.getMonth() + 1).toString().padStart(2, '0');
    var day = now.getDate().toString().padStart(2, '0');
    var weekday = weekdays[now.getDay()];
    var hours = now.getHours().toString().padStart(2, '0');
    var minutes = now.getMinutes().toString().padStart(2, '0');
    var seconds = now.getSeconds().toString().padStart(2, '0');
    var milliseconds = now.getMilliseconds().toString().padStart(3, '0');

    // 获取农历日期（假设你有一个Lunar类）
    // var lunar = Lunar.fromDate(now);
    // var lunarYear = lunar.getYearInChinese();
    // var lunarMonth = lunar.getMonthInChinese();
    // var lunarDay = lunar.getDayInChinese();

    var dateString = `${year}年${month}月${day}日 星期${weekday}`;
    var timeString = `${hours}:${minutes}:${seconds}.${milliseconds}`;
    // var lunarString = `农历 ${lunarYear}年${lunarMonth}月${lunarDay}`;

    document.getElementById('current-date').innerHTML = dateString;
    document.getElementById('current-time').innerHTML = timeString;
    // document.getElementById('lunar-date').innerHTML = lunarString;

    // 显示场景消息
    showScenarioMessage(now);
}

function showScenarioMessage(date) {
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const daysUntilWeekend = dayOfWeek <= 5 ? 6 - dayOfWeek : 0;

    // 检查是否有节日
    let holidayMessage = checkHoliday(date);

    if (holidayMessage) {
        document.getElementById('scenario-message').innerHTML = holidayMessage;
        return;
    }

    // 默认的场景消息
    let scenario = scenarios.find(s => 
        (s.weekend === isWeekend && s.days === daysUntilWeekend) ||
        (s.weekend === isWeekend && s.days === 0)
    );

    if (!scenario) {
        scenario = { message: "祝你今天工作顺利！" };
    }

    document.getElementById('scenario-message').innerHTML = scenario.message;
}

function checkHoliday(date) {
    for (let holiday of holidays) {
        let diff = Math.ceil((holiday.date - date) / (1000 * 60 * 60 * 24));
        if (diff > 0) {
            return holiday.message.replace("${daysUntilHoliday}", diff);
        }
    }
    return null;
}

// 自动刷新时间，每100毫秒更新一次
function startClock() {
    setInterval(showCurrentTime, 100);
}

// 启动时钟
startClock();

// custom.js
const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
const scenarios = [
    { days: 0, weekend: true, message: "今天是周末，好好放松一下吧！" },
    { days: 1, weekend: false, message: "明天就是周末了，今天努力工作哦！" },
    { days: 2, weekend: false, message: "还有2天就是周末了，坚持住！" },
    { days: 3, weekend: false, message: "还有3天就是周末了，先好好工作吧！" },
    { days: 4, weekend: false, message: "工作周才刚开始，保持干劲哦！" },
    { days: 5, weekend: false, message: "新的一周开始了，迎接新的挑战吧！" },
    { days: 0, weekend: false, message: "又快到周末了，再加把劲！" },
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

    var dateString = `${year}年${month}月${day}日 星期${weekday}`;
    var timeString = `${hours}:${minutes}:${seconds}.${milliseconds}`;

    //document.getElementById('current-date').innerHTML = dateString;
    //document.getElementById('current-time').innerHTML = timeString;

    // 显示场景消息
    showScenarioMessage(now);
}

function showScenarioMessage(date) {
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const daysUntilWeekend = dayOfWeek <= 5 ? 6 - dayOfWeek : 0;

    let scenario = scenarios.find(s => 
        (s.weekend === isWeekend && s.days === daysUntilWeekend) ||
        (s.weekend === isWeekend && s.days === 0)
    );
 
    if (!scenario) {
        scenario = { message: "祝你今天工作顺利！" };
    }

    document.getElementById('scenario-message').innerHTML = scenario.message;
}

// 自动刷新时间，每100毫秒更新一次
function startClock() {
    setInterval(showCurrentTime, 100);
}
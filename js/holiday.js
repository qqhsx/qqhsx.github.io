
document.addEventListener('DOMContentLoaded', function() {
	fetch('https://timor.tech/api/holiday/tts?' + new Date().getTime())
		.then(response => response.json())
		.then(data => {
			const holidayInfoDiv = document.getElementById('holiday-info');

			if (data.code === 0) {
				holidayInfoDiv.textContent = data.tts;
			} else {
				holidayInfoDiv.textContent = '无法获取节假日信息';
			}
		})
		.catch(error => {
			console.error('获取节假日信息失败:', error);
			const holidayInfoDiv = document.getElementById('holiday-info');
			holidayInfoDiv.textContent = '请求失败';
		});
});

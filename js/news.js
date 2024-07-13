async function fetchNewsTypes() {
    const response = await fetch('https://www.mxnzp.com/api/news/types/v2?app_id=msfurfjfuqfoiruh&app_secret=VW9ZbmlXVzZ1WkR3cDdaaEpDSG1FZz09');
    const data = await response.json();
    return data.data.filter(type => type.typeId === 532); // Filter to get only typeId 532
}

async function fetchNewsList(typeId, page) {
    const response = await fetch(`https://www.mxnzp.com/api/news/list/v2?typeId=${typeId}&page=${page}&app_id=msfurfjfuqfoiruh&app_secret=VW9ZbmlXVzZ1WkR3cDdaaEpDSG1FZz09`);
    const data = await response.json();
    return data.data;
}

async function fetchNewsDetails(newsId) {
    const response = await fetch(`https://www.mxnzp.com/api/news/details/v2?newsId=${newsId}&app_id=msfurfjfuqfoiruh&app_secret=VW9ZbmlXVzZ1WkR3cDdaaEpDSG1FZz09`);
    const data = await response.json();
    return data.data;
}

function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function renderNewsList(typeId, page) {
    try {
        const newsList = await fetchNewsList(typeId, page);
        const newsListContainer = document.getElementById('news-list');
        const timelineDate = document.getElementById('timeline-date');
        if (!newsListContainer) {
            console.error("news-list element not found");
            return;
        }
        newsListContainer.innerHTML = '';
        if (newsList.length > 0) {
            timelineDate.innerText = new Date(newsList[0].postTime).toLocaleDateString();
        }
        newsList.forEach(news => {
            const newsElement = document.createElement('div');
            newsElement.className = 'news-item';
            newsElement.innerHTML = `
                <div class="publish-time">${formatTime(news.postTime)}</div>
                <div class="content">
                    <div class="text-content">
                        <h3>${news.title}</h3>
                        <p>${news.digest}</p>
                    </div>
                    <img src="${news.imgList[0] || ''}" alt="${news.title}">
                </div>
            `;
            
            // 添加点击事件以进入新闻详情
            newsElement.onclick = () => showNewsDetails(news.newsId);
            
            newsListContainer.appendChild(newsElement);
        });
    } catch (error) {
        console.error("Failed to render news list", error);
    }
}

async function showNewsDetails(newsId) {
    try {
        const newsDetails = await fetchNewsDetails(newsId);
        const newsDetailsModal = document.getElementById('news-details-modal');
        if (!newsDetailsModal) {
            console.error("news-details-modal element not found");
            return;
        }
        const newsDetailsContainer = document.getElementById('news-details');
        if (!newsDetailsContainer) {
            console.error("news-details element not found");
            return;
        }
        newsDetailsContainer.innerHTML = ''; // 清空详情内容
        newsDetails.items.forEach(item => {
            let content;
            if (item.type === 'text') {
                content = `<p>${item.content}</p>`;
            } else if (item.type === 'img') {
                content = `<img src="${item.imageUrl}" alt="Image">`;
            } else if (item.type === 'video') {
                content = `<video src="${item.videoUrl[0]}" controls></video>`;
            }
            newsDetailsContainer.innerHTML += content;
        });

        // 显示模态弹窗
        newsDetailsModal.style.display = 'flex';
    } catch (error) {
        console.error("Failed to render news details", error);
    }
}

function closeNewsDetailsModal() {
    const newsDetailsModal = document.getElementById('news-details-modal');
    newsDetailsModal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', async () => {
    await renderNewsList(532, 1); // Render news list for typeId 532 on page load

    // 添加关闭模态弹窗的事件
    const closeModalButton = document.getElementById('close-modal');
    closeModalButton.onclick = closeNewsDetailsModal;

    // 添加按下ESC键关闭模态弹窗的事件
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeNewsDetailsModal();
        }
    });
});

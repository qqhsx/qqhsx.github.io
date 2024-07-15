let newsDetailsContainer = document.getElementById('news-details');

async function fetchNewsTypes() {
    const response = await fetch('https://www.mxnzp.com/api/news/types/v2?app_id=msfurfjfuqfoiruh&app_secret=VW9ZbmlXVzZ1WkR3cDdaaEpDSG1FZz09');
    const data = await response.json();
    return data.data.filter(type => type.typeId === 532);
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
                        <h4>${news.title}</h4>
                        <p>${news.digest}</p>
                    </div>
                    <img src="${news.imgList[0] || ''}" alt="${news.title}">
                </div>
            `;
            
            newsElement.onclick = () => showNewsDetails(news.newsId);
            newsListContainer.appendChild(newsElement);
        });
    } catch (error) {
        console.error("Failed to render news list", error);
    }
}

async function showNewsDetails(newsId) {
    try {
        console.log('正在获取新闻详情，newsId:', newsId);
        const newsDetails = await fetchNewsDetails(newsId);
        const newsDetailsContainer = document.getElementById('news-details');
        if (!newsDetailsContainer) {
            console.error("未找到 news-details 元素");
            return;
        }
        newsDetailsContainer.innerHTML = '';

        newsDetails.items.forEach(item => {
            let content;
            if (item.type === 'text') {
                content = `<p>${item.content}</p>`;
            } else if (item.type === 'img') {
                content = `<img src="${item.imageUrl}" alt="图片">`;
            } else if (item.type === 'video') {
                content = `<video src="${item.videoUrl[0]}" controls></video>`;
            }
            newsDetailsContainer.innerHTML += content;
        });

        const newsDetailsModal = document.getElementById('news-details-modal');
        newsDetailsModal.style.display = 'flex';

        // 自动滚动到顶部
        newsDetailsContainer.scrollTop = 0;

        const backToTopButton = document.getElementById('back-to-top');
        backToTopButton.onclick = () => {
            console.log('正在滚动到顶部');
            newsDetailsContainer.scrollTop = 0;
        };

    } catch (error) {
        console.error("渲染新闻详情失败", error);
    }
}


function closeNewsDetailsModal() {
    const newsDetailsModal = document.getElementById('news-details-modal');
    newsDetailsModal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', async () => {
    await renderNewsList(532, 1);

    const closeModalButton = document.getElementById('close-modal');
    closeModalButton.onclick = closeNewsDetailsModal;

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeNewsDetailsModal();
        }
    });
});

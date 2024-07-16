let newsDetailsContainer = document.getElementById('news-details');
let currentPage = 1;
let lastDisplayedDate = '';

async function fetchFromAPI(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error(`Failed to fetch from ${url}`, error);
        return null;
    }
}

async function fetchNewsTypes() {
    const url = 'https://www.mxnzp.com/api/news/types/v2?app_id=msfurfjfuqfoiruh&app_secret=VW9ZbmlXVzZ1WkR3cDdaaEpDSG1FZz09';
    const data = await fetchFromAPI(url);
    return data ? data.filter(type => type.typeId === 535) : [];
}

async function fetchNewsList(typeId, page) {
    const url = `https://www.mxnzp.com/api/news/list/v2?typeId=${typeId}&page=${page}&app_id=msfurfjfuqfoiruh&app_secret=VW9ZbmlXVzZ1WkR3cDdaaEpDSG1FZz09`;
    return await fetchFromAPI(url) || [];
}

async function fetchNewsDetails(newsId) {
    const url = `https://www.mxnzp.com/api/news/details/v2?newsId=${newsId}&app_id=msfurfjfuqfoiruh&app_secret=VW9ZbmlXVzZ1WkR3cDdaaEpDSG1FZz09`;
    return await fetchFromAPI(url);
}

function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function sanitizeHTML(str) {
    let temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

function createNewsElement(news) {
    const newsElement = document.createElement('div');
    newsElement.className = 'news-item';
    newsElement.innerHTML = `
        <div class="publish-time">${formatTime(news.postTime)}</div>
        <div class="content">
            <div class="text-content">
                <h4>${sanitizeHTML(news.title)}</h4>
                <p>${sanitizeHTML(news.digest)}</p>
            </div>
            <img src="${news.imgList[0] || ''}" alt="${sanitizeHTML(news.title)}">
        </div>
    `;
    newsElement.onclick = () => showNewsDetails(news.newsId);
    return newsElement;
}

async function renderNewsList(typeId, page) {
    const newsList = await fetchNewsList(typeId, page);
    const newsListContainer = document.getElementById('news-list');

    if (!newsListContainer) {
        console.error("news-list element not found");
        return;
    }

    // 只在第一页清空内容
    if (page === 1) {
        newsListContainer.innerHTML = '';
    }

    newsList.forEach((news) => {
        const currentDate = new Date(news.postTime).toLocaleDateString();

        // 检查是否是新日期
        if (currentDate !== lastDisplayedDate) {
            // 添加日期标题
            const dateHeader = document.createElement('h3');
            dateHeader.innerText = currentDate;
            newsListContainer.appendChild(dateHeader);
            lastDisplayedDate = currentDate; // 更新最后显示的日期
        }

        const newsElement = createNewsElement(news);
        newsListContainer.appendChild(newsElement);
    });
}

async function showNewsDetails(newsId) {
    const newsDetails = await fetchNewsDetails(newsId);
    if (!newsDetails) {
        console.error("Failed to load news details");
        return;
    }

    newsDetailsContainer.innerHTML = '';

    newsDetails.items.forEach(item => {
        let content;
        if (item.type === 'text') {
            content = `<p>${sanitizeHTML(item.content)}</p>`;
        } else if (item.type === 'img') {
            content = `<img src="${item.imageUrl}" alt="图片">`;
        } else if (item.type === 'video') {
            content = `<video src="${item.videoUrl[0]}" controls></video>`;
        }
        newsDetailsContainer.innerHTML += content;
    });

    const newsDetailsModal = document.getElementById('news-details-modal');
    newsDetailsModal.style.display = 'flex';

    // 添加历史状态
    history.pushState({ modalOpen: true }, '');

    // 自动滚动到顶部
    newsDetailsContainer.scrollTop = 0;
}

function closeNewsDetailsModal() {
    const newsDetailsModal = document.getElementById('news-details-modal');
    newsDetailsModal.style.display = 'none';

    // 更新历史记录
    history.replaceState({}, document.title);
}

window.addEventListener('popstate', (event) => {
    const newsDetailsModal = document.getElementById('news-details-modal');
    if (newsDetailsModal.style.display === 'flex') {
        closeNewsDetailsModal();
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    await renderNewsList(535, currentPage);

    const closeModalButton = document.getElementById('close-modal');
    if (closeModalButton) {
        closeModalButton.onclick = closeNewsDetailsModal;
    }

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeNewsDetailsModal();
        }
    });

    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        backToTopButton.onclick = () => {
            newsDetailsContainer.scrollTop = 0;
        };
    }

    const loadMoreButton = document.getElementById('load-more-button');
    if (loadMoreButton) {
        loadMoreButton.onclick = async () => {
            currentPage++;
            await renderNewsList(535, currentPage);
        };
    }
});


/*
ローディングから画面遷移
================================================ */

const loadingAreaGrey = document.querySelector('#loading');
const loadingAreaGreen = document.querySelector('#loading-screen');
const loadingText = document.querySelector('#loading p');

window.addEventListener('load', () => {

    if (loadingAreaGrey && loadingAreaGreen && loadingText) {

        loadingAreaGrey.animate(
            {
                opacity: [1, 0],
                visibility: 'hidden',
            },
            {
                duration: 2000,
                delay: 1200,
                easing: 'ease',
                fill: 'forwards',
            }
        );

        loadingAreaGreen.animate(
            {
                translate: ['0 100vh', '0 0', '0 -100vh']
            },
            {
                duration: 2000,
                delay: 800,
                easing: 'ease',
                fill: 'forwards',
            }
        );

        loadingText.animate(
            [
                { opacity: 1, offset: .8 },
                { opacity: 0, offset: 1 },
            ],
            {
                duration: 1200,
                easing: 'ease',
                fill: 'forwards',
            }
        );
    }
});



/*
画像ギャラリー
================================================ */

const mainImage = document.querySelector('.gallery-image img');
const thumbImages = document.querySelectorAll('.gallery-thumbnails img');

if (mainImage && thumbImages.length > 0) {

    thumbImages.forEach((thumbImage) => {

        thumbImage.addEventListener('mouseover', (event) => {

            mainImage.src = event.target.src;

            mainImage.animate(
                { opacity: [0, 1] },
                500
            );

        });

    });

}



/*
新しいスライドメニュー
================================================ */

const menuOpen = document.querySelector('#menu-open');
const menuClose = document.querySelector('#menu-close');
const menuPanel = document.querySelector('#menu-panel');
const menuBackdrop = document.querySelector('#menu-backdrop');

const menuLinks = document.querySelectorAll('#menu-panel .menu-list a');

// メニューを開く
function openMenu() {

    if (!menuOpen || !menuPanel || !menuBackdrop) return;

    menuPanel.classList.add('is-open');
    menuBackdrop.classList.add('is-open');

    document.body.classList.add('menu-active');

    menuOpen.setAttribute('aria-expanded', 'true');
    menuPanel.setAttribute('aria-hidden', 'false');

}

// メニューを閉じる
function closeMenu() {

    if (!menuOpen || !menuPanel || !menuBackdrop) return;

    menuPanel.classList.remove('is-open');
    menuBackdrop.classList.remove('is-open');

    document.body.classList.remove('menu-active');

    menuOpen.setAttribute('aria-expanded', 'false');
    menuPanel.setAttribute('aria-hidden', 'true');

}

// 開くボタン
if (menuOpen) {
    menuOpen.addEventListener('click', () => {
        if (menuPanel.classList.contains('is-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });
}

// 閉じるボタン
if (menuClose) {
    menuClose.addEventListener('click', closeMenu);
}

// 背景クリックで閉じる
if (menuBackdrop) {
    menuBackdrop.addEventListener('click', closeMenu);
}

// メニュー内のリンクを押したら閉じる
menuLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
});

// ESCキーで閉じる
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeMenu();
    }
});



/*
スクロールで要素を表示
================================================ */

const animateFade = (entries, obs) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {

            entry.target.animate(
                {
                    opacity: [0, 1],
                    filter: ['blur(.4rem)', 'blur(0)'],
                    translate: ['0 4rem', 0],
                },
                {
                    duration: 2000,
                    easing: 'ease',
                    fill: 'forwards',
                }
            );

            obs.unobserve(entry.target);

        }

    });

};


const fadeElements = document.querySelectorAll('.fadein');

if (fadeElements.length > 0) {

    const fadeObserver = new IntersectionObserver(animateFade);

    fadeElements.forEach((fadeElement) => {

        fadeObserver.observe(fadeElement);

    });

}


/*
からあげおみくじ
================================================ */

const openOmikuji = document.getElementById("omikuji-open");
const closeOmikuji = document.getElementById("omikuji-close");
const popupOmikuji = document.getElementById("omikuji-popup");
const omikujiButton = document.getElementById("omikuji-button");
const omikujiResult = document.getElementById("omikuji-result");


// 運勢と確率
const fortunes = [

    {
        name: "大吉",
        probability: 5,
        message: "最高の運勢！揚げたてのからあげで幸せな一日！"
    },

    {
        name: "中吉",
        probability: 15,
        message: "いいことがありそう！今日は絶好調！"
    },

    {
        name: "小吉",
        probability: 30,
        message: "小さな幸せが見つかる一日になりそう！"
    },

    {
        name: "吉",
        probability: 40,
        message: "いつも通りが一番！おいしいご飯で元気いっぱい！"
    },

    {
        name: "凶",
        probability: 10,
        message: "そんな日もある！からあげを食べて運気回復！"
    }

];


// 日本時間の日付
function getToday() {

    return new Intl.DateTimeFormat("ja-JP", {

        timeZone: "Asia/Tokyo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"

    }).format(new Date());

}


// 抽選
function drawOmikuji() {

    let random = Math.random() * 100;

    for (const fortune of fortunes) {

        random -= fortune.probability;

        if (random < 0) {

            return fortune;

        }

    }

    return fortunes[fortunes.length - 1];

}


// 結果表示
function showOmikujiResult(fortune) {

    omikujiResult.innerHTML = `
        <p class="result-name">${fortune.name}</p>
        <p class="result-message">${fortune.message}</p>
    `;

    omikujiResult.classList.remove("show");

    void omikujiResult.offsetWidth;

    omikujiResult.classList.add("show");

}


// 今日の結果を確認
function checkOmikuji() {

    const saved = localStorage.getItem("toriyuOmikuji");
    const today = getToday();

    if (saved) {

        const data = JSON.parse(saved);

        if (data.date === today) {

            showOmikujiResult(fortunes[data.index]);

            omikujiButton.textContent = "本日は終了しました";

            omikujiButton.disabled = true;

            return;

        }

    }

    omikujiResult.textContent = "今日の運勢は……？";

    omikujiButton.textContent = "おみくじを引く";

    omikujiButton.disabled = false;

}


// 開く
if (openOmikuji && popupOmikuji) {

    openOmikuji.addEventListener("click", () => {

        popupOmikuji.classList.add("active");

        checkOmikuji();

    });

}


// 閉じる
if (closeOmikuji && popupOmikuji) {

    closeOmikuji.addEventListener("click", () => {

        popupOmikuji.classList.remove("active");

    });

}


// おみくじを引く
if (omikujiButton && omikujiResult) {

    checkOmikuji();

    omikujiButton.addEventListener("click", () => {

        if (omikujiButton.disabled) return;

        const saved = localStorage.getItem("toriyuOmikuji");

        if (saved && JSON.parse(saved).date === getToday()) {

            checkOmikuji();

            return;

        }

        const fortune = drawOmikuji();

        const index = fortunes.indexOf(fortune);

        localStorage.setItem("toriyuOmikuji", JSON.stringify({

            date: getToday(),
            index: index

        }));

        showOmikujiResult(fortune);

        omikujiButton.textContent = "本日は終了しました";

        omikujiButton.disabled = true;

    });

}

document.addEventListener('DOMContentLoaded', () => {
    // ▼ ここを '.slides img' から '.slides .slide-link' に変更します
    const slides = document.querySelectorAll('.slides .slide-link');
    const prevBtn = document.querySelector('.slide-btn.prev');
    const nextBtn = document.querySelector('.slide-btn.next');
    const dotsContainer = document.querySelector('.slide-dots');

    if (slides.length === 0) return;

    let currentIndex = 0;
    let slideInterval;
    const intervalTime = 5000; // 5秒ごとに切り替え

    // 画像の枚数分だけ下の丸ボタン（<button>）を自動生成
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.setAttribute('aria-label', `${index + 1}枚目のスライドへ`);
        if (index === 0) dot.classList.add('active');

        dot.addEventListener('click', () => {
            goToSlide(index);
            resetTimer();
        });

        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('button');

    // スライドを切り替える処理
    function goToSlide(index) {
        slides[currentIndex].classList.remove('active');
        if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

        currentIndex = (index + slides.length) % slides.length;

        slides[currentIndex].classList.add('active');
        if (dots[currentIndex]) dots[currentIndex].classList.add('active');
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    // 5秒タイマーの開始・リセット
    function startTimer() {
        slideInterval = setInterval(nextSlide, intervalTime);
    }

    function resetTimer() {
        clearInterval(slideInterval);
        startTimer();
    }

    // 矢印ボタンのクリックイベント
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetTimer();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetTimer();
        });
    }

    // 自動再生スタート
    startTimer();
});

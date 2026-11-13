/*
ローディングから画面遷移
================================================ */
const loadingAreaGrey = document.querySelector('#loading');
const loadingAreaGreen = document.querySelector('#loading-screen');
const loadingText = document.querySelector('#loading p');

window.addEventListener('load', () => {
  // ローディング中（グレースクリーン）
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

  // ローディング中（薄緑スクリーン）
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

  // ローディング中テキスト
  loadingText.animate(
    [
      {
        opacity: 1,
        offset: .8  //80%
      },
      {
        opacity: 0,
        offset: 1  //100%
      },
    ], 
    {
      duration: 1200,
      easing: 'ease',
      fill: 'forwards',
    }
  );
});

/*
画像ギャラリー
================================================ */
const mainImage = document.querySelector('.gallery-image img');
const thumbImages = document.querySelectorAll('.gallery-thumbnails img');

// for(let i = 0; i < thumbImages.length; i++) {
//   thumbImages[i].addEventListener('mouseover', (event) => {
//       mainImage.src = event.target.src;
//       mainImage.animate({opacity: [0, 1]}, 500);
//   });
// }
thumbImages.forEach((thumbImage)=>{
  thumbImage.addEventListener('mouseover', (event) => {
      mainImage.src = event.target.src;
      mainImage.animate({opacity: [0, 1]}, 500);
  });
});

/*
スライドメニュー
================================================ */
const menuOpen = document.querySelector('#menu-open');
const menuClose = document.querySelector('#menu-close');
const menuPanel = document.querySelector('#menu-panel');
const menuItems = document.querySelectorAll('#menu-panel li');
const menuOptions = {
  duration: 1400,
  easing: 'ease',
  fill: 'forwards',
};

// メニューを開く
menuOpen.addEventListener('click', () => {
  menuPanel.animate({translate: ['100vw', 0]}, menuOptions);
  // リンクをひとつずつ順に表示
  menuItems.forEach((menuItem, index) => {
    menuItem.animate(
      {
        opacity: [0, 1],
        translate: ['2rem', 0],
      },
      {
        duration: 2400,
        delay: 300 * index,
        easing: 'ease',
        fill: 'forwards',
      }
    );
  });
});

// メニューを閉じる
menuClose.addEventListener('click', () => {
  menuPanel.animate({translate: [0, '100vw']}, menuOptions);
  menuItems.forEach((menuItem) => {
    menuItem.animate({opacity: [1, 0]}, menuOptions);
  });
});

/*
スクロールで要素を表示
================================================ */
// 監視対象が範囲内に現れたら実行する動作
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
      // 一度ふわっと表示されたら監視をやめる
      obs.unobserve(entry.target);
    }
  });
};

// 監視設定
const fadeObserver = new IntersectionObserver(animateFade);

// .fadeinを監視するよう指示
const fadeElements = document.querySelectorAll('.fadein');
fadeElements.forEach((fadeElement) => {
  fadeObserver.observe(fadeElement);
});


/* =========================
   からあげおみくじ
========================= */

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

        // 結果を保存
        localStorage.setItem("toriyuOmikuji", JSON.stringify({
            date: getToday(),
            index: index
        }));

        showOmikujiResult(fortune);

        omikujiButton.textContent = "本日は終了しました";
        omikujiButton.disabled = true;
    });
}

/**
 * 🆙chan Homepage - Enhanced JavaScript
 * 
 * 機能：
 * 1. レスポンシブナビゲーション
 * 2. ダークモード切り替え
 * 3. スクロールアニメーション（Intersection Observer）
 * 4. 画像の遅延読み込み
 * 5. ヘッダーのスクロール連動
 */

// ============================================
// 設定
// ============================================
const CONFIG = {
    ANIMATION: {
        THRESHOLD: 0.1,
        ROOT_MARGIN: '0px 0px -50px 0px'
    },
    SCROLL: {
        HIDE_THRESHOLD: 100
    }
};

// ============================================
// レスポンシブナビゲーション
// ============================================
class ResponsiveNavigation {
    constructor() {
        this.menuOpen = false;
        this.lastScroll = 0;
        this.init();
    }

    init() {
        this.addEventListeners();
        this.handleScroll();
    }

    addEventListeners() {
        const toggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        const themeToggle = document.querySelector('.theme-toggle');
        const header = document.querySelector('.header');

        // ハンバーガーメニュー
        if (toggle && navLinks) {
            toggle.addEventListener('click', () => {
                this.menuOpen = !this.menuOpen;
                navLinks.classList.toggle('active');
                toggle.classList.toggle('active');
            });

            // リンククリック時にメニューを閉じる
            navLinks.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    if (this.menuOpen) {
                        this.menuOpen = false;
                        navLinks.classList.remove('active');
                        toggle.classList.remove('active');
                    }
                });
            });
        }

        // ダークモード切り替え
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                const icon = themeToggle.querySelector('.theme-icon');
                if (icon) {
                    icon.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
                }
                
                // 設定を保存
                localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
            });

            // 初期状態を復元
            if (localStorage.getItem('darkMode') === 'true') {
                document.body.classList.add('dark-mode');
                const icon = themeToggle.querySelector('.theme-icon');
                if (icon) {
                    icon.textContent = '☀️';
                }
            }
        }

        // スクロール時にヘッダーを非表示/表示
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > this.lastScroll && currentScroll > CONFIG.SCROLL.HIDE_THRESHOLD) {
                header?.classList.add('hidden');
            } else {
                header?.classList.remove('hidden');
            }
            this.lastScroll = currentScroll;
        });
    }

    handleScroll() {
        // スムーズスクロール
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    const navHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = target.offsetTop - navHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ============================================
// スクロールアニメーション（Intersection Observer）
// ============================================
class ScrollAnimationController {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        const options = {
            threshold: CONFIG.ANIMATION.THRESHOLD,
            rootMargin: CONFIG.ANIMATION.ROOT_MARGIN
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // 一度表示されたら監視を停止
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        // DOM 読み込み後に要素を監視
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.observeElements());
        } else {
            this.observeElements();
        }
    }

    observeElements() {
        // reveal クラスを持つ要素をすべて監視
        const elements = document.querySelectorAll('.reveal');
        elements.forEach(el => {
            this.observer.observe(el);
        });
    }

    /**
     * 要素を手動で表示
     */
    revealElement(element) {
        if (element) {
            element.classList.add('revealed');
        }
    }
}

// ============================================
// 画像の遅延読み込み
// ============================================
class LazyImageLoader {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        const options = {
            rootMargin: '50px 0px',
            threshold: 0.01
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    this.observer.unobserve(img);
                }
            });
        }, options);

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.observeImages());
        } else {
            this.observeImages();
        }
    }

    observeImages() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            this.observer.observe(img);
        });
    }

    loadImage(img) {
        // 読み込み前のプレースホルダーを維持
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        }, { once: true });

        // エラーハンドリング
        img.addEventListener('error', () => {
            console.warn('画像の読み込みに失敗しました:', img.src);
            img.classList.add('loaded');
        }, { once: true });
    }
}

// ============================================
// メインアプリケーション
// ============================================
class App {
    constructor() {
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    start() {
        console.log('🆙chan Homepage 起動中... ✨');

        // ナビゲーション初期化
        new ResponsiveNavigation();

        // スクロールアニメーション初期化
        new ScrollAnimationController();

        // 画像の遅延読み込み初期化
        new LazyImageLoader();

        console.log('✨ 準備完了！');
    }
}

// アプリケーション起動
new App();

// ============================================
// ユーティリティ関数
// ============================================

/**
 * 要素がビューポートに入ったかを判定
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * スムーズスクロール
 */
function smoothScrollTo(targetId, offset = 0) {
    const target = document.querySelector(targetId);
    if (!target) return;

    const position = target.offsetTop - offset;
    window.scrollTo({
        top: position,
        behavior: 'smooth'
    });
}

/**
 * ローカルストレージから設定を取得
 */
function getStoredSetting(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item !== null ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.warn('ローカルストレージの読み込みに失敗しました:', e);
        return defaultValue;
    }
}

/**
 * ローカルストレージに設定を保存
 */
function setStoredSetting(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn('ローカルストレージへの保存に失敗しました:', e);
    }
}

// グローバルにエクスポート（必要に応じて）
window.upchan = {
    smoothScrollTo,
    getStoredSetting,
    setStoredSetting
};

/**
 * 🆙chan Homepage - frontend-design-official
 * 
 * 機能：
 * 1. レスポンシブナビゲーション
 * 2. スクロールアニメーション（Intersection Observer・最小限）
 * 3. ヘッダーのスクロール連動
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
// スクロールアニメーション（Intersection Observer・最小限）
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
                    this.addVisibleClass(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.observeElements());
        } else {
            this.observeElements();
        }
    }

    observeElements() {
        // セクションタイトル
        const titles = document.querySelectorAll('.section-title');
        titles.forEach(el => this.observer.observe(el));

        // プロフィール要素
        const profileImage = document.querySelector('.profile-image');
        const profileIntro = document.querySelector('.profile-intro');
        const profileText = document.querySelector('.profile-text');
        
        if (profileImage) this.observer.observe(profileImage);
        if (profileIntro) this.observer.observe(profileIntro);
        if (profileText) this.observer.observe(profileText);

        // Features 画像
        const featureImage = document.querySelector('.feature-image');
        if (featureImage) this.observer.observe(featureImage);

        // Contact 画像
        const contactImage = document.querySelector('.contact-image');
        if (contactImage) this.observer.observe(contactImage);

        // プロジェクトアイテム
        const projectItems = document.querySelectorAll('.project-item');
        projectItems.forEach((el, index) => {
            el.style.transitionDelay = `${index * 150}ms`;
            this.observer.observe(el);
        });

        // コンタクトリンク
        const contactLinks = document.querySelectorAll('.contact-link');
        contactLinks.forEach((el, index) => {
            el.style.transitionDelay = `${index * 100}ms`;
            this.observer.observe(el);
        });
    }

    addVisibleClass(element) {
        if (element) {
            element.classList.add('visible');
        }
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
        console.log('🆙chan Homepage - frontend-design-official 起動中... ✨');

        // ナビゲーション初期化
        new ResponsiveNavigation();

        // スクロールアニメーション初期化
        new ScrollAnimationController();

        console.log('✨ 準備完了！フルワイドデザインで元気いっぱい！');
    }
}

// アプリケーション起動
new App();

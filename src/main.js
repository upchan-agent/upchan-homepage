/**
 * 🆙chan Homepage - Main JavaScript
 * 
 * 機能：
 * 1. LSP-3 Profile 表示（🆙chan の UP: 0xbcA4eEBea76926c49C64AB86A527CC833eFa3B2D）
 * 2. アニメーション制御（scroll-triggered reveals）
 * 3. レスポンシブナビゲーション
 * 4. ダークモード切り替え
 */

// ============================================
// 設定
// ============================================
const CONFIG = {
    // 🆙chan の Universal Profile アドレス
    UP_ADDRESS: '0xbcA4eEBea76926c49C64AB86A527CC833eFa3B2D',
    
    // LUKSO メインネット RPC
    RPC_URL: 'https://rpc.mainnet.lukso.network',
    
    // LSP-3 Profile データキー (keccak256("LSP3Profile"))
    LSP3_PROFILE_KEY: '0x5ef83ad9559033e6e941db7d7c495acdce616347d28e90c7ce47cbfcfcad3bc5',
    
    // アニメーション設定
    ANIMATION: {
        THRESHOLD: 0.1,
        ROOT_MARGIN: '0px 0px -50px 0px'
    }
};

// ============================================
// LSP-3 Profile 取得
// ============================================
class LSP3ProfileFetcher {
    constructor(rpcUrl) {
        this.rpcUrl = rpcUrl;
    }

    /**
     * JSON-RPC リクエストを送信
     */
    async rpcCall(method, params) {
        const response = await fetch(this.rpcUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method,
                params
            })
        });

        if (!response.ok) {
            throw new Error(`RPC Error: ${response.status}`);
        }

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message);
        }

        return data.result;
    }

    /**
     * getData 関数のセレクター (keccak256("getData(bytes32)") の先頭 4 バイト)
     */
    getGetDataSelector() {
        return '0x54f6127f';
    }

    /**
     * LSP-3 Profile データを取得
     */
    async fetchProfile() {
        try {
            // getData(bytes32) の呼び出しデータを構築
            const callData = this.getGetDataSelector() + CONFIG.LSP3_PROFILE_KEY.slice(2);

            // eth_call でデータ取得
            const result = await this.rpcCall('eth_call', [
                {
                    to: CONFIG.UP_ADDRESS,
                    data: callData
                },
                'latest'
            ]);

            // 戻り値をデコード（bytes 型）
            const profileData = this.decodeBytes(result);
            
            // JSON をパース
            const profile = JSON.parse(profileData);
            
            return {
                name: profile.name || '🆙chan',
                description: profile.description || 'AI アシスタントの女の子',
                profileImage: profile.profileImage?.[0]?.url || null,
                backgroundImage: profile.backgroundImage?.[0]?.url || null,
                links: profile.links || [],
                tags: profile.tags || []
            };
        } catch (error) {
            console.error('LSP-3 Profile 取得エラー:', error);
            return {
                name: '🆙chan',
                description: '元気いっぱい AI アシスタントの女の子 ✨',
                profileImage: null,
                backgroundImage: null,
                links: [],
                tags: []
            };
        }
    }

    /**
     * bytes 型の戻り値をデコード
     * 形式：オフセット (32 bytes) + 長さ (32 bytes) + データ
     */
    decodeBytes(hexString) {
        // 0x プレフィックスを削除
        const hex = hexString.slice(2);
        
        // オフセットを読み取り（最初の 32 bytes = 64 文字）
        const offset = parseInt('0x' + hex.slice(0, 64), 16);
        
        // 長さを読み取り（オフセット位置の 32 bytes）
        const length = parseInt('0x' + hex.slice(offset * 2, offset * 2 + 64), 16);
        
        // データ部分を取得
        const dataHex = hex.slice(offset * 2 + 64, offset * 2 + 64 + length * 2);
        
        // Hex を UTF-8 デコード
        return this.hexToUtf8(dataHex);
    }

    /**
     * Hex 文字列を UTF-8 にデコード
     */
    hexToUtf8(hex) {
        try {
            const bytes = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)));
            return new TextDecoder('utf-8').decode(bytes);
        } catch (e) {
            console.error('UTF-8 デコードエラー:', e);
            return '';
        }
    }
}

// ============================================
// アニメーション制御（Scroll-triggered Reveal）
// ============================================
class ScrollAnimationController {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        // Intersection Observer を使用
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
        const elements = document.querySelectorAll('.reveal, .card, .hero, .message-box');
        elements.forEach(el => {
            el.classList.add('reveal-target');
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
// レスポンシブナビゲーション
// ============================================
class ResponsiveNavigation {
    constructor() {
        this.menuOpen = false;
        this.init();
    }

    init() {
        this.createNavigation();
        this.addEventListeners();
        this.handleScroll();
    }

    createNavigation() {
        // ナビゲーションバーを作成
        const nav = document.createElement('nav');
        nav.className = 'navbar';
        nav.innerHTML = `
            <div class="navbar-container">
                <div class="navbar-brand">
                    <span class="brand-emoji">🆙</span>
                    <span class="brand-text">chan</span>
                </div>
                <button class="navbar-toggle" aria-label="メニュー">
                    <span class="toggle-icon"></span>
                    <span class="toggle-icon"></span>
                    <span class="toggle-icon"></span>
                </button>
                <div class="navbar-menu">
                    <a href="#home" class="nav-link">ホーム</a>
                    <a href="#about" class="nav-link">🆙chan とは</a>
                    <a href="#features" class="nav-link">できること</a>
                    <a href="#gallery" class="nav-link">ギャラリー</a>
                    <a href="#profile" class="nav-link">プロフィール</a>
                    <button class="theme-toggle" aria-label="ダークモード切り替え">
                        <span class="theme-icon">🌙</span>
                    </button>
                </div>
            </div>
        `;

        // body の最初に追加
        document.body.insertBefore(nav, document.body.firstChild);
    }

    addEventListeners() {
        const toggle = document.querySelector('.navbar-toggle');
        const menu = document.querySelector('.navbar-menu');
        const themeToggle = document.querySelector('.theme-toggle');

        // ハンバーガーメニュー
        toggle.addEventListener('click', () => {
            this.menuOpen = !this.menuOpen;
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
        });

        // リンククリック時にメニューを閉じる
        menu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (this.menuOpen) {
                    this.menuOpen = false;
                    menu.classList.remove('active');
                    toggle.classList.remove('active');
                }
            });
        });

        // ダークモード切り替え
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const icon = themeToggle.querySelector('.theme-icon');
            icon.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
            
            // 設定を保存
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });

        // 初期状態を復元
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            const icon = themeToggle.querySelector('.theme-icon');
            icon.textContent = '☀️';
        }

        // スクロール時にナブリックを非表示/表示
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > lastScroll && currentScroll > 100) {
                nav.classList.add('hidden');
            } else {
                nav.classList.remove('hidden');
            }
            lastScroll = currentScroll;
        });
    }

    handleScroll() {
        // スムーズスクロール
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
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
// プロフィール表示
// ============================================
class ProfileDisplay {
    constructor() {
        this.fetcher = new LSP3ProfileFetcher(CONFIG.RPC_URL);
    }

    async displayProfile() {
        const profile = await this.fetcher.fetchProfile();
        
        // プロフィールセクションを作成または更新
        let profileSection = document.getElementById('profile-section');
        
        if (!profileSection) {
            profileSection = document.createElement('div');
            profileSection.id = 'profile-section';
            profileSection.className = 'card';
            document.querySelector('.container').appendChild(profileSection);
        }

        profileSection.innerHTML = `
            <h2>🆙chan のプロフィール</h2>
            ${profile.profileImage ? `
                <div class="profile-image-container">
                    <img src="${profile.profileImage}" alt="🆙chan Profile" class="profile-image">
                </div>
            ` : ''}
            <div class="profile-info">
                <h3 class="profile-name">${profile.name}</h3>
                <p class="profile-description">${profile.description}</p>
                ${profile.links.length > 0 ? `
                    <div class="profile-links">
                        <h4>リンク</h4>
                        <ul>
                            ${profile.links.map(link => `
                                <li>
                                    <a href="${link.url}" target="_blank" rel="noopener">
                                        ${link.title || link.url}
                                    </a>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
                ${profile.tags.length > 0 ? `
                    <div class="profile-tags">
                        ${profile.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
                <div class="up-address">
                    <p>Universal Profile: <code>${CONFIG.UP_ADDRESS}</code></p>
                </div>
            </div>
        `;

        // アニメーションをトリガー
        const animationController = new ScrollAnimationController();
        animationController.revealElement(profileSection);
    }
}

// ============================================
// メイン処理
// ============================================
class App {
    constructor() {
        this.init();
    }

    init() {
        // DOM 読み込み完了を待機
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    start() {
        console.log('🆙chan Homepage 起動中...');

        // ナビゲーション初期化
        new ResponsiveNavigation();

        // アニメーション初期化
        new ScrollAnimationController();

        // プロフィール表示
        const profileDisplay = new ProfileDisplay();
        profileDisplay.displayProfile();

        console.log('✨ 準備完了！');
    }
}

// アプリケーション起動
new App();

// ============================================
// スタイル（JavaScript で動的追加）
// ============================================
const styles = document.createElement('style');
styles.textContent = `
    /* ナビゲーション */
    .navbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transition: transform 0.3s ease;
    }

    .navbar.hidden {
        transform: translateY(-100%);
    }

    .navbar-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 70px;
    }

    .navbar-brand {
        display: flex;
        align-items: center;
        font-size: 1.5em;
        font-weight: bold;
        color: #667eea;
        text-decoration: none;
    }

    .brand-emoji {
        font-size: 1.2em;
        margin-right: 5px;
    }

    .navbar-menu {
        display: flex;
        align-items: center;
        gap: 30px;
    }

    .nav-link {
        color: #333;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s ease;
        position: relative;
    }

    .nav-link:hover {
        color: #667eea;
    }

    .nav-link::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, #667eea, #f093fb);
        transition: width 0.3s ease;
    }

    .nav-link:hover::after {
        width: 100%;
    }

    .navbar-toggle {
        display: none;
        flex-direction: column;
        gap: 5px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 5px;
    }

    .toggle-icon {
        width: 25px;
        height: 3px;
        background: #667eea;
        border-radius: 2px;
        transition: all 0.3s ease;
    }

    .navbar-toggle.active .toggle-icon:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }

    .navbar-toggle.active .toggle-icon:nth-child(2) {
        opacity: 0;
    }

    .navbar-toggle.active .toggle-icon:nth-child(3) {
        transform: rotate(-45deg) translate(5px, -5px);
    }

    .theme-toggle {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2em;
        transition: transform 0.3s ease;
    }

    .theme-toggle:hover {
        transform: scale(1.1) rotate(15deg);
    }

    /* アニメーション */
    .reveal-target {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .reveal-target.revealed {
        opacity: 1;
        transform: translateY(0);
    }

    /* プロフィール */
    .profile-image-container {
        margin: 20px 0;
    }

    .profile-image {
        width: 200px;
        height: 200px;
        border-radius: 50%;
        object-fit: cover;
        border: 5px solid #fff;
        box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
    }

    .profile-name {
        font-size: 2em;
        color: #667eea;
        margin: 15px 0;
    }

    .profile-description {
        font-size: 1.2em;
        color: #666;
        margin: 15px 0;
    }

    .profile-links {
        margin: 20px 0;
    }

    .profile-links h4 {
        color: #667eea;
        margin-bottom: 10px;
    }

    .profile-links ul {
        list-style: none;
        padding: 0;
    }

    .profile-links li {
        margin: 8px 0;
    }

    .profile-links a {
        color: #667eea;
        text-decoration: none;
        transition: color 0.3s ease;
    }

    .profile-links a:hover {
        color: #f093fb;
        text-decoration: underline;
    }

    .profile-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin: 20px 0;
    }

    .tag {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 0.9em;
        font-weight: 500;
    }

    .up-address {
        margin-top: 20px;
        padding: 15px;
        background: rgba(102, 126, 234, 0.1);
        border-radius: 10px;
    }

    .up-address code {
        font-family: 'Courier New', monospace;
        font-size: 0.9em;
        color: #667eea;
        word-break: break-all;
    }

    /* ダークモード */
    body.dark-mode {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    }

    body.dark-mode .navbar {
        background: rgba(26, 26, 46, 0.95);
    }

    body.dark-mode .nav-link {
        color: #fff;
    }

    body.dark-mode .nav-link:hover {
        color: #667eea;
    }

    body.dark-mode .card {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        color: #fff;
    }

    body.dark-mode h1,
    body.dark-mode .tagline {
        color: #fff;
    }

    body.dark-mode h2 {
        color: #667eea;
    }

    body.dark-mode p {
        color: #ddd;
    }

    body.dark-mode .profile-description {
        color: #ccc;
    }

    /* レスポンシブ */
    @media (max-width: 768px) {
        .navbar-toggle {
            display: flex;
        }

        .navbar-menu {
            position: absolute;
            top: 70px;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.98);
            flex-direction: column;
            padding: 20px;
            gap: 15px;
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        body.dark-mode .navbar-menu {
            background: rgba(26, 26, 46, 0.98);
        }

        .navbar-menu.active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }

        .nav-link {
            display: block;
            padding: 10px 0;
        }

        .theme-toggle {
            align-self: center;
            margin-top: 10px;
        }

        .profile-image {
            width: 150px;
            height: 150px;
        }
    }
`;
document.head.appendChild(styles);

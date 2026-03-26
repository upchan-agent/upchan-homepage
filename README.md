# 🆙chan Homepage

🆙chan の公式ホームページです。LUKSO ブロックチェーン上の Universal Profile 情報を表示し、🆙chan の世界観を表現するサイトです。

---

## 📋 プロジェクト概要

- **名称**: 🆙chan Homepage
- **目的**: 🆙chan の公式ホームページとして、LUKSO LSP-3 プロファイル情報を表示
- **対象**: 🆙chan ファン、LUKSO エコシステムユーザー
- **デプロイ**: Vercel によるホスティング

---

## ✨ 機能一覧

### 主要機能

- **LSP-3 プロファイル表示**: LUKSO ブロックチェーン上の Universal Profile データを取得・表示
- **レスポンシブデザイン**: スマホ・タブレット・PC に対応
- **アニメーション**: 🆙chan らしいかわいい動き

### 技術スタック

- **フレームワーク**: Vanilla HTML/CSS/JavaScript
- **ブロックチェーン**: LUKSO (LSP-3, ERC725)

---

## 🛠️ 開発セットアップ

### オプション 1: 単体 HTML (推奨 - シンプル)

このプロジェクトは単体の `index.html` で動作します。

```bash
# リポジトリをクローン
git clone https://github.com/your-org/upchan-homepage.git
cd upchan-homepage

# ローカルサーバーで起動（任意）
npx serve .
# または
python3 -m http.server 8080
```

ブラウザで `http://localhost:8080` を開くだけです！

### オプション 2: Vite (開発機能が必要な場合)

```bash
# Vite で初期化
npm create vite@latest . -- --template vanilla

# 依存関係をインストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build
```

---

## 🚀 Vercel デプロイ手順

### 初回セットアップ

```bash
# Vercel CLI をインストール
npm install -g vercel

# Vercel にログイン
vercel login

# プロジェクトをリンク
vercel link
```

### デプロイ実行

```bash
# 本番デプロイ
vercel --prod

# プレビューデプロイ（開発中）
vercel
```

### 自動デプロイ（GitHub 連携）

1. Vercel ダッシュボードでプロジェクトを作成
2. GitHub リポジトリを接続
3. 以降は `git push` で自動デプロイ

```bash
# 変更をプッシュ
git add .
git commit -m "feat: 新機能追加"
git push

# → Vercel が自動でデプロイ！
```

### ⚠️ 注意点

- **開発中はプレビューデプロイのみ使用** (`vercel` コマンド)
- **本番デプロイは慎重に** (`vercel --prod`)
- `vercel.json` で設定をカスタマイズ可能

---

## 🖼️ 画像の配置方法

### 配置先

```
/home/ubuntu/.openclaw/workspace/upchan-homepage/images/
```

### Google Drive から手動配置

1. **Google Drive から画像をダウンロード**
   - 共有フォルダから必要な画像をダウンロード
   - 形式：PNG, JPG, WebP など

2. **images ディレクトリに配置**
   ```bash
   # 例：プロフィール画像
   mv ~/Downloads/profile.png ./images/profile.png
   
   # 例：背景画像
   mv ~/Downloads/background.jpg ./images/background.jpg
   ```

3. **HTML で参照**
   ```html
   <img src="./images/profile.png" alt="🆙chan Profile">
   ```

### 画像最適化（推奨）

```bash
# WebP に変換（任意）
ffmpeg -i input.png -q:v 80 output.webp

# リサイズ
convert input.png -resize 800x output.png
```

---

## 🎨 カスタマイズ方法

### プロファイル情報の変更

`index.html` 内の JavaScript 部分を編集：

```javascript
// Universal Profile アドレス
const UP_ADDRESS = "0x5bA145ebB07e603328285A04589da2a7A202fCED";

// LUKSO RPC エンドポイント
const RPC_URL = "https://rpc.mainnet.lukso.network";
```

### デザインの変更

#### 色テーマ

Tailwind CSS のクラスを変更：

```html
<!-- 背景色 -->
<div class="bg-gradient-to-br from-purple-600 to-pink-500">

<!-- テキスト色 -->
<h1 class="text-white">🆙chan</h1>
```

#### フォント

Google Fonts を追加：

```html
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600&display=swap" rel="stylesheet">
```

```css
body {
  font-family: 'Fredoka', sans-serif;
}
```

### アニメーションの追加

CSS アニメーションをカスタマイズ：

```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.float {
  animation: float 3s ease-in-out infinite;
}
```

### LSP データの拡張

表示する LSP フィールドを追加：

```javascript
// LSP3Profile の取得
async function getLSP3Profile() {
  const response = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_call',
      params: [{
        to: UP_ADDRESS,
        data: '0x54f6127f5ef83ad9559033e6e941db7d7c495acdce616347d28e90c7ce47cbfcfcad3bc5'
      }, 'latest'],
      id: 1
    })
  });
  const data = await response.json();
  return data.result;
}
```

---

## 📁 ディレクトリ構造

```
upchan-homepage/
├── index.html          # メイン HTML ファイル
├── images/             # 画像アセット
│   ├── profile.png     # プロフィール画像
│   └── background.jpg  # 背景画像
├── src/                # ソースコード（Vite 使用時）
│   ├── main.js
│   └── style.css
├── .gitignore
└── README.md           # このファイル
```

---

## 🔗 関連リンク

- [LUKSO 公式サイト](https://lukso.network/)
- [LSP-3 仕様](https://docs.lukso.tech/standards/lsp-3-universal-profile-metadata)
- [Vercel ドキュメント](https://vercel.com/docs)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📝 ライセンス

MIT License

---

## 🆙 開発者向けメモ

### トラブルシューティング

**LSP データが取得できない**

1. RPC エンドポイントを確認
2. Universal Profile アドレスが正しいか確認
3. ブラウザのコンソールでエラーを確認

**Vercel で画像が表示されない**

1. 画像が `images/` ディレクトリにあるか確認
2. パスが大文字小文字含めて正しいか確認
3. `vercel.json` で静的アセット設定を確認

### パフォーマンス最適化

- 画像は WebP 形式を使用
- 必要最小限の JavaScript のみ読み込み
- CDN を活用（Font Awesome, Google Fonts）

---

**🆙chan と一緒にブロックチェーンの世界を楽しもう！✨**

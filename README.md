# HEIC / HEIF 一括変換 PWA

## 重要
このPWAは **Documents by Readdleで index.html を直接開くものではありません**。

PWAとして使うには、このフォルダ一式を **HTTPSで配信されるWebサイト** に置き、
そのURLをSafari / Edge / Chromeで開いてください。

## 含まれるファイル
- index.html
- manifest.webmanifest
- sw.js
- icon-192.png
- icon-512.png

## 使い方
1. ZIPを展開します。
2. フォルダ内のファイルを、GitHub Pages / Cloudflare Pages / Netlify等の静的Webホスティングへアップロードします。
3. 公開されたHTTPSのURLを開きます。
4. 初回だけインターネット接続した状態でページを読み込みます。
5. 画面に「オフライン準備完了」と表示されたら、変換ライブラリのキャッシュも完了です。

### iPhone / iPad
Safariで公開URLを開き、
「共有」→「ホーム画面に追加」

### Windows
EdgeまたはChromeで公開URLを開き、
ブラウザの「アプリとしてインストール」を使用します。

## 変換
- HEIC / HEIF / HIFを複数選択可能
- JPEG / PNGを選択可能
- JPEG画質を50〜100%で指定可能
- 複数枚をまとめてZIP保存
- 画像データ自体は変換のために外部サーバーへ送信しません

## オフラインについて
heic-to と JSZip は初回のみCDNから読み込みます。
Service Workerが取得済みライブラリをキャッシュするため、
「オフライン準備完了」後は通常オフラインでも変換できます。

## 注意
- PWA / Service Workerは file:// では動作しません。
- EXIF（撮影日時、GPS等）は変換後に基本的に保持されません。
- 非常に大量・高解像度の画像を一度に処理すると、端末のメモリ不足になる場合があります。

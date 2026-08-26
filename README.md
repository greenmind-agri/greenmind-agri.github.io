# Greenmind 網站

依《Greenmind 網站開發需求書 v1.0》製作的純靜態網站。無框架、無建置流程，
雙擊 `index.html` 即可開啟，也可直接部署到 GitHub Pages / Netlify / Vercel / Cloudflare Pages。

## 檔案結構

```
index.html      首頁
features.html   功能介紹
demo.html       Demo
survey.html     果農調查（Google 表單的落地頁）
about.html      關於我們
css/style.css   全站樣式與設計 token
js/main.js      手機選單、滾動進場、動態偏好處理
```

導覽連結使用實體檔名（`features.html`），不是 `/features`，
這樣本機雙擊開啟與靜態空間部署都不需要額外的 rewrite 設定。

## 待補內容

所有待補處在頁面上都有**虛線琥珀色外框**，直接在瀏覽器裡搜尋「待補」就能全部找到。

| 位置 | 待補項目 |
|---|---|
| `about.html` | 「我們的故事」實際文字 |
| `about.html` | 「我們的願景」實際文字 |
| `demo.html` | 巡田示範影片 |
| `demo.html` | 控制軟體介面實際截圖 3 張（取代現有 SVG 示意圖） |
| 各頁 footer、`about.html` CTA | 社群連結網址 |

## 果農調查連結

表單本體是 Google 表單，網站不直接連過去，而是先進 `survey.html` 這頁再跳出去。
這樣做的理由：農民點連結前需要先知道是誰在問、要填多久、資料怎麼用；
而且現場發的 QR code 只要指向 `survey.html`，之後換表單也不必重印。

表單網址在 `survey.html` 出現兩次（hero 與頁尾 CTA 各一顆按鈕），換連結時兩處都要改：

```
grep -n "reurl.cc" survey.html
```

目前使用短網址 `https://reurl.cc/6Xv3kO`。如果拿得到 Google 表單的原始網址
（`https://docs.google.com/forms/...`），建議直接換成原始網址——短網址服務停止營運或
被防毒軟體攔截時，這頁的按鈕會整個失效，而落地頁本身已經達到「網址好記」的目的了。

**QR code**：用任何工具產生指向 `https://你的網域/survey.html` 的 QR，印在現場文宣上。
不要直接把 Google 表單網址做成 QR。

**調查結束後**：把兩顆按鈕換成一段「調查已於 X 月 X 日截止，感謝 N 位果農參與」的說明，
不要讓農民點進 Google 的「表單已停止接受回覆」畫面。

## 換上 Demo 影片

影片來源尚未決定，介面已保留彈性。`demo.html` 的 `.video-frame` 區塊內：

- **YouTube**：放入 `<iframe src="https://www.youtube-nocookie.com/embed/影片ID" title="巡田示範影片" allowfullscreen></iframe>`
- **自架檔案**：放入 `<video src="影片路徑" controls poster="封面圖"></video>`

兩者的鋪滿樣式在 `css/style.css` 第 14 節都已備妥。放進去之後，
把同一區塊裡的 `.video-frame__center`（播放鈕與待補標記）整段刪掉即可。

## 設計系統

色彩、字體、圓角、間距全部集中在 `css/style.css` 開頭的 `:root`，改一處全站生效。

需求書 §4.1 之外多加了一個 token：`--amber-700: #8A5A12`。
原因是 `--amber-500` / `--amber-600` 放在淺色底上只有約 3:1 對比，
達不到 WCAG AA 的 4.5:1，所以**淺色底的小字級琥珀色文字**改用這一階（5.7:1）。
深色底仍照需求書使用 `--amber-500`。

## 品質確認範圍

四頁皆已實測：桌面（1240px）與手機（375px）無橫向溢出、
文字對比全數通過 WCAG AA、鍵盤焦點環正常、手機選單可用 Esc 關閉且會鎖住背景捲動。

`prefers-reduced-motion` 開啟時，進場淡入直接呈現最終狀態，
Hero 的巡行路徑動畫會停在起點（SVG 的 `animateMotion` 不受 CSS 控制，
因此由 `js/main.js` 呼叫 `pauseAnimations()` 處理），路徑圖形本身仍完整可讀。

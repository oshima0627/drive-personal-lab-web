# 運転不安セルフ診断アプリ — 運転パーソナルラボ（Drive Personal Lab）
## Webアプリ版 設計仕様書 v5.1
### （Androidアプリ版 v6.0 対応）

- **GitHubリポジトリ名**: drive-personal-lab-web
- **作成日**: 2026年3月
- **最終更新**: 2026年3月（v5.1）

---

## 修正ルール・適用ガイドライン

このセクションは過去の修正指示を元に定義したルールです。今後の修正にも適用してください。

### アプリ名・表示ルール

| 項目 | 表示名 |
|------|-------|
| アプリ名（UI表示・h1・メタタイトル） | **運転パーソナルラボ** |
| 診断機能のサブタイトル | **1分で簡単診断** |
| 診断所要時間 | **約1分**（16問） |
| 英語プロジェクト名（リポジトリ・内部識別子） | Drive Personal Lab（変更しない） |

### スコア・判定ルール

| 項目 | 値 | 根拠 |
|------|---|------|
| 不安ありしきい値（HIGH） | **50点**（原点6点/12点満点） | 各分類12点満点のうち6点以上を「不安あり」とする |
| 低不安しきい値（LOW_MAX） | 40点 | 全分類の最高スコアが40点未満なら低不安タイプ |
| 複合タイプ優先 | **複数分類が50点以上の場合は複合タイプを表示** | 同点でも単独タイプに落とさない |

### 分類別詳細セクション 表示ルール

| スコア | 表示内容 |
|-------|---------|
| **50点以上** | 共感コメント＋詳細説明を表示（「気になっている」扱い） |
| **50点未満** | 「今のところ、この分野はあまり気になっていないようです」を表示 |

> **注意**: 50点は「気になっている」扱いであり、50点で「気になっていない」と表示してはいけない。

---

## 目次

1. [プロジェクト概要](#1-プロジェクト概要)
2. [要件定義](#2-要件定義)
3. [技術スタック](#3-技術スタック)
4. [画面設計](#4-画面設計)
5. [基本設計](#5-基本設計)
6. [詳細設計](#6-詳細設計)
7. [データ設計](#7-データ設計)
8. [Web独自機能 詳細設計](#8-web独自機能-詳細設計)
9. [SEO / OGP 設計](#9-seo--ogp-設計)
10. [実装フェーズ](#10-実装フェーズ)
11. [Claude Code 実装プロンプト](#11-claude-code-実装プロンプト)

---

## 1. プロジェクト概要

### 1.1 コンセプト

Androidアプリ版「Drive Personal Lab」と同じ診断コンテンツ・タイプ定義・アドバイスをWebブラウザで提供するSPAです。ログイン不要でURLにアクセスするだけで診断でき、診断結果のSNSシェアとURLシェアをAndroidアプリ版に追加したWeb独自機能として実装します。

**コンテンツ方針**: Androidアプリ版と同一の質問・タイプ判定ロジック・アドバイス定義を使用する。コンテンツ修正は共通データファイルのみ変更すれば両方に反映される設計を目指す。

### 1.2 AndroidアプリとWebアプリの機能比較

| 機能 | Androidアプリ（v6） | Webアプリ（v1） |
|------|-------------------|----------------|
| 診断フロー（16問） | あり | あり |
| 不安タイプ判定（15種） | あり | あり |
| レーダーチャート表示 | あり | あり |
| 次の一歩アドバイス＋チェック | あり | あり |
| 分類別詳細画面 | あり | あり |
| 前回結果の閲覧 | あり（Isar保存） | あり（localStorage） |
| 診断結果のSNSシェア | なし | **あり（Web独自）** |
| 診断結果のURLシェア | なし | **あり（Web独自）** |
| ログイン・アカウント管理 | なし | なし |
| オフライン動作 | あり（Isar） | あり（localStorage） |

### 1.3 ターゲットユーザー・利用シーン

| ユーザー種別 | Webアプリの利用シーン |
|------------|-------------------|
| スマートフォンユーザー | SNSや知人からシェアされたリンクからすぐ診断 |
| PCユーザー | デスクトップブラウザで診断・結果をスクリーンショット保存 |
| サービスサイト訪問者 | サービスサイトから診断ページへ直接流入 |

---

## 2. 要件定義

### 2.1 機能要件

#### ① トップ（ホーム）ページ

- アプリ名・キャッチコピー・診断開始ボタンをファーストビューに配置
- 前回の診断結果がlocalStorageにある場合「前回の結果：〇〇タイプ（診断日）」バナーを表示
- 「診断を始める」ボタンで診断フローページへ遷移
- 「前回の結果を見る」リンク（前回結果がある場合のみ表示）
- サービスの説明セクション：4分類の簡単な説明をカードで表示

#### ② 診断フローページ

- 16問を1問ずつ表示。URLは `/diagnosis/[問番号]` 形式（ブラウザバック対応）
- 進捗バーと「問N / 全16問」を上部に常時表示
- 分類ラベル（「知識について」など）を質問の上に小さく表示
- `guideText` が設定されている問（Q9のみ）は質問文の下に薄いオレンジ背景のインフォボックスを表示
  - ガイド文：「※ まだ運転経験が少ない方は、想像や予感として感じるかどうかで答えてください」（`amber-50` 背景・`text-sm`・`italic`）
- 4択ボタン（「全く感じない」〜「非常に感じる」）を縦並びで表示
- ボタンタップ・クリック後 → 選択状態をハイライト → 0.3秒後に次問へ自動遷移
- 16問目の回答後 → 結果計算 → 結果ページへ自動遷移
- ブラウザバックで前の問に戻れる（回答は保持）
- 途中離脱防止：ページ離脱時にブラウザの `beforeunload` で確認ダイアログ

#### ③ 診断結果ページ（/result）

- 4分類スコアのレーダーチャート（Recharts）
- 判定タイプカード：タイプ名・共感コメント・対応カラー（15種類対応）
- 「次の一歩を考える」ボタンでアドバイスセクションへスクロール
- 「詳細を見る」ボタンで分類別詳細セクションへスクロール
- 結果はlocalStorageに自動保存
- **── Web独自機能 ──**
  - SNSシェアボタン：X（旧Twitter）・LINE の2種類
  - シェアテキスト例：「私の運転不安は『知識×経験 不安タイプ』でした。あなたも診断してみてください #運転パーソナルラボ」
  - URLコピーボタン：結果ページのURL（クエリパラメータにタイプIDを含む）をクリップボードにコピー

#### ④ 次の一歩アドバイスセクション（結果ページ内）

- 診断結果ページ内のセクションとして実装（別ページ遷移なし）
- 判定タイプに対応したアドバイス4項目をチェックボックス付きで表示
- チェック状態はlocalStorageに保存
- 「選んだ一歩」をSNSシェアできるボタンを追加（「私が選んだ一歩：〇〇 #運転パーソナルラボ」）

#### ⑤ 分類別詳細セクション（結果ページ内）

- 4分類それぞれのスコアバー＋共感コメント＋詳細説明をカード表示
- スコアが高い分類（**50点以上**＝原点換算6点以上）：共感コメント＋詳細説明を表示
- スコアが低い分類（50点未満）：「今のところ、この分野はあまり気になっていないようです」を表示
- **50点は「気になっている」扱い**のため必ず詳細情報を表示する

#### ⑥ 前回の結果ページ（/history）

- localStorageから最新の診断結果を取得して表示
- 診断日時・タイプ・レーダーチャート・選んだ一歩を表示
- 「もう一度診断する」ボタンで `/diagnosis/1` へ遷移

### 2.2 非機能要件

| 項目 | 要件 |
|------|------|
| レスポンシブ対応 | モバイル（320px〜）・タブレット・デスクトップ（1440px）の3ブレークポイント対応 |
| パフォーマンス | Lighthouse スコア 90以上（Performance / Accessibility / SEO） |
| OGP対応 | 結果シェア時にタイプ名入りのOGP画像を表示（og:title / og:description / og:image） |
| データ永続化 | localStorageに診断結果・チェック済みアドバイスを保存 |
| オフライン対応 | PWA対応（Service Worker）でオフラインでも診断可能 |
| ブラウザ対応 | Chrome / Safari / Firefox 最新版・iOS Safari / Android Chrome |
| SEO | Next.js SSG or SSR でメタタグ・構造化データを設定 |
| アクセシビリティ | WCAG 2.1 AA準拠。キーボード操作対応・aria属性付与 |
| デプロイ環境 | Vercel（無料枠）。GitHub連携で自動デプロイ |

### 2.3 URLシェア仕様

診断結果をURLで共有できるよう、結果ページのURLにタイプIDをクエリパラメータとして付与する。共有されたURLを開いた場合は診断フローをスキップして結果を表示する（自分の回答スコアは非表示）。

```
// 結果ページURL例
https://drive-personal-lab.vercel.app/result?type=kn_sk_ex

// URLを受け取った側の挙動
// - type パラメータが存在する → タイプカード・共感コメント・アドバイスを表示
// - レーダーチャートは表示しない（スコアデータがないため）
// - 「あなたも診断してみる」ボタンを prominently 表示
```

---

## 3. 技術スタック

| カテゴリ | 採用技術 | 理由 |
|--------|---------|------|
| フレームワーク | Next.js（App Router） | SSG/SSR・OGP・SEO・Vercelとの親和性 |
| 言語 | TypeScript | 型安全・Androidアプリと同様の設計思想 |
| UIライブラリ | Tailwind CSS | ユーティリティファースト・レスポンシブが簡単 |
| コンポーネント | shadcn/ui | アクセシブルなUIコンポーネント |
| グラフ | Recharts | Reactネイティブ・レーダーチャート対応 |
| アニメーション | Framer Motion | スコアカウントアップ・画面遷移アニメーション |
| 状態管理 | Zustand | 軽量・hooks親和性・localStorage永続化と相性良好 |
| 永続化 | localStorage + zustand-persist | ログイン不要・ブラウザ保存 |
| アイコン | Lucide React | 軽量・豊富なアイコン |
| OGP画像生成 | @vercel/og | 動的OGP画像生成 |
| デプロイ | Vercel | Next.js公式・GitHub連携・自動プレビュー |

### 3.1 ディレクトリ構成

```
drive-personal-lab-web/
├── app/
│   ├── page.tsx                  # トップ（ホーム）ページ
│   ├── diagnosis/
│   │   └── [step]/
│   │       └── page.tsx          # 診断フロー（問1〜16）
│   ├── result/
│   │   ├── page.tsx              # 診断結果ページ
│   │   └── opengraph-image.tsx   # 動的OGP画像
│   ├── history/
│   │   └── page.tsx              # 前回結果ページ
│   └── layout.tsx
├── components/
│   ├── diagnosis/
│   │   ├── QuestionCard.tsx
│   │   └── ProgressBar.tsx
│   ├── result/
│   │   ├── AnxietyTypeCard.tsx
│   │   ├── RadarChart.tsx
│   │   ├── AdviceChecklist.tsx
│   │   ├── DetailSection.tsx
│   │   └── ShareButtons.tsx
│   └── ui/                       # shadcn/ui コンポーネント
├── constants/
│   ├── questions.ts
│   ├── anxietyTypes.ts
│   └── adviceContent.ts
├── stores/
│   ├── diagnosisStore.ts
│   └── resultStore.ts
├── lib/
│   ├── scoreCalculator.ts
│   └── shareUtils.ts
└── public/
    └── ogp/
```

---

## 4. 画面設計

### 4.1 ページ一覧

| ページID | URL | ページ名 | 説明 |
|---------|-----|---------|------|
| PG-01 | / | トップページ | キャッチコピー・診断開始・前回結果バナー |
| PG-02 | /diagnosis/[step] | 診断フロー | 1〜16問を動的ルートで表示 |
| PG-03 | /result | 診断結果 | スコア・タイプ・アドバイス・シェア |
| PG-04 | /history | 前回の結果 | localStorage保存済みの最新1件 |

### 4.2 ナビゲーション構造

| 遷移元 | 操作 | 遷移先 |
|-------|------|-------|
| PG-01 トップ | 「診断を始める」クリック | PG-02 /diagnosis/1 |
| PG-01 トップ | 「前回の結果を見る」クリック | PG-04 /history |
| PG-02 診断フロー | 16問すべて回答 | PG-03 /result（localStorage保存） |
| PG-02 診断フロー | ブラウザバック | 前の問に戻る（回答保持） |
| PG-03 結果 | 「次の一歩を考える」クリック | 同ページ内スクロール |
| PG-03 結果 | 「詳細を見る」クリック | 同ページ内スクロール |
| PG-03 結果 | 「もう一度診断する」クリック | PG-02 /diagnosis/1 |
| PG-03 結果 | 「Xでシェア」クリック | X投稿ダイアログ（新規タブ） |
| PG-03 結果 | 「LINEでシェア」クリック | LINE共有（新規タブ） |
| PG-04 前回結果 | 「もう一度診断する」クリック | PG-02 /diagnosis/1 |

### 4.3 レスポンシブレイアウト方針

| ブレークポイント | 対象デバイス | レイアウト |
|--------------|-----------|----------|
| 〜767px（sm） | スマートフォン | 1カラム・縦スクロール・フルワイズボタン |
| 768〜1023px（md） | タブレット | コンテンツ最大幅768px・中央寄せ |
| 1024px〜（lg） | デスクトップ | 結果ページは左（チャート）右（タイプ）の2カラム |

---

## 5. 基本設計

### 5.1 質問設計

各分類4問、合計16問。質問は「〜なことがありますか？」という柔らかい問いかけの形式で統一。

経験不安（Q9〜Q12）は、過去の失敗経験がある人・ない人の両方が答えられる表現に統一。実体験だけでなく「想像・予感」としての不安もスコアに反映できるよう設計する。

Q9の画面にはガイド文を表示する：「※ まだ運転経験が少ない方は、想像や予感として感じるかどうかで答えてください」。`questions.ts` の `guideText` フィールドで管理し、Q9のみ設定する。

#### 質問一覧

| 分類 | Q番号 | 質問文 |
|-----|------|-------|
| 知識不安 | Q1 | 交差点での優先順位が分からなくなることがありますか？ |
| 知識不安 | Q2 | 道路標識の意味が分からず困ることがありますか？ |
| 知識不安 | Q3 | 高速道路の合流・車線変更のルールが不安になることがありますか？ |
| 知識不安 | Q4 | 駐車・停車のルールがあいまいだと感じることがありますか？ |
| 技術不安 | Q5 | ハンドル操作がうまくできるか不安になることがありますか？ |
| 技術不安 | Q6 | 縦列駐車・車庫入れに強い苦手意識がありますか？ |
| 技術不安 | Q7 | 車線変更やカーブで体が硬くなる感覚がありますか？ |
| 技術不安 | Q8 | ブレーキやアクセルの踏み加減が難しいと感じますか？ |
| 経験不安 | Q9 | 【ガイド文あり】運転中に怖いと感じた・感じそうな場面を思い浮かべることがありますか？ |
| 経験不安 | Q10 | ぶつけたり・こすったりするかもという不安が、運転への自信に影響していますか？ |
| 経験不安 | Q11 | 運転中のヒヤリとした場面（実際・想像問わず）が頭に浮かぶことがありますか？ |
| 経験不安 | Q12 | 「同じ失敗をするかも」「怖い場面になるかも」と想像して不安になることがありますか？ |
| 環境不安 | Q13 | 助手席に誰かいないと運転できないと感じますか？ |
| 環境不安 | Q14 | 一人で知らない道を走ることを想像するとためらいますか？ |
| 環境不安 | Q15 | 緊急時（パンク・事故）に一人で対応できるか不安ですか？ |
| 環境不安 | Q16 | 「何かあったとき誰もいない」という状況が怖いですか？ |

### 5.2 回答選択肢と配点

| 選択肢テキスト | スコア |
|------------|------|
| 全く感じない | 0点 |
| 少し感じる | 1点 |
| かなり感じる | 2点 |
| 非常に感じる | 3点 |

各分類の合計スコア（0〜12点）を100点満点に換算してレーダーチャートに表示する。

**換算式**: `表示スコア = Math.round(合計点 / 12 * 100)`

### 5.3 不安タイプ判定フロー

各分類の満点は12点（4問 × 最大3点）。**6点以上（換算50点以上）を「不安あり」と判定する。**

| 判定条件 | 適用タイプ | タイプIDの例 |
|---------|---------|-----------|
| 全分類の最高スコアが40点未満 | 低不安タイプ（2種） | `low_confident` / `low_unsure` |
| 4分類すべて50点以上 | 総合複合タイプ | `all` |
| 3分類が50点以上 | 3分類複合タイプ（4パターン） | `kn_sk_ex` / `kn_sk_en` / `kn_ex_en` / `sk_ex_en` |
| 2分類が50点以上 | 2分類複合タイプ（6パターン） | `kn_sk` / `kn_ex` / `kn_en` / `sk_ex` / `sk_en` / `ex_en` |
| 1分類が50点以上 | 単独タイプ（4種） | `knowledge` / `skill` / `experience` / `environment` |
| 0分類（最高スコアが40〜49点） | 最高スコアの単独タイプ | （同上） |

> **重要**: 複数分類が同点で50点以上になった場合は、単独タイプではなく複合タイプを表示する。

---

## 6. 詳細設計

### 6.1 不安タイプ定義（単独タイプ・4種）

`constants/anxietyTypes.ts` に定数として定義。断言表現を使わず共感・寄り添いを意識したコピーを使用する。

| タイプID | タイプ名 | 共感コメント | 詳細説明 |
|---------|---------|-----------|---------|
| `knowledge` | 知識が不安タイプ | 「どうすればいいか分からない」という感覚、とても自然です。 | ルールや標識の意味があいまいなまま運転するのは誰でも不安です。知識を整理するだけで気持ちがラクになることがあります。 |
| `skill` | 技術が不安タイプ | 「体がうまく動かせるか」という心配、よく聞くお悩みです。 | 頭では分かっていても体が追いつかない感覚は、経験を重ねることで少しずつ変わっていきます。 |
| `experience` | 経験が不安タイプ | 過去の体験が今も残っているのですね。それだけ真剣に向き合ってきた証です。 | 怖い記憶は消えなくても、新しい安心できる経験が少しずつ上書きされていきます。 |
| `environment` | 環境が不安タイプ | 「一人でいざとなったら」という不安、すごく共感できます。 | 誰かがいる安心感はとても大切です。その感覚を大切にしながら、少しずつ慣れていける方法を一緒に考えましょう。 |

#### 低不安タイプ（2種）

全分類の最高スコアが40点未満の場合に適用。「不安がない・低い」ことをポジティブに伝えながら、自己認識を深めるコメントを表示する。

| タイプID | タイプ名 | 判定条件 | 共感コメント | 詳細説明 |
|---------|---------|---------|-----------|---------|
| `low_confident` | 安心ドライバータイプ | 最高スコア40点未満 かつ 経験スコア17点以上 | 今のところ、運転に大きな不安を感じていないようですね。それはとても素晴らしいことです。 | 不安が少ない状態は、それだけ運転と上手く付き合えている証です。このまま安心して乗り続けられるよう、定期的に自分の状態を確認してみてください。 |
| `low_unsure` | 様子見タイプ | 最高スコア40点未満 かつ 経験スコア16点以下 | 今はまだ、どんな場面で不安を感じるか分からない段階かもしれません。 | 実際に乗り始めてみると、どの分野が気になるか見えてくることがあります。乗ってみてから、また診断してみてください。 |

### 6.2 複合タイプ定義

#### 2分類複合タイプ（6パターン）

| タイプID | タイプ名 | 構成分類 | 共感コメント |
|---------|---------|---------|-----------|
| `kn_sk` | 知識×技術 不安タイプ | 知識 + 技術 | 「どうすればいいか分からないし、体も動くか不安」という気持ち、よく分かります。 |
| `kn_ex` | 知識×経験 不安タイプ | 知識 + 経験 | 過去の経験と知識のあいまいさが重なって、不安が大きくなっているのかもしれません。 |
| `kn_en` | 知識×環境 不安タイプ | 知識 + 環境 | 一人で判断する場面が想像できなくて怖い、という感覚はとても自然です。 |
| `sk_ex` | 技術×経験 不安タイプ | 技術 + 経験 | 体の不安と過去の記憶が重なって、運転への一歩が踏み出しにくい状態かもしれません。 |
| `sk_en` | 技術×環境 不安タイプ | 技術 + 環境 | 「うまく動かせるか」と「一人でいいのか」が同時に気になっているのですね。 |
| `ex_en` | 経験×環境 不安タイプ | 経験 + 環境 | 過去の怖い記憶と、一人だという孤独感が重なっているのかもしれません。 |

#### 3分類複合タイプ（4パターン）

| タイプID | タイプ名 | 構成分類 | 共感コメント |
|---------|---------|---------|-----------|
| `kn_sk_ex` | 知識×技術×経験 不安タイプ | 知識+技術+経験 | 過去の記憶・技術への不安・知識のあいまいさ、たくさんのことが重なっているのですね。一つずつ整理していきましょう。 |
| `kn_sk_en` | 知識×技術×環境 不安タイプ | 知識+技術+環境 | 「分からない・できない・一人では無理」という気持ちが重なっている状態、とても正直な感覚です。 |
| `kn_ex_en` | 知識×経験×環境 不安タイプ | 知識+経験+環境 | 過去の怖さ・知識の不安・一人でいることへの怖さ、それぞれが影響し合っているようです。 |
| `sk_ex_en` | 技術×経験×環境 不安タイプ | 技術+経験+環境 | 体の動き・過去の経験・孤独感、深いところに不安の根っこがあるようです。一緒に整理しましょう。 |

#### 4分類複合タイプ（1パターン）

| タイプID | タイプ名 | 構成分類 | 共感コメント |
|---------|---------|---------|-----------|
| `all` | 総合不安タイプ | 知識+技術+経験+環境 | 全ての面で不安を感じているのですね。それだけ真剣に運転と向き合っている証でもあります。一つずつ、ゆっくり整理していきましょう。 |

### 6.3 アドバイス定義（単独タイプ・16項目）

`constants/adviceContent.ts` に定数として定義。「〜してみてはいかがでしょう？」の表現で統一。

| タイプID | アドバイスID | アドバイス文 |
|---------|-----------|-----------|
| `knowledge` | knowledge_01 | まず1つだけ、気になる標識の意味を調べてみてはいかがでしょう？ |
| `knowledge` | knowledge_02 | よく通る道の交差点ルールを1箇所だけ確認してみるのはどうでしょう？ |
| `knowledge` | knowledge_03 | 合流・車線変更の手順を文章で一度整理してみてはいかがでしょう？ |
| `knowledge` | knowledge_04 | 駐車場の入出庫ルールを駐車場サイトで確認してみるのはどうでしょう？ |
| `skill` | skill_01 | まず駐車場で車を動かすだけの練習から始めてみてはいかがでしょう？ |
| `skill` | skill_02 | 広い空き地でハンドルの感覚をゆっくり確かめてみるのはどうでしょう？ |
| `skill` | skill_03 | 同乗者に見てもらいながら近所だけ走ってみてはいかがでしょう？ |
| `skill` | skill_04 | 車の操作を動画で確認して頭の中でイメトレしてみるのはどうでしょう？ |
| `experience` | exp_01 | その時の状況を紙に書き出して、何が怖かったかを整理してみてはいかがでしょう？ |
| `experience` | exp_02 | 信頼できる人に同乗してもらって短い距離だけ走ってみるのはどうでしょう？ |
| `experience` | exp_03 | 「あの失敗があったから慎重になれた」と少し視点を変えてみてはいかがでしょう？ |
| `experience` | exp_04 | 怖かった場面を誰かに話してみるだけでも、気持ちが整理されることがあります。 |
| `environment` | env_01 | まず同乗者がいる状態でだけ、短い距離を走ってみてはいかがでしょう？ |
| `environment` | env_02 | 緊急時の対応手順（ロードサービスの電話番号など）をメモしておくのはどうでしょう？ |
| `environment` | env_03 | よく知っている安心できる道を一人で走る練習から始めてみてはいかがでしょう？ |
| `environment` | env_04 | 「困ったときは助けを呼べばいい」と思えるだけで気持ちがラクになることがあります。 |

#### 低不安タイプアドバイス（2タイプ × 4項目）

低不安タイプには「次の一歩を押しつけない」姿勢を徹底する。「今のままで十分」を認めつつ、気づきを促すアドバイスに限定する。

| タイプID | アドバイスID | アドバイス文 |
|---------|-----------|-----------|
| `low_confident` | low_confident_01 | 今の状態をそのまま続けていくだけで十分です。あえて何かを変える必要はありません。 |
| `low_confident` | low_confident_02 | たまに「最近どんな場面でドキッとした？」と自分に問いかけてみるのはどうでしょう？ |
| `low_confident` | low_confident_03 | 安心して乗れている自分を、少し褒めてあげてもいいかもしれません。 |
| `low_confident` | low_confident_04 | 気になることが出てきたときに、またこの診断を使ってみてください。 |
| `low_unsure` | low_unsure_01 | まずは「短い距離だけ乗ってみる」という体験から始めてみてはいかがでしょう？ |
| `low_unsure` | low_unsure_02 | 乗ってみて「あ、ここが気になる」と感じたことをメモしてみるのはどうでしょう？ |
| `low_unsure` | low_unsure_03 | 診断後にまた乗ってみてから、もう一度診断してみるのも一つの方法です。 |
| `low_unsure` | low_unsure_04 | 「どんな場面が一番怖いか」を想像するだけでも、不安の輪郭が見えてくることがあります。 |

### 6.4 アドバイス定義（複合タイプ・44項目）

#### 2分類複合（6タイプ × 4項目）

| タイプID | アドバイスID | アドバイス文 |
|---------|-----------|-----------|
| `kn_sk` | kn_sk_01 | まず「知っていること」を1つ確認してから、短い距離だけ動かしてみてはいかがでしょう？ |
| `kn_sk` | kn_sk_02 | YouTube等で運転手順の動画を見ながら、頭と体を一緒になじませてみるのはどうでしょう？ |
| `kn_sk` | kn_sk_03 | 駐車場でゆっくりルール確認しながら操作練習してみてはいかがでしょう？ |
| `kn_sk` | kn_sk_04 | 「今日は右折のルールだけ確認する」など、1日1テーマで小さく進めてみるのはどうでしょう？ |
| `kn_ex` | kn_ex_01 | あの時「何が分からなかったか」を書き出して整理してみてはいかがでしょう？ |
| `kn_ex` | kn_ex_02 | 「知識があれば防げた」と思えることを1つだけ調べてみるのはどうでしょう？ |
| `kn_ex` | kn_ex_03 | 過去の怖い場面を「知識で解決できること」と「それ以外」に分けてみてはいかがでしょう？ |
| `kn_ex` | kn_ex_04 | 信頼できる人に当時の状況を話して、客観的な意見をもらってみるのはどうでしょう？ |
| `kn_en` | kn_en_01 | 「一人でも調べれば分かることリスト」を作ってみてはいかがでしょう？ |
| `kn_en` | kn_en_02 | よく通るルートのルールだけを事前に調べて、安心材料を増やしてみるのはどうでしょう？ |
| `kn_en` | kn_en_03 | 「この道はこのルールで走れる」と確認してから、同乗者と一緒に走ってみてはいかがでしょう？ |
| `kn_en` | kn_en_04 | 緊急時の電話番号（JAFなど）を登録して、知識と環境の両方を整えてみるのはどうでしょう？ |
| `sk_ex` | sk_ex_01 | 過去の失敗の場面を「今なら違う操作ができるか？」と冷静に振り返ってみてはいかがでしょう？ |
| `sk_ex` | sk_ex_02 | 信頼できる人に同乗してもらって「見ていてもらう」だけでもいい練習から始めてみてはどうでしょう？ |
| `sk_ex` | sk_ex_03 | 「あの時と今は違う」と思える小さな成功体験を1つ作ってみてはいかがでしょう？ |
| `sk_ex` | sk_ex_04 | 焦らず「ゆっくり動かすだけの日」を設けてみてはいかがでしょう？ |
| `sk_en` | sk_en_01 | まず同乗者がいる状態でだけ、ゆっくり動かしてみてはいかがでしょう？ |
| `sk_en` | sk_en_02 | 「誰かに見てもらうと安心できる」という気持ちを大切にして練習してみるのはどうでしょう？ |
| `sk_en` | sk_en_03 | 「うまくできなくても助けてもらえる」状況で操作練習してみてはいかがでしょう？ |
| `sk_en` | sk_en_04 | 緊急時の対応手順を一緒に確認してから走る練習を始めてみてはいかがでしょう？ |
| `ex_en` | ex_en_01 | 「あの時は一人だったから怖かった」という要因を分けて考えてみてはいかがでしょう？ |
| `ex_en` | ex_en_02 | 信頼できる人に怖かった体験を話して、一緒に整理してみるのはどうでしょう？ |
| `ex_en` | ex_en_03 | 「緊急時は助けを呼べばいい」という安心感を持ちながら、短い距離を誰かと走ってみてはどうでしょう？ |
| `ex_en` | ex_en_04 | 「怖い記憶があるから慎重に走れる」という側面もあります。その慎重さを活かしてみてはいかがでしょう？ |

#### 3分類複合（4タイプ × 4項目）

| タイプID | アドバイスID | アドバイス文 |
|---------|-----------|-----------|
| `kn_sk_ex` | kn_sk_ex_01 | まず「あの時の失敗は何が原因だったか」を知識・技術・状況の3つで書き出してみてはいかがでしょう？ |
| `kn_sk_ex` | kn_sk_ex_02 | 怖い記憶を「知識で防げたこと」と「操作で防げたこと」に分けて考えてみるのはどうでしょう？ |
| `kn_sk_ex` | kn_sk_ex_03 | まず1つだけ、「知識を確認してから安全な場所で操作してみる」小さなチャレンジをしてみては？ |
| `kn_sk_ex` | kn_sk_ex_04 | 不安を誰かに話すだけでも、気持ちが整理されることがあります。話せる人はいますか？ |
| `kn_sk_en` | kn_sk_en_01 | 同乗者がいる安心感の中で「ルールを1つ確認しながら動かす」練習から始めてみてはいかがでしょう？ |
| `kn_sk_en` | kn_sk_en_02 | 「分からないことは調べ、できないことは誰かと練習する」を合言葉にしてみてはどうでしょう？ |
| `kn_sk_en` | kn_sk_en_03 | 緊急時の手順を事前に調べてメモしておくだけで、気持ちがラクになることがあります。 |
| `kn_sk_en` | kn_sk_en_04 | 「今日は助手席の人に説明しながら走る」という練習から始めてみてはいかがでしょう？ |
| `kn_ex_en` | kn_ex_en_01 | 過去の怖かった場面を「あの時、何を知っていれば違ったか」という視点で振り返ってみてはどうでしょう？ |
| `kn_ex_en` | kn_ex_en_02 | 「緊急時に頼れる連絡先」と「よく迷うルールのメモ」を一緒に作ってみてはいかがでしょう？ |
| `kn_ex_en` | kn_ex_en_03 | 信頼できる人に同乗してもらって、過去の怖かった場面の近くを一緒に走ってみてはどうでしょう？ |
| `kn_ex_en` | kn_ex_en_04 | 「一人じゃない」という感覚を持てる状態で、少しずつ知識を確認しながら走ってみてはいかがでしょう？ |
| `sk_ex_en` | sk_ex_en_01 | 「誰かがいる安心感」の中で、過去の怖かった場面に似た状況をゆっくり体験し直してみてはどうでしょう？ |
| `sk_ex_en` | sk_ex_en_02 | 「うまくできなくても助けてもらえる」環境で、操作練習を少しずつ重ねてみてはいかがでしょう？ |
| `sk_ex_en` | sk_ex_en_03 | 怖い記憶と体の緊張は繋がっていることがあります。ゆっくり話せる場を作ってみてはどうでしょう？ |
| `sk_ex_en` | sk_ex_en_04 | 「今日は動かすだけ、誰かと一緒に」という小さな一歩から始めてみてはいかがでしょう？ |

#### 4分類複合・総合不安タイプ（4項目）

| タイプID | アドバイスID | アドバイス文 |
|---------|-----------|-----------|
| `all` | all_01 | 今すぐ全部解決しなくていいです。「今週できる小さなこと」を1つだけ選んでみてはいかがでしょう？ |
| `all` | all_02 | 不安を誰かに話すだけでも、整理されていくことがあります。信頼できる人に話してみてはどうでしょう？ |
| `all` | all_03 | 「どの不安が一番大きいか」を1つだけ選んで、そこだけに集中してみてはいかがでしょう？ |
| `all` | all_04 | まず「今日できる一番小さなこと」を1つだけ選んで、やってみてはいかがでしょう？ |

### 6.5 Zustand ストア詳細設計

```typescript
// stores/diagnosisStore.ts（ページリロードで初期化、永続化なし）
interface DiagnosisState {
  answers: (number | null)[];  // 16問の回答。null=未回答
  currentStep: number;          // 1〜16（URLの[step]と同期）
  isCompleted: boolean;
  setAnswer: (step: number, score: number) => void;
  // setAnswer後、自動で currentStep を+1。step==16 なら isCompleted=true
  reset: () => void;
}

// stores/resultStore.ts（localStorage 'dpl_result' に永続化）
interface ResultState {
  result: StoredResult | null;
  setResult: (result: StoredResult) => void;
  toggleAdvice: (id: string) => void;
  // toggleAdvice: result.checkedAdviceIds のトグル → localStorage自動更新
}
```

| ストア名 | localStorageキー | 永続化対象 |
|---------|---------------|---------|
| `diagnosisStore` | なし（セッション中のみ） | answers / currentStep / isCompleted |
| `resultStore` | `dpl_result` | result（StoredResult全体） |

### 6.6 scoreCalculator.ts 詳細

```typescript
// lib/scoreCalculator.ts

type AnxietyKey = 'knowledge' | 'skill' | 'experience' | 'environment';
type Scores = Record<AnxietyKey, number>; // 各 0〜100

export function calcScores(answers: number[]): Scores {
  // Q1〜4  → knowledge  合計(0〜12) → Math.round(合計/12*100)
  // Q5〜8  → skill
  // Q9〜12 → experience
  // Q13〜16→ environment
}

export function resolveTypeId(scores: Scores): string {
  // 高不安しきい値：各分類12点満点のうち6点以上 = 50点以上を不安ありと判定
  const HIGH = 50;
  const LOW_MAX = 40;

  // 低不安タイプ判定：全分類の最高スコアが40点未満
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore < LOW_MAX) {
    return scores.experience >= 17 ? 'low_confident' : 'low_unsure';
  }

  const high: AnxietyKey[] = (Object.keys(scores) as AnxietyKey[])
    .filter(k => scores[k] >= HIGH);

  if (high.length === 4) return 'all';

  if (high.length === 3) {
    const s = new Set(high);
    if (!s.has('environment')) return 'kn_sk_ex';
    if (!s.has('experience'))  return 'kn_sk_en';
    if (!s.has('skill'))       return 'kn_ex_en';
    return 'sk_ex_en';
  }

  if (high.length === 2) {
    const map: Record<string, string> = {
      'knowledge,skill':       'kn_sk',
      'knowledge,experience':  'kn_ex',
      'knowledge,environment': 'kn_en',
      'skill,experience':      'sk_ex',
      'skill,environment':     'sk_en',
      'experience,environment':'ex_en',
    };
    return map[high.sort().join(',')];
  }

  if (high.length === 1) return high[0];

  // 0分類：最高スコアの単独タイプ
  return (Object.keys(scores) as AnxietyKey[])
    .reduce((a, b) => scores[a] >= scores[b] ? a : b);
}
```

---

## 7. データ設計

### 7.1 localStorage スキーマ

```typescript
// キー名: 'dpl_result'
interface StoredResult {
  takenAt: string;            // ISO 8601 日時文字列
  scores: {
    knowledge: number;        // 0〜100
    skill: number;
    experience: number;
    environment: number;
  };
  typeId: string;             // 15種のタイプID
  rawAnswers: number[];       // 16問の回答（0〜3）
  checkedAdviceIds: string[]; // チェック済みアドバイスID
}
```

### 7.2 スコア計算・タイプ判定ロジック

- Q1〜4 → `knowledge` / Q5〜8 → `skill` / Q9〜12 → `experience` / Q13〜16 → `environment`
- 換算式：`Math.round(合計 / 12 * 100)`
- 詳細実装は「6.6 scoreCalculator.ts 詳細」を参照

---

## 8. Web独自機能 詳細設計

### 8.1 SNSシェア機能

```typescript
// lib/shareUtils.ts

// X（旧Twitter）シェア
export function buildXShareUrl(typeId: string, typeName: string): string {
  const text = encodeURIComponent(
    `私の運転不安タイプは「${typeName}」でした。\n` +
    `あなたはどのタイプ？運転不安を4分類で診断してみよう。\n` +
    `#運転パーソナルラボ #ペーパードライバー\n`
  );
  const url = encodeURIComponent(
    'https://drive-personal-lab.vercel.app/result?type=' + typeId
  );
  return `https://x.com/intent/tweet?text=${text}&url=${url}`;
}

// LINEシェア
export function buildLineShareUrl(typeId: string, typeName: string): string {
  const text = encodeURIComponent(
    `私の運転不安タイプは「${typeName}」でした。\n` +
    `https://drive-personal-lab.vercel.app/result?type=${typeId}`
  );
  return `https://social-plugins.line.me/lineit/share?url=${text}`;
}

// URLコピー
// await navigator.clipboard.writeText(shareUrl);
// コピー後 → ボタンテキストを「コピーしました！」に一時変更（2秒後に戻す）
```

### 8.2 動的OGP画像生成

`app/result/opengraph-image.tsx` にて `@vercel/og` を使用して動的生成する。

- サイズ: 1200 × 630px
- URLパラメータ `?type=xxx` を受け取り、タイプ名入り画像を生成
- 表示要素：アプリロゴ・アプリ名・「あなたの運転不安タイプは」・タイプ名（大きく・タイプカラーで表示）・「診断してみる →」

---

## 9. SEO / OGP 設計

### 9.1 メタタグ設定

| ページ | title | description |
|------|-------|-------------|
| トップ | 1分で簡単診断 \| 運転パーソナルラボ | ペーパードライバー・運転初心者向け。知識・技術・経験・環境の4分類で運転不安をセルフ診断。あなたのタイプを無料で診断。 |
| 診断フロー | 診断中 \| 運転パーソナルラボ | 16問の質問に答えて、あなたの運転不安タイプを診断中。 |
| 結果（動的） | [タイプ名] \| 運転パーソナルラボ | あなたの運転不安タイプは[タイプ名]です。次の小さな一歩を一緒に考えましょう。 |
| 前回の結果 | 前回の診断結果 \| 運転パーソナルラボ | 前回の運転不安診断の結果を振り返る。 |

### 9.2 構造化データ（JSON-LD）

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "運転パーソナルラボ",
  "description": "運転不安セルフ診断アプリ",
  "applicationCategory": "HealthApplication",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" }
}
```

---

## 10. 実装フェーズ

| Phase | 実装内容 | 優先度 |
|-------|---------|------|
| Phase 1 | Next.jsプロジェクト初期化・Tailwind/shadcn/ui設定・Vercel連携・カラーテーマ定義 | 必須 |
| Phase 2 | 定数ファイル移植（questions.ts / anxietyTypes.ts / adviceContent.ts）・scoreCalculator.ts | 必須 |
| Phase 3 | Zustandストア設計（diagnosisStore / resultStore + localStorage永続化） | 必須 |
| Phase 4 | 診断フローページ（/diagnosis/[step]）・QuestionCard・ProgressBar | 必須 |
| Phase 5 | 結果ページ（/result）・RadarChart・AnxietyTypeCard・スコア表示 | 必須 |
| Phase 6 | AdviceChecklist（チェックボックス・保存）・DetailSection | 必須 |
| Phase 7 | ShareButtons（X・LINE・URLコピー） | 必須 |
| Phase 8 | トップページ・前回結果ページ・ナビゲーション | 必須 |
| Phase 9 | OGP・動的OGP画像（@vercel/og）・メタタグ・構造化データ | 高 |
| Phase 10 | PWA対応（Service Worker・manifest.json）・アニメーション | 高 |
| Phase 11 | アクセシビリティ対応（aria属性・キーボード操作）・Lighthouse調整 | 中 |

---

## 11. Claude Code 実装プロンプト

### 11.1 Phase 1〜3：初期化・定数・ストア

```
以下の仕様でNext.js製Webアプリ「Drive Personal Lab」を実装してください。

【アプリ概要】
ペーパードライバー・運転初心者向けの運転不安セルフ診断Webアプリ（SPA）。
ログイン不要・ブラウザのlocalStorageにデータ保存。
Androidアプリ版（Flutter）と同じ診断ロジック・タイプ定義・アドバイスを使用。

【技術スタック】
- フレームワーク：Next.js 14（App Router）
- 言語：TypeScript
- スタイリング：Tailwind CSS
- UIコンポーネント：shadcn/ui
- グラフ：Recharts（RadarChart）
- アニメーション：Framer Motion
- 状態管理：Zustand（+ zustand-persist for localStorage）
- デプロイ：Vercel

【実装内容】
1. Next.jsプロジェクト初期化（App Router / TypeScript / Tailwind CSS）
   shadcn/ui・Recharts・Framer Motion・Zustand のインストール設定

2. カラーテーマ定義（tailwind.config.ts）
   primary: #1565C0 / knowledge: #1976D2 / skill: #7B1FA2 /
   experience: #C62828 / environment: #2E7D32

3. constants/questions.ts: 16問の質問データ
   { id, anxietyType, questionText, orderIndex, guideText?: string }
   guideText は Q9 のみ設定：「※ まだ運転経験が少ない方は...」

4. constants/anxietyTypes.ts: 17種のタイプ定義
   各タイプ：{ id, name, comment, description, color }
   getAnxietyTypeById(id) 関数も合わせて実装

5. constants/adviceContent.ts: 68項目のアドバイスデータ
   { id, typeId, text }
   getAdviceByTypeId(typeId) 関数も合わせて実装

6. lib/scoreCalculator.ts
   calcScores(answers): Scores
   resolveTypeId(scores): string（17種のタイプID判定）

7. Zustand ストア
   stores/diagnosisStore.ts: answers / currentStep / isCompleted / setAnswer / reset
   stores/resultStore.ts: result / setResult / toggleAdvice（localStorage永続化）
```

### 11.2 Phase 4〜6：診断フロー・結果・アドバイス

```
【診断フロー・結果・アドバイスの実装】

1. /diagnosis/[step]/page.tsx（PG-02）
   - URLの[step]は1〜16
   - ProgressBar：LinearProgress + 「問N / 全16問」
   - 分類ラベル（AnxietyType名）を質問文の上に小さく表示
   - question.guideText がある場合（Q9のみ）：質問文の下に
     amber-50 背景・border-l-4 border-amber-400 のインフォボックスを表示
     テキストは text-sm italic で表示
   - QuestionCard：質問文（22px）+ 4択ボタン（縦並び）
     「全く感じない（0）」「少し感じる（1）」「かなり感じる（2）」「非常に感じる（3）」
   - タップ・クリック → ハイライト → 300ms後に次ステップへ router.push
   - 16問目回答後 → calcScores → resolveTypeId → setResult → router.push('/result')
   - ページ離脱時は window.onbeforeunload で警告ダイアログ

2. /result/page.tsx（PG-03）
   - URLパラメータ ?type=xxx がある場合：共有URL表示モード
     タイプカード・アドバイスのみ表示。レーダーチャートは非表示。
     「あなたも診断してみる」ボタンを表示
   - 通常モード：localStorageから結果を取得して全セクション表示
   - RadarChart：Recharts の RadarChart で4分類スコアを表示
   - AnxietyTypeCard：typeIdから getAnxietyTypeById でタイプ情報を取得して表示

3. AdviceChecklist コンポーネント（/result内）
   - getAdviceByTypeId(typeId) で4項目を取得して表示
   - チェックボックス付きリスト。toggleAdvice でZustandに反映・localStorage保存
   - 「選んだ一歩をシェア」ボタン：チェック済み項目のテキストでXシェア

4. DetailSection コンポーネント（/result内）
   - 4分類それぞれをカード表示
   - スコアバー（Tailwind幅可変）+ コメント / 説明
   - スコア50未満：「今のところ、この分野はあまり気になっていないようです」（50点以上は詳細表示）
```

### 11.3 Phase 7〜8：シェア・トップ・履歴

```
【シェア機能・トップ・履歴の実装】

1. ShareButtons コンポーネント
   - Xシェア：buildXShareUrl(typeId, typeName) でURLを生成し window.open
   - LINEシェア：buildLineShareUrl(typeId, typeName) でURLを生成し window.open
   - URLコピー：navigator.clipboard.writeText(shareUrl)
     コピー後2秒間ボタンテキストを「コピーしました！」に変更

2. /（トップページ）
   - ヒーローセクション：アプリ名・キャッチ・「診断を始める」ボタン
   - localStorageに結果がある場合：「前回の結果：〇〇タイプ（日付）」バナーを表示
   - 4分類紹介カード：知識・技術・経験・環境をタイプカラーで表示

3. /history（前回の結果ページ）
   - localStorageの dpl_result を取得して表示
   - 診断日時・タイプカード・レーダーチャート・選んだ一歩リスト
   - 「もう一度診断する」ボタン → /diagnosis/1

4. OGP・メタタグ
   - 各ページに適切な title / description / og:title / og:description を設定
   - 結果ページは[type]パラメータをもとに動的メタタグを生成
   - app/result/opengraph-image.tsx で @vercel/og を使って動的OGP画像を生成
     1200×630px。タイプ名とアプリ名を大きく表示。
```

---

*Drive Personal Lab Webアプリ版 設計仕様書 v5.0 | 2026年3月*

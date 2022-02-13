---
title: 'ブログを作りました'
date: '2022-01-16'
---

去年 12 月からダラダラ作り続けていた自作ブログがある程度見せられる状態になったので、記念すべき第 1 号記事としてブログ作成の経緯などをまとめます。

# なぜ作ったか

## 気軽に書き下せるブログがほしかった

自分は用途や目的に応じてプラットフォームを使い分けるのが苦手で、ブログ書くときは一箇所で完結させたいという気持ちがありました。しかし、[Zenn](https://zenn.dev/)や [Qiita](https://qiita.com/)では、ある程度中身のある記事を書くことが求められるので、記事を書くこと自体が億劫になってしまいます。

また、Qiita や Zenn に書くほどでもない個人的な技術的な知見や、読書記録や日常的な出来事も記事にしたいという願望もありました。

## Markdown で書いた記事を Github で管理したかった。

プラットフォームで記事を管理すると、そのプラットフォームから別プラットフォームに移行したいときにとても不便な未来が見えてたので、できるだけ Github で Markdown ファイルを管理したいと思いました。

# ブログのコンセプト

今回作ったブログのコンセプトは大きく次の 3 つです。

### 1. シンプルな見た目

凝ったものを作る時間もないし、できるだけ簡潔で見やすいものを。

### 2. 目に優しい

自分が一番長くこのサイトを見ることになるので、長時間見てても疲れない、目に優しい配色にしようと決めました。

### 3. GFM 対応

技術的な記事も書くので GFM (Github Flavered Markdown)に対応してるもの。

#　デザイン

## 配色

配色が多いと、自分のデザイン力では見た目がごちゃごちゃしそうだったのと、配色は 3 色だけでいい感じになるということだったのでメインカラーを 3 つに絞って探しました。
最終的に[Happy Hues](http://qiita.com 'Happy Hues Palette 4')という、配色のパターンと、それを使ったときのサイトの見た目を表示してくれるサイトで自分好みの配色が見つかったので、こちらをそのまま使わせてもらいました。

## レイアウト

配色が決まったので、次にレイアウトをざっくり決めました。今回は Figma を初めて使いました。

![Figmaで作った](/images/my-first-post-figma.png 'Figmaで作ったデザイン')

## ロゴ

せっかくなので自作のロゴも作りました。自分の名前が Ryuta Udo なので単純に頭文字の R と U を取って重ねました。色は決めた配色のプライマリーカラーとセカンダリーカラーを使っています。
これは Figma で作りました。

<div align="center">
  <img src="/images/logo.svg" width="200">
</div>

# 作る

## Next.js のチュートリアル

今回はとりあえずはローカルの`**.md`ファイルをパースしてページごとに表示できれば十分だと考えていたので、[Next.js のブログ作成チュートリアル](https://github.com/vercel/next-learn/tree/master/basics/typescript-final)のベースからスタイルを与えていくだけという感じです。

## Marked + Prism for GFM

当ブログでは技術記事も書きたいということで、GFM(Github Flavared Markdown)を取り入れたいと考えました。Next.js のチュートリアルで採用されていたマークダウンパーサ[remark](https://github.com/remarkjs/remark)だと GFM (テーブルやコードブロックのシンタックスハイライト)を導入する方法がすぐに見つからなかったので、代わりに[marked](https://github.com/markedjs/marked)を使いました。

[marked](https://github.com/markedjs/marked)は`setOptions`メソッドでカンタンに GFM を有効にできること、そして軽量シンタックスハイライトである[Prism](https://prismjs.com/)との連携が楽にできるということで採用しました。

```javascript posts.ts
import { marked } from 'marked'
import prism from 'prismjs'

marked.setOptions({
  highlight(code, lang) {
    try {
      return prism.highlight(code, prism.languages[lang], lang)
    } catch {
      return code
    }
  },
  gfm: true,
})

// 中略

// マークダウンをHTML stringに変換
const content = marked.parse(content)
```

## 結果

結果テーブルやコードブロックでも問題なくパースされます。
（以下[Markdown 記法 表示確認用サンプル - Qiita](http://qiita.com/salchu/items/da81122ed50b35feda4d 'Markdown記法 表示確認用サンプル - Qiita')から一部拝借。）

### テーブル

テーブル

| Left align | Right align | Center align |
| :--------- | ----------: | :----------: |
| This       |        This |     This     |
| column     |      column |    column    |
| will       |        will |     will     |
| be         |          be |      be      |
| left       |       right |    center    |
| aligned    |     aligned |   aligned    |

### コードブロック

```html
<!DOCTYPE html>
<head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>バッククォート囲みに拡張子付きhtml</title>
  /* コメント */
</head>
```

```css
body {
  display: none;
} /* コメント */
```

# 今後追加したい機能

今は公開までの最低限の機能を積んでいるだけで、今後はブログを運用しながら随時追加機能を開発していきたいと思います。
余裕があれば自作マークダウンパーサーにも挑戦してみたいです。SSG なので高速じゃなくてもサイトのパフォーマンスには影響がないはず。。。

## 追加機能案

(順不同)

- 目次
- 記事一覧のページネーション
- ライトテーマ、ダークテーマ切り替え
- 管理者機能（ブラウザエディターで自動的に github commit で更新）
- コードブロックコピー機能
- URL のただ張りからブックマークを自動生成。（多分マークダウンパーサー自作しないといけない？）
- Twitter などの埋め込み（これも自作マークダウンパーサ必要？）
- 公開日と変更日をコミット履歴から自動生成
- カテゴリータグ機能
- 読む時間を表示
- 見た目もろもろ...

# まとめ

とりあえず公開できる状態まで持っていけてよかったです。
なんかおかしいところがあれば[Twitter](https://twitter.com/ryuta_udo)の DM で教えてくれるとありがたいです。

---
title: 'マークダウンテスト用サンプル1'
date: '2020-12-02'
---

Markdown 記法サンプル

# 見出し 1（h1）

# 見出し 1（h1）

## 見出し 2（h2)

## 見出し 2（h2）

### 見出し 3

#### 見出し 4

##### 見出し 5

###### 見出し 6

---

ここは段落です。♪ もーもたろさん もーもたーろさん おっこしーにつっけたーちーびまーるこー

ここは段落です。  
↑ 半角スペース 2 個で強制改行しています。  
♪ もーもたろさん もーもたーろさん おっこしーにつっけたーちーんあーなごー

- **強い強調（strong）です。** **これも強い強調です。** `<strong>`strong タグです。`</strong>`
- _強調（em）です。_ _これも強調です。_ 斜体の`<em>`タグになります。
- **_強調斜体です。_** **_強調斜体です。_** `<strong>`＋`<em>`タグになります。

> 引用（Blockquote）です

> > 引用のネストです

> 上に一行空けないとネストのままです

引用（Blockquote）の中には Markdown 要素を入れられます

> ## 見出し
>
> 1. 数字リスト
> 2. 数字リスト

## エスケープ文字

\*アスタリスクをバックスラッシュでエスケープ\*

\## 見出しハッシュ文字をエスケープ

HTML タグをバックスラッシュでエスケープ →（\<p>）

HTML をバッククォートでインラインコード →（`<p>`）

## 水平線（`<hr>`）各種

アスタリスク 3 個半角スペース空けて

---

アスタリスク 3 個以上

---

ハイフン半角スペース空けて

---

続けてハイフン 3 個以上

---

## リスト

- ハイフン箇条書きリスト

* プラス箇条書きリスト

- 米印箇条書きリスト
  - 二階層め・箇条書きリスト
    - 三階層め・箇条書きリスト
    - 四階層め・箇条書きリスト

* 箇条書きリスト

---

1. 番号付きリスト
   1. 二階層め・番号付きリスト 1
   1. 二階層め・番号付きリスト 2
1. 番号付きリスト 2
   1. 二階層め・番号付きリスト 1
      1. 三階層め・番号付きリスト 1
      1. 三階層め・番号付きリスト 2
      1. 四階層め・番号付きリスト 1
   1. 二階層め・番号付きリスト 2
1. 番号付きリスト 3

定義リストタイトル
: 定義リスト要素 1
: 定義リスト要素 2
: 定義リスト要素 3

## コードブロック

```
バッククォート or 半角チルダ3個でくくります。
###ここにはMarkdown書式は効きません
/* コメント */
testtest // コメント
```

```
<!DOCTYPE html>
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>ニョロニョロ囲みhtml</title>
/* コメント */
```

```
<!DOCTYPE html>
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>バッククォート囲みhtml</title>
```

```
body { display: none; } /* バッククォート囲みcss */
// コメント
```

    // 先頭に半角スペース4つでcode囲い
    <?php if (is_tag()){ $posts = query_posts($query_string . '&showposts=20'); } ?>

```javascript
const test = 10
console.log(test)
```

バッククォート 1 個ずつで囲むとインラインのコード（`<code></code>`）です。`body { visibility: hidden; }`

## リンク

markdown でテキストリンク [WIRED.jp](http://wired.jp/ 'WIRED.jp')

<カッコ>でくくってリンク <http://wired.jp/>

定義参照リンクです。SNS には [Twitter] [1] や [Facebook] [2] や [Google+] [3] などがあります。

[1]: https://twitter.com/ 'Twitter'
[2]: https://ja-jp.facebook.com/ 'Facebook'
[3]: https://plus.google.com/ 'Google+'

## 画像

![うきっ！](http://mkb.salchu.net/image/salchu_image02.jpg 'salchu_image02.jpg')

## table

| Left align | Right align | Center align |
| :--------- | ----------: | :----------: |
| This       |        This |     This     |
| column     |      column |    column    |
| will       |        will |     will     |
| be         |          be |      be      |
| left       |       right |    center    |
| aligned    |     aligned |   aligned    |

（Kobito のヘルプ md から拝借しました）

# GFM

## リンク

URL そのまま貼り付け http://wired.jp/

## 段落中の改行

ここは段落です。
↑return で改行しています。
♪ もーもたろさん もーもたーろさん おっこしーにつっけたーちー ○○ ー ○○ ー

## コードブロック

バッククォートの開始囲みに続けて拡張子でシンタックスハイライト

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

```php
<?php if (is_tag()){ $posts = query_posts($query_string . '&showposts=20'); } ?>
```

## 取り消し線

~~取り消し線（GFM 記法）~~  
<s>s タグです。</s>

## 単語中のアンダースコアの無効

GitHub_Flavored_Markdown_test_test

## tasklist

- [ ] task1
- [ ] task2
- [x] completed task

---

from [Markdown 記法 表示確認用サンプル - Qiita](http://qiita.com/salchu/items/da81122ed50b35feda4d 'Markdown記法 表示確認用サンプル - Qiita')

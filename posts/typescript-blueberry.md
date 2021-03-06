---
title: 'プロを目指す人のためのTypeScript入門を読んだ'
date: '2022-05-05'
---

[プロを目指す人のための TypeScript 入門]を読んだ感想と自分的ポイントのメモ

# 第 1 章 イントロダクション

TypesScript = JavaScript + 静的型付けという前提の説明。江添本の引用が印象的だった。

> - コンパイルエラーは普通
> - コンパイルエラーが出たらありがとう
> - コンパイルエラーが出たら大喜び

TypeScript コンパイラがやっていること

1. 型チェック
1. トランスパイル

トランスパイルの段階

1. 型注釈を取り除く
1. 新しい構文から古い構文に変換する

**ランタイムの挙動は型情報に依存しない。あくまで JS の拡張という立場を守っている。** TypeScript の挙動を理解する上で役立つ考え方。この立場に反するような機能は利用が推奨されていない。

### コラム 1 TypeScript の独自機能は避けるべき？

TypeScript 独自機能`enum`、`namespace`はランタイムの挙動を変える。TypeScript の現在の方針はこうした独自機能は追加せず、あくまで JavaScript の拡張としての立ち位置を貫く。

# 第 2 章 基本構文

JavaScript の基本構文の復習。数値リテラルは普段使わないので忘れがち。`BigInt`についても言及されていて良い復習に鳴った。

### 数値リテラル

10 進数以外も表現できる

```js
const binary = 0b1010 // 2進数リテラル
const octal = 0o755 // 8進数リテラル
const hexadecimal = 0xff // 10進数リテラル

console.log(binary, octal, hexadecimal)
// 10 493 255
```

### BigInt リテラル

任意の精度の整数を扱う型。整数の後に`n`をつける。

```js
const bignum: bigint = (123n + 456n) * 2n

console.log(bignum) // 1158nと表示される。
```

### コラム 4 TypeScript における数値は IEEE754 倍精度浮動小数点数である

TypeScript の数値は IEEE754 倍精度浮動小数点数 = 精度は 53 ビット

# 第 3 章 オブジェクト

Temporal や正規表現についても比較的丁寧に解説されていた。プリミティブのプロパティにアクセスするたびに一時的なオブジェクトが作られるのは知らなかった。

### コラム 9 インデックスシグネチャの罠

インデクスシグネチャ(`[key: string]`)は存在しないプロパティにアクセスしてもコンパイルエラーにならず、型安全性を破壊する事ができる。型推論によってインデックスシグネチャが発生する場合もある。基本的には使用を避けるべき。

```typescript
type MyObj = { [key: string]: number }
const obj: MyObj = { foo: 123 }

const num: number = obj.bar // undefined: 存在しないプロパティ
```

### コラム 10 typeof はいつ使うべきか

`typeof` で型推論結果を取り出すより、`type`で型を明示的に宣言するほうがわかりやすい。使い所の判断は「**何が最上位の事実か**」。
型が最上位の事実: `type`
値が最上位の事実: `typeof`

# 第 4 章　関数の作り方

関数型の部分型をしっかり解説している。

- 関数型の引数に名前がついている理由：型チェックに影響はないが、適切に名前をつけていればそれがドキュメントになるから。
- 返り値の方が読まずとも明らかな場合以外は、実装のミスを防ぐために関数の返り値の型注釈はしたほうが良さそう。自分の実装か、返り値の型注釈のどちらを**真実の源**か意識する。
- 関数型の部分型。TypeScript は（独自機能使わない限り）ランタイムの挙動に影響を与えない。常に心に留めておきたい。
- 型安全の観点からメソッド記法での関数型の定義は避けるべき。（引数の部分型の条件がゆるくなってしまうから）
- 配列型の引数に関しては`readonly`もっと使っていこう。オブジェクトは`readonly`をつけたからと行って型安全とは限らない。
- `readonly T[]`は`T[]`の部分型ではない。`(readonly)`

# 第 5 章　クラスの宣言と使用

React hooks が誕生して以来、現場でクラス使ったこと殆どない。

- `#`知らなかった。`private`との違いは
  - `#`: JavaScript の機能でランタイムでもプライベート性が守られる。
  - `private`: TypeScript 独自機能なのでコンパイル時のチェックのみ。ランタイムではプライベート性がないのでハックができてしまう。
- this めんどくさいですね。アロー関数使いましょう
- catch ブロックに何も処理がないのダメ絶対
- try-catch は型情報が聞かないから err unknown 型なので具体的な処理がやりづらい
- 大域脱出でエラー処理を一箇所にまとめられるのは魅力だけど、try-catch が増えるとどこでキャッチされるか不明不明で扱いづらい → 返り値によって処理するほうがいい

# 第 6 章　高度な型

ユニオン型とインターセクション型の解説。たまに出てくる`keyof typeof`とか`<T,K extends keyof T>`の良き復習になった。この本で勉強したかった項目が詰まっていた。

- 2 つの「ない」
  - 型にない：構造的部分型によって型にはないが、実在するかもしれないプロパティ
  - 値がない：実際に値がない
- 後から書き換え可能なもの（readonly がないオブジェクトのプロパティ、let で宣言された変数など）には widening が生じる
- リテラル型に絞りたいときは`as const`を使う
- **代数的データ型** ` tag``type `プロパティで型絞り込みを行う。使い所ありそう
- lookup 型 `K[T]` はぱっと見何の型かわからないから使い所は慎重に
- `as`や`!`はできるだけ使わない。使うならコメントを残すこと。ユーザ定義型ガードを使うこと。
- `any`を最凶の危険性を誇る型 -> `as`かできれば`unknown`を使おう
- `never`型はすべての型の部分型
- 安全性的には `any` < `as` < ユーザ定義型ガード < `unknown`かな？右から順に検討していくと良さそう。

# 第 7 章 TypeScript のモジュールシステム

ES Modules についての解説。

- default はエディタ補完が聞かないので使わないほうがいい。
- 複数`import`されてもモジュールの実態は一つだけ。
- エクスポートする変数名はインポートしてそのまま使える名前のほうがいい（モジュール名を入れるとか）

#　第 8 章　非同期

非同期をコールバック → Promise -> async/await の順に解説。
`Promise.allSettled`や`Promise.any` など比較的新しめのメソッドも紹介されていた。

# 第 9 章 TypeScript のコンパイラオプション

tsconfig についての解説。流し読み。

# まとめ

JavaScript の基本構文から解説していて、JavaScript/TypeScript 初心者でも読みやすそうな内容だった。個人的には歴史的な経緯や最新の仕様についても触れられていた点や筆者の主張がところどころに散りばめられて楽しく読むことができた。

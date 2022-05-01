---
title: 'Effective Goの自分用日本語訳'
date: '2022-04-30'
---

[Effective Go](https://go.dev/doc/effective_go) を読んだときの自分用翻訳メモ。（訳の正確性を保証するものではない）

# Introduction

うまく Go を書くには、Java や C++といった他言語の観点は忘れて、Go の観点で問題を考えることが結果的な成功につながる。
そのために Go で確立された命名規則、フォーマット、プログラム構築などの慣習を知ることが大事。

2022 年 1 月に追記:
このドキュメントは Go がリリースされた 2009 年に書かれたが、大きな改変は行われていない。モダンな Go のエコシステムにはほとんど触れられていないし、今後も大きな更新の予定もない。他のブログや書籍でその役割が果たされているから、読者はその点に留意してね。

## Example

[Go package sources](https://go.dev/src/)はコアライブラリそのものだけでなく、言語の使い方の例も示している。公式サイトで直接実行可能な example が多くある。問題に対するアプローチや実装について疑問を持ったら、ライブラリにあるドキュメント、コード、example に答えやアイディア、背景を得られるでしょう。

# Formatting

フォーマット問題は議論が尽きないが、結論の出にくい問題である。
複数のフォーマットを受け入れることもできるが、その必要がなければその方がベター。全員が同じスタイルを固守すればその問題に費やす時間も減る。問題はどのように長々としたスタイルガイドなしに、それが実現できるか。

Go ではマシンにフォーマット問題の面倒をみてもらう。 `gofmt`プログラムが Go プログラムを読み込み、標準スタイルに従ったコードを吐き出す。

# Commentary

C スタイルの`/* */`ブロックコメントと C++スタイルの`//`行コメントが提供されている。ブロックコメントの多くはパッケージのコメントとして現れるが、式の中でも有効だし、大量の行のコードをコメントアウトしたいときにも使える。

`godoc`は Go のソースファイルを処理して、パッケージの内容についてのドキュメントを抽出する。

# Names

## Package names

パッケージをインポートされたとき、そのパッケージ名がその中身へのアクセサーになる。そのパッケージを参照するために皆が同じ名前を使うことになるので、パッケージの名前は**短く**、**簡潔で**、**内容の想像を喚起しやすいもの**が良い。慣習として、**小文字**、**1 単語**で、スネークケースやキャメルケースにする必要がない用に命名する。パッケージネームはデフォルトのインポート名なので、ソースコード全体の中でユニークである必要はない。名前がかぶったときはインポート時にエリアスが使える。

その他の慣習は、パッケージ名はソースディレクトリのベースネームになる。`src/encoding/base64`にあるパッケージは、`encoding/base64`としてインポートされる。

パッケージをインポートする側はその中身を参照するためにパッケージ名を使うので、エクスポートするものの名前にパッケージの名前を含める必要はない。例えば、`bufio`パッケージにある buffered reader の type は`BufReader`ではなく単に`Reader`と呼ばれる。なぜならインポート側は使う際は`bufio.Reader`と書くので `bufio`の reader であることは明白である。`io`パッケージにも`Reader`と呼ばれるタイプがあるが、`io.Reader`と呼ばれるので元のパッケージを明確に識別できる。他には`ring`のコンストラクターは`NewRing`ではなく`New`。(参照時は`ring.New`)

## Getters

Go はゲッターとセッターの自動サポートを提供しない。ゲッターの名前に`Get`を使うのは慣用的ではないし必要もない。`owner`というフィールド（小文字、エクスポートされてない）があるならば、`GetOwner`ではなく`Owner`と呼ばれるべき。セッター関数は`SetOwner`と呼ばれる。

```go
owner := obj.Owner()
if owner != user {
    obj.SetOwner(user)
}
```

## Interface names

単一メソッドの interface は慣用的に**メソッド名 + サフィックス -er**と名付けられる。`Reader`、`Writer`、`Formatter`。

`Read`、`Write`、`Close`、`String`などには正規のシグネチャと意味がある。自分でメソッドを作るときはそれらの名前を基本使わないようにする。逆に自分が実装する type が well-known type のメソッドの同じ意味のメソッドのときは、well-known タイプのメソッドの同じ名前とシグネチャを使う。自分で文字列変換を実装するなら`String`ではなく`ToString`

## MixedCaps

Go では複数単語で命名する場合はスネークケースではなく**キャメルケース**で命名する。

# Semicolons

Go は宣言を完了するためにセミコロンを使うが、ソースコード上には現れない。その代わりに字句解析器 (lexer)がシンプルなルールに従って自動でセミコロンを挿入する。

そのルールは、改行前の最後のトークンが識別子(`int`や`float64`を含む)、number や string などのリテラル、または次のトークンのうちの一つの場合

```go
break continue fallthrough return ++ -- ) }
```

字句解析器は常にそのトークのあとにセミコロンを挿入する。これはつまり**宣言文を終了できるようなトークンのあとに改行があると、セミコロンを挿入する**

また、閉じ中括弧の直前のセミコロンは省略されるので。次のような宣言文の場合はセミコロンが必要ない。

```go
go func() { for {dst <- <-src } }()
```

慣用的な Go プログラムではセミコロンは`for`ループの初期化句、条件句、更新句を分けるためだけに使われる。その他には複数の宣言文を一行で書くときに必要となるが、そのようにコード書くべきなのか？（答えは No）

このセミコロン挿入ルールによって、制御構文（`if`、`for`, `switch`, `select`）のはじめ中カッコ`{`を次の行に書くことはできない。もし改行すると、はじめ中括弧の前にセミコロンが挿入されてしまう。

```go
// Good
if i < f() {
    g()
}

// NG
if i < f()  // ここにセミコロンが挿入されてしまう
{           // 改行だめ！
    g()
}

```

# Control structures

## If

Go のシンプルな`if`は次の通り。

```go
if x > 0 {
    return y
}
```

`if`と`switch`は初期化宣言を受け付けるので、その中でローカル変数を用意するのはよく見る。

```go
if err := file.Chmod(0664); err != nil {
    log.Print(err)
    return err

```

Go のライブラリでは、`if`ステートメントが次のステートメントにいかない（body が`break`, `continue`, `goto`, `return`で終わる）場合、不要な`else`は省略される。

```go
f, err := os.Open(name)
if err != nil {
    return err
}
codeUsing(f)
```

次の例では、連続するエラー条件に対してガードしている。エラーケースが発生するたびにそのケースが除外され、成功するフローが下まで行けばコードは最後まで読まれる。エラーケースは`return`宣言で終わっているので、`else`はどこにも必要ない。

## Redeclaration and reassignment

次の条件を満たす場合、`:=`を使って変数の再宣言ができる。

- その宣言が既存の宣言の同スコープにいるとき（もし変数`v`が外側のスコープで宣言されていれば、新たな変数を作成する）
- 初期化された変数に対応する値が`v`に再代入可能なとき
- その宣言によって生成される変数がその他に一つ以上あるとき

こうしたプロパティは、例えば単一の`err`を長い`if-else`チェインで使うときに実用的。

## For

Go の`for`ループは、C の`for`と`while`を統一したようなもので、`do-while`は存在しない。

```go
// Like a C for
for init; condition; post { }

// Like a C while
for condition { }

// Like a C for(;;)
for { }
```

配列、スライス、文字列、マップ、チャネルから読み込むなどのようなことをしたい場合は`range` 句を使う。

```go
for key, value := range oldMap {
    newMapp[key] = value
}
```

`range`の 2 番目の要素しか使わない場合は空識別子(_blank identifier_) `_`を使って最初の要素を破棄できる。

```go
sum := 0
for _, value := range array {
    sum += value
}
```

文字列では`range`が UTF-8 を解析して、個々のユニコードのコードポイントを分割する。誤ったエンコーディングは 1 バイトを消費して U+FFFD ルーンに置き換える。（文字化けの黒いはてなのやつ）`rune`は単一ユニコードコードポイントに対する Go の用語。

```go
for pos, char := range "日本\x80語" { // \x80 is an illegal UTF-8 encoding
    fmt.Printf("character %#U starts at byte position %d\n", char, pos)
}
```

は次を出力する。

```
character U+65E5 '日' starts at byte position 0
character U+672C '本' starts at byte position 3
character U+FFFD '�' starts at byte position 6
character U+8A9E '語' starts at byte position 7
```

Go にはコンマオペレーターはなく、`++`、`--`は宣言であり、式ではない。よって`for`の中で複数の変数を扱いたい場合は、次のように並行に代入しなければならない。

```go
// Reverse a
for i, j := 0, len(a)-1; i < j; i, j = i+1, j-1 {
    a[i], a[j] = a[j], a[i]
}
```

## Switch

Go の`switch`文は C よりも汎用的。`switch`に続く式は定数でも整数でもある必要はなく、各 case はマッチするまで上から下に評価される。また`switch`に続く式がない場合は`true`に変換され、`if`、`else if`、`else`チェインのような処理を書くことができる。

```go
func unhex(c byte) byte {
    switch {
    case '0' <= c && c <= '9':
        return c - '0'
    case 'a' <= c && c <= 'f':
        return c - 'a' + 10
    case 'A' <= c && c <= 'F':
        return c - 'A' + 10
    }
    return 0
}
```

自動でフォールスルーしないが、複数のケースをコンマ区切りのリストで表すことができる。

```go
func shouldEscape(c byte) bool {
    switch c {
    case ' ', '?', '&', '=', '#', '+', '%':
        return true
    }
    return false
}
```

`switch`を早期に終了するために`break`を使う。`swich`そのものではなく、それを囲うループを抜け出したい時がある。その場合は、そのループにラベルを付け、そのラベルを`break`するように記述すれば良い。

```go
Loop:
	for n := 0; n < len(src); n += size {
		switch {
		case src[n] < sizeOne:
			if validateOnly {
				break
			}
			size = 1
			update(src[n])

		case src[n] < sizeTwo:
			if n+1 >= len(src) {
				err = errShortInput
				break Loop
			}
			if validateOnly {
				break
			}
			size = 2
			update(src[n] + src[n+1]<<shift)
		}
	}
```

当然`continue`はループだけに適用される。

## Type switch

インターフェイス変数の動的な型を発見することにも使える。そのような*type switch*　はカッコに囲まれた`type`を使った型アサーションを使う。`switch`分の式が変数を宣言するとき、その変数は各句に対応する型を持つ。その場合はその変数名を再利用することが慣用的。その場合は同じ名前の変数を宣言しているが、その型が毎回違うことになる。

```go
var t interface{}
t = functionOfSomeType()
switch t := t.(type) {
default:
    fmt.Printf("unexpected type %T\n", t)     // %T prints whatever type t has
case bool:
    fmt.Printf("boolean %t\n", t)             // t has type bool
case int:
    fmt.Printf("integer %d\n", t)             // t has type int
case *bool:
    fmt.Printf("pointer to boolean %t\n", *t) // t has type *bool
case *int:
    fmt.Printf("pointer to integer %d\n", *t) // t has type *int
}
}
```

# Functions

## Multiple return values

Go の関数は複数の値を返すことができる。

C では、書き込みエラーは負のカウントによって通知され、エラーコードは揮発性の場所に秘匿される。。Go では、`Write`がカウントと`“Yes, you wrote some bytes but not all of them because you filled the device”`とうい趣旨のエラーの両方を返す。`os`パッケージの`Write`メソッドのシグネチャは

```go
func (file *File) Write(b []byte) (n int, err error)
```

そして、`n != len(b)`のとき、書き込まれたバイト数`n`と nill ではない`error`を返すとドキュメントに記載されている。

似たようなアプローチで参照パラメタを計算するためにポインタを返す必要がなくなる。バイトスライスにおけるポジションから、その数値とその次のポジションを取り出す関数。

```go
func nextInt(b []byte, i int) (int, int) {
    for ; i < len(b) && !isDigit(b[i]); i++ { // 数値じゃなくて、iがバイトスライスの長さより小さい場合はiを加算していく
    }
    x := 0
    for ; i < len(b) && isDigit(b[i]); i++ {　// 数値で
        x = x*10 + int(b[i]) - '0'
    }
    return x, i
}
```

## Named result parameters

Go の戻り値(パラメタ)には名前をつけることができ、入力パラメタと同じく通常の変数のように扱うことができる。名前がつけられた戻り値パラメタはその型のゼロ値に初期化される。その関数が引数なしで`return`される場合、その時点での結果のパラメタの値を返す。

名前は必須ではないが、その名前自体が関数のドキュメントになりコードを短くきれいにすることができる。

```go
func nextInt(b []byte, pos int) (value, nextPos int) {
```

名前付き戻り値は初期化され、戻り値なしの`return`と紐付けられるので、明確化とシンプル化ができる。

```go
func ReadFull(r Reader, buf []byte) (n int, err error) {
    for len(buf) > 0 && err == nil {
        var nr int
        nr, err = r.Read(buf)
        n += nr
        buf = buf[nr:]
    }
    return
}
```

## Defer

Go の`defer`は、`defer`関数をを実行する関数が return する直前に`defer`関数を実行する。これは関数がどんなパスを通ったとしてもリソースを開放する処理を扱いたいときなどに効果的。mutex の unlock や、ファイルを閉じる処理が例として挙げられる。

```go
// Contents returns the file's contents as a string.
func Contents(filename string) (string, error) {
    f, err := os.Open(filename)
    if err != nil {
        return "", err
    }
    defer f.Close()  // f.Close will run when we're finished.

    var result []byte
    buf := make([]byte, 100)
    for {
        n, err := f.Read(buf[0:])
        result = append(result, buf[0:n]...) // append is discussed later.
        if err != nil {
            if err == io.EOF {
                break
            }
            return "", err  // f will be closed if we return here.
        }
    }
    return string(result), nil // f will be closed if we return here.
}
```

`Close`などの関数を遅延呼び出しすることには 2 つの利点がある。1 つはファイルの閉じ忘れを防げること。2 つ目はファイルを開く処理のそばに閉じる処理をかけるので、関数の最後に`Close`処理を書くよりもわかりやすい。

遅延関数の引数は、それが呼ばれるときではなく、**遅延させるとき**に評価される。変数の値の変更を心配する必要がなくなるのと、単一の遅延呼び出しで、複数の関数の実行を遅延させることができる。

```go
for i := 0; i < 5; i++ {
    defer fmt.Printf("%d ", i)
}
```

遅延関数は LIFO で処理されるので、上の例は`4 3 2 1 0`と出力される。関数の処理を追跡することもできる。

```go
func trace(s string)   { fmt.Println("entering:", s) }
func untrace(s string) { fmt.Println("leaving:", s) }

// Use them like this:
func a() {
    trace("a")
    defer untrace("a")
    // do something....
}
```

遅延関数への引数は`defer`が行われるときに評価されることを利用して、より良いトレーシングの追跡開始と追跡終了の確認を行える。

```go
func trace(s string) string {
    fmt.Println("entering:", s)
    return s
}

func un(s string) {
    fmt.Println("leaving:", s)
}

func a() {
    defer un(trace("a")) // ここでtrace("a")が評価、実行される
    fmt.Println("in a")
}

func b() {
    defer un(trace("b")) // ここでtrace("b")が評価、実行される
    fmt.Println("in b")
    a()
}

func main() {
    b()
}
```

この出力は

```
entering: b
in b
entering: a
in a
leaving: a
leaving: b
```

# Data

## Allocation with `new`

Go には `new`と`make`という 2 つのメモリ割り当てプリミティブがある。
`new`はメモリ割り当ての組み込み関数だが、他の言語にある同名の関数と違ってメモリの初期化は行わず、_ゼロ値にするだけ_。`new(T)`は`T`型の新しい要素のためにゼロ値のストレージを割り当て、そのアドレス(`*T`の値)を返す。Go の用語でいうと、新しく`T`型のゼロ値を割り当てられたポインタを返す。

`new`によって返されたメモリはゼロ値化されているので、データ設計するときに各型のゼロ値をさらに初期化する必要なしに使うことができる。データ構造を`new`で作成し、すぐに使うことができる。

```go
type SyncedBuffer struct {
    lock    sync.Mutex
    buffer  bytes.Buffer
}

p := new(SyncedBuffer)  // type *SyncedBuffer
var v SyncedBuffer      // type  SyncedBuffer
```

## Constructors and composite literals

ゼロ値では十分でコンストラクタの初期化が必要なときもある。

```go
func NewFile(fd int, name string) *File {
    if fd < 0 {
        return nil
    }
    f := new(File)
    f.fd = fd
    f.name = name
    f.dirinfo = nil
    f.nepipe = 0
    return f
}
```

上の例はめんどくさいので、*composite literal*で簡潔に書くことができる

```go
func NewFile(fd int, name string) *File {
    if fd < 0 {
        return nil
    }
    f := File{fd, name, nil, 0}
    return &f
}
```

ここでローカル変数のアドレスを返すのは問題ない。その変数に紐付いたストレージ関数が戻ったあとも生き残る。実際 composite literal は評価されるたびに新しいインスタンスを生成するので、最後の二行をまとめることができる。

```go
    return &File{fd, name, nil, 0}
```

composite literal のフィールドは順番どおりにすべて書かなければならない。しかし、**field `:` value**ペアーを使って明確に要素をラベリングされていれば、初期化の際のフィールドの順番は不動でも良く、ゼロ値化されるフィールドは省略できる。

```go
    return &File{fd: fd, name: name}
```

composite literal にフィールドがない場合、その型のゼロ値を生成する。`new(File)`と`&File{}`は等価。

Composite literal は配列、スライス、マップにも使えて、フィールドのラベルがインデックスやマップのキーに変わる。

```go
a := [...]string   {Enone: "no error", Eio: "Eio", Einval: "invalid argument"}
s := []string      {Enone: "no error", Eio: "Eio", Einval: "invalid argument"}
m := map[int]string{Enone: "no error", Eio: "Eio", Einval: "invalid argument"}
```

## Allocate with `make`

組み込み関数`make(T, args)`は`new(T)`と目的が違う。**スライス、マップ、チャネル**だけを生成し、**T 型(`*T`ではない)のゼロ値ではなく、初期化された値を返す**。この違いの理由は、これら 3 つの型は使用する前に初期化しなければならないデータ構造への参照だから。例えばスライスは、配列内のデータのポインタ、長さ、容量の 3 つで構成され、それらの要素が初期化されない限りそのスライスは`nil`になる。よってスライス、マップ、チャネルでは、`make`はその内部のデータ構造を初期化し、使用に備える。例えば、

```go
make([]int, 10, 100)
```

は数値要素 100 個を持つ配列を割り当て、その配列の最初の 10 要素を参照する長さ 10、容量 100 のデータ構造を生成する。（スライスを作るときは容量は省略できる。）。それに対して`new([]int)`は新規に割り当てられ、ゼロ値化されたスライス構造へのポインタを返す。スライスのゼロ値は`nil`。

`new`と`make`の違い

```go
var p *[]int = new([]int)       // allocates slice structure; *p == nil; rarely useful
var v  []int = make([]int, 100) // the slice v now refers to a new array of 100 ints

// Unnecessarily complex:
var p *[]int = new([]int)
*p = make([]int, 100, 100)

// Idiomatic:
v := make([]int, 100)
```

## Arrays

Go と C の配列の主な違いは

- 配列は値。配列の代入するとその要素はすべてコピーされる
- 配列を関数に渡すと、その配列のポインターではなく、コピーを受け取る。
- 配列のサイズは型の一部。`[10]int`と`[20]int`の型は互いに異なる。

配列のサイズが大きいときもある。配列のコピーを渡したくないときは明示的に配列へのポインタを渡す。

```go
func Sum(a *[3]float64) (sum float64) {
    for _, v := range *a {
        sum += v
    }
    return
}

array := [...]float64{7.0, 8.5, 9.1}
x := Sum(&array)  // Note the explicit address-of operator
```

ただし、このスタイルは慣用的な Go の書き方ではない。その代わりにスライスを使う。

## Slices

スライスは配列を内包し、より普遍的でパワフルで便利な連続データのインターフェイスを提供する。行列変換など明示的な次元を持つ要素を除いて、Go での殆どの配列プログラミングは、単なる配列ではなく、スライスを使用して行われる。

スライスは元になる配列への参照を保持し、そのスライスを他の変数に割り当てると、、両方とも同じスライスを参照することになる。関数がスライスの引数を受け取る場合、スライスの要素に加えた変更は、元になる配列へのポインタを渡すのと同じように、呼び出し元に表示される。そのため`Read`関数はポインタとカウントを受け取るのではなく、スライス引数を受け取る。スライスの長さが読み込むデータの上限を設定する。

```go
func (f *File) Read(buf []byte) (n int, err error)
```

このメソッドは読み込むバイト数と、エラーがあればエラーを返す。32 バイトよりも大きな`buf`の最初の 32 バイトを読み込む場合は、そのバッファーをスライスして渡す。

```go
    n, err := f.Read(buf[0:32])
```

こういうスライスの使い方は効率的。効率性はおいといて、次のコードもバッファの最初の 32 バイトを読み込む

```go
    var n int
    var err error
    for i := 0; i < 32; i++ {
        nbytes, e := f.Read(buf[i:i+1])  // Read one byte.
        n += nbytes
        if nbytes == 0 || e != nil {
            err = e
            break
        }
    }

```

ある配列の長さは、元の配列の範囲内である限りは変わる可能性がある。そのスライスに代入するだけ。組み込み関数`cap`によってアクセス可能な*容量*はそのスライスが推定する最大の長さをレポートする。これはスライスにデータを追加する関数。もしデータが容量(capacity)を超えた場合、スライスは再割り当てされ、その結果のスライスが返される。`len`と`cap`は`nil`のスライスにも適用可能で、0 を返す。

```go
func Append(slice, data []byte) []byte {
    l := len(slice)
    if l + len(data) > cap(slice) {  // reallocate
        // Allocate double what's needed, for future growth.
        newSlice := make([]byte, (l+len(data))*2)
        // The copy function is predeclared and works for any slice type.
        copy(newSlice, slice)
        slice = newSlice
    }
    slice = slice[0:l+len(data)]
    copy(slice[l:], data)
    return slice
}
```

関数の最後にそのスライスを返さなければならない。なぜなら`Append`は`slice`の要素を編集できるが、スライスそのもの（ポインタ、長さ、容量を保持するランタイムのデータ構造）が値によって渡されるから。

スライスのデータ追加は便利なので、組み込み関数が存在する。

## Two-dimensional slices

二次元配列を生成するには、配列の配列やスライスのスライスを定義する。

```go
type Transform [3][3]float64  // A 3x3 array, really an array of arrays.
type LinesOfText [][]byte     // A slice of byte slices.
```

スライスは可変長なので、インナースライスが互いに違う長さを持つことも可能。これは一般的に考えられるケースで、例えば文の行を表すとき、各行は互いに独立した長さを持つから。

```go
text := LinesOfText{
	[]byte("Now is the time"),
	[]byte("for all good gophers"),
	[]byte("to bring some fun to the party."),
}
```

2D スライスの割り当てが必要な場合もある。例えばピクセルの行ををスキャンして処理するとき。2 つの方法がある。一つは各スライスを別々に割り当てる場合、もう一つは単一の配列を割り当て、各スライスにその配列を参照させること。どちらが良いかはアプリケーションによる。もしスライスが伸びたり縮んだりするときは、各スライスを別々に割り当てる必要があるだろうし、そうでないなら、単一の割り当てで対象のデータを構築するほうが効率的だろう。次は 2 つのアプローチの例。

```go
// Allocate the top-level slice.
picture := make([][]uint8, YSize) // One row per unit of y.
// Loop over the rows, allocating the slice for each row.
for i := range picture {
	picture[i] = make([]uint8, XSize)
}
```

```go
// Allocate the top-level slice, the same as before.
picture := make([][]uint8, YSize) // One row per unit of y.
// Allocate one large slice to hold all the pixels.
pixels := make([]uint8, XSize*YSize) // Has type []uint8 even though picture is [][]uint8.
// Loop over the rows, slicing each row from the front of the remaining pixels slice.
for i := range picture {
	picture[i], pixels = pixels[:XSize], pixels[XSize:]
}
```

## Map

マップは組み込みデータ構造で、ある型の値（_key_）と、もう一つの型の値(*element*または*value*)を紐付ける。key は等式演算子が定義されている型ならば何でも良い。整数、浮動小数点数、文字列、ポインタ、インターフェイス（動的型が等式をサポートしているとき）ストラクト、配列が当てはまる。スライスに等式演算子が定義されていないので、key としては使えない。スライスと同様にマップは元のなるデータ構造を保持している。もし引数として渡されたマップを変更する関数にマップを渡すと、もととなるデータ構造にもその変更が適用される。

マップはコロンで区切られた key/value ペアを使った composite literal で生成されるので、初期化の段階でも簡単に作れる。

```go
var timeZone = map[string]int{
    "UTC":  0*60*60,
    "EST": -5*60*60,
    "CST": -6*60*60,
    "MST": -7*60*60,
    "PST": -8*60*60,
}
```

マップの値の代入や取得は配列やスライスと同じようにできる

```go
offset := timeZone["EST"]
```

存在しないキーに紐づく値を取得しようとするとゼロ値を返す。

ときには存在しないエントリーとただのゼロ値を区別しないと行けない時がある。それは`"UTC"`に対するエントリーなのか、それともマップに存在しないから 0 なのか？複数の代入で差別化できる。

```go
var seconds int
var ok bool
seconds, ok = timeZone[tz]
```

*コンマ OK*イディオムと呼ばれる。

```go
func offset(tz string) int {
    if seconds, ok := timeZone[tz]; ok {
        return seconds
    }
    log.Println("unknown time zone:", tz)
    return 0
}
```

実際の値を気にすることなく、マップ上の存在だけを検証したい場合は空識別子(`_`)を使う。

```go
_, present := timeZone[tz]
```

マップエントリーを削除するときは、組み込み関数`delete`を使う。キーが既に存在しない場合にも安全に処理できる。

```go
delete(timeZone, "PDT")  // Now on Standard Time
```

## Printing

Go のフォーマット出力は`fmt`パッケージ内に存在する。`fmt.Printf`、`fmt.Fprintf`、`fmt.Sprintf` など。文字列関数（`fmt.Sprintf`）はバッファーに出力するのではなく、文字列を返す。

`Printf`、`Fprintf`、`Sprintf`にたいして、`Print`や`Println`というペアの関数が存在する。これらはフォーマット文字列は受け取らず、各引数に対するデフォルトのフォーマットを生成する。`Println`は与えられた引数の間にスペースを追加し、出力を改行する。`Print`は隣り合う引数がどちらも文字列でない場合に限り空白を追加する。次のコードはいずれも同じ出力になる。

```go
fmt.Printf("Hello %d\n", 23)
fmt.Fprint(os.Stdout, "Hello ", 23, "\n")
fmt.Println("Hello", 23)
fmt.Println(fmt.Sprint("Hello ", 23))
```

フォーマット出力関数`fmt.Fprint`とその仲間たちは、`io.Writer`を実装するいかなるオブジェクトも第一引数として受け取る。たとえば`os.Stdout`、`os.Stderr`などが当てはまる。

`%d`のような数値書式は符号の有無や、サイズと言ったフラッグは指定しないかわりに、出力ルーティンが引数の型を使ってそれらの要素を決定する。

```go
var x uint64 = 1<<64 - 1
fmt.Printf("%d %x; %d %x\n", x, x, int64(x), int64(x)) // 引数で型が指定される
```

の出力は

```
18446744073709551615 ffffffffffffffff; -1 -1
```

整数の 10 進数など、デフォルトの変換だけが必要な場合は、キャッチオール形式％v（「値」の場合）を使用する
。結果は`Print`と`Println`と全く同じ結果になる。この形式を使ってどんな値も出力できる。配列、スライス、構造体、マップでさえも。タイムゾーンマップの出力では

```go
fmt.Printf("%v\n", timeZone)  // or just fmt.Println(timeZone)
```

の結果は

```
map[CST:-21600 EST:-18000 MST:-25200 PST:-28800 UTC:0]

```

マップに関しては、`Printf`やそれに類するものを使うと出力は key の辞書順にソートされる

構造体の出力時、`%+v`を使うとそのフィールド名をアノテートする。またすべての値に対して、`%#v`を使うと Go のフルの記法で記述された値が出力される。

```go
type T struct {
    a int
    b float64
    c string
}
t := &T{ 7, -2.35, "abc\tdef" }
fmt.Printf("%v\n", t)
fmt.Printf("%+v\n", t)
fmt.Printf("%#v\n", t)
fmt.Printf("%#v\n", timeZone)
```

結果は

```
&{7 -2.35 abc   def}
&{a:7 b:-2.35 c:abc     def}
&main.T{a:7, b:-2.35, c:"abc\tdef"}
map[string]int{"CST":-21600, "EST":-18000, "MST":-25200, "PST":-28800, "UTC":0}
```

その他`%q`引用文字列フォーマットは`string` と `[]byte`に使用できる。`%#q`はバッククオートで囲う。`%q`は整数やルーンにも使えて、シングルクオートで囲まれたルーン定数を生成する。`%x`は文字列、バイト配列、バイトスライス、整数に使えて、16 進数文字列を生成し、バイト間にスペースを入れる。

`%T`は値の型を出力する

```go
fmt.Printf("%T\n", timeZone)
```

```
map[string]int
```

カスタムの型に対するデフォルトのフォーマットを制御したい場合は、`String() string`というシグネチャのメソッドを定義すれば良い。次の例は型`T`に対するデフォルトフォーマットを設定する例

```go
func (t *T) String() string {
    return fmt.Sprintf("%d/%g/%q", t.a, t.b, t.c)
}
fmt.Printf("%v\n", t)
```

出力

```
7/-2.35/"abc\tdef"
```

`String`メソッドは`Sprintf`を呼ぶことができる、なぜなら出力ルーティンは再入可能でそのようにラップできるから。
ただし、`String`を`Stringf`がレシーバ文字列そのものを受けとるように構築しては行けない。無限呼び出しになるから。次のコードはその間違いの例

```go
type MyString string

func (m MyString) String() string {
    return fmt.Sprintf("MyString=%s", m) // Error: will recur forever.
}
```

引数に渡す文字列を基本的な文字列の型に変換して上げればこの問題は修正できる

```go
type MyString string
func (m MyString) String() string {
    return fmt.Sprintf("MyString=%s", string(m)) // OK: note conversion.
}
```

もう一つの出力に関するテクニックは、出力ルーティンに渡す引数を他のルーティンにわたす方法です。`Printf`のシグニチャは

# Append

append のシグニチャは*T*を型引数とした場合に、下のようになる

```go
func append(slice []T, elements ...T) []T
```

呼び出し元が`T`を決定するような関数を Go で書くことはできない。したがって`append`は組み込み関数になっていて、コンパイラの助けを借りる。

`append`はスライスの最後に要素を追加して、その結果を返す。元の配列が書き換わっている可能性があるので、その結果を返す必要がある。

```go
x := []int{1,2,3}
x = append(x, 4, 5, 6)
fmt.Println(x)
```

は、`[1 2 3 4 5 6]`を出力する。

スライスにスライスを追加したい場合はどうだろう？`...`を使えば良い。

```go
x := []int{1,2,3}
y := []int{4,5,6}
x = append(x, y...)
fmt.Println(x)
```

`...`がない場合、`y`は`int`型ではないのでコンパイルが失敗するだろう。

# Initialization

C や C++と大きな違いがないように見えるが、Go の初期化はより強力。初期化時に複雑な構造を構築できるし、オブジェクト間やパッケージ間のオーダー問題も正しく扱ってくれる。

## Constants

Go の定数はただの定数。関数のローカルスコープに定義された場合でもコンパイル時に生成され、その型は数値、キャラクター型（ルーン）、文字列、真偽値の型に限定される。コンパイル時の制限によって、それらを定義する式は、定数式にならなければならず、コンパイラによって評価される。例えば `1<<3`は定数式である一方、`math.Sin(math.Pi/4)`はそうではない。なぜなら`math.Sin`は実行時に起こらなければならないから。

Go では`iota`エミュレータによって列挙型定数が生成される。`iota`は式の一部となり、式は暗黙的に繰り返すことができるので、値のセットを用意することが簡単にできる。

```go
type ByteSize float64

const (
    _           = iota // ignore first value by assigning to blank identifier
    KB ByteSize = 1 << (10 * iota)
    MB
    GB
    TB
    PB
    EB
    ZB
    YB
)
```

`String`メソッドをユーザ定義型に実装することで任意の値が自分自身をフォーマットした形で出力できるようになる。多くの場合構造体に対して適用されるが、`BytyeSize`に代表される浮動小数点数のようなスカラ型にも有用である。

```go
func (b ByteSize) String() string {
    switch {
    case b >= YB:
        return fmt.Sprintf("%.2fYB", b/YB)
    case b >= ZB:
        return fmt.Sprintf("%.2fZB", b/ZB)
    case b >= EB:
        return fmt.Sprintf("%.2fEB", b/EB)
    case b >= PB:
        return fmt.Sprintf("%.2fPB", b/PB)
    case b >= TB:
        return fmt.Sprintf("%.2fTB", b/TB)
    case b >= GB:
        return fmt.Sprintf("%.2fGB", b/GB)
    case b >= MB:
        return fmt.Sprintf("%.2fMB", b/MB)
    case b >= KB:
        return fmt.Sprintf("%.2fKB", b/KB)
    }
    return fmt.Sprintf("%.2fB", b)
}
```

`ByteSize(1e13)`は`9.09TB`を出力するのに対し、上の例での式`YB`は`1.00YB`を出力する。

ここで`Sprintf`を使って`ByteSize`の`String`メソッドを実装するのが無限呼び出しを避けるという意味で安全です。それは変換ではなく、`Sprintf`を`%f`を使って呼び出しているから。`%f`は文字列フォーマットではない。`Stringf`は自文字列がほしいとき`String`を呼び出し、`%f`は浮動小数点数の値を要求する。（捕捉：前の例では`%s`つかたので無限呼び出し担っていた）

## Variables

変数は定数と同じように初期化されるが、初期化子は実行時に計算される。

```go
var (
    home   = os.Getenv("HOME")
    user   = os.Getenv("USER")
    gopath = os.Getenv("GOPATH")
)
```

# The init function

各ソースファイルは引数を取らない`init`関数を定義して、必要なステートを用意することができる。`init`はパッケージ内のすべての変数宣言が初期化された後に呼び出され、すべてのインポートされたパッケージが評された後に評価される。

初期化が宣言として表現される一方で、`init`の一般的なユースケースは実際の処理が実行される前に、正しさを検証、修復するために使われる。

```go
func init() {
    if user == "" {
        log.Fatal("$USER not set")
    }
    if home == "" {
        home = "/home/" + user
    }
    if gopath == "" {
        gopath = home + "/go"
    }
    // gopath may be overridden by --gopath flag on command line.
    flag.StringVar(&gopath, "gopath", gopath, "override default GOPATH")
}
```

# Method

## Pointers vs Values

`ByteSize`でみたようにメソッドは pointer や interface 以外の名前付き型に対して定義することができる。レシーバは構造体である必要はない。

スライスの議論の中で、`Append`関数を書いた。その代わりにスライスのメソッドとして定義することができる。そのためには、メソッドを紐付ける名前付き型を定義して、そのメソッドのレシーバをその型の値にする。

```go
type ByteSlice []byte

func (slice ByteSlice) Append(data []byte) []byte {
    // Body exactly the same as the Append function defined above.
}
```

このメソッドは変更後のスライスを返さなければならない。`ByteSlice`のポインタをレシーバにして再定義することで、その面倒くささを省くことができる。つまり、メソッドが呼び出し元のスライス自体を上書きできるのだ。

```go
func (p *ByteSlice) Append(data []byte) {
    slice := *p
    // Body as above, without the return.
    *p = slice
}
```

もっとうまくやることもできる。標準の`Write`メソッドのように修正すると以下のようになる。

```go
func (p *ByteSlice) Write(data []byte) (n int, err error) {
    slice := *p
    // Again as above.
    *p = slice
    return len(data), nil
}
```

すると`*ByteSlice`は標準インターフェイス`io.Writer`を満たす。

```go
    var b ByteSlice
    fmt.Fprintf(&b, "This hour has %d days\n", 7)
```

`ByteSlice`のアドレスを渡しているのは`*ByteSlice`だけが`io.Writer`を満たしているから。ポインタ vs 値どちらをレシーバに使うかのルールは、**値メソッドはポインタと値どちらに対しても呼び出せるが、ポインタメソッドはポインタからしか呼び出せない。**

このルールが存在するのは、ポインターメソッドはレシーバを修正することができるから。一方値に対してメソッドを呼び出すとき、メソッドは値のコピーを受け取るので、どんな変更も破棄される。もし値がアドレス可能な場合、アドレス演算子を自動的に挿入することで、値に対してポインタメソッドを呼び出すように処理する。例えば, `b`がアドレス可能な場合、その`Write`メソッドを`b.Write`として呼ぶことができ、コンパイラは自動的に`(&b).Write`に変換する。

# Inferfaces and other types

## Interface

Go のインターフェイスははオブジェクトの振る舞いを特定する方法を提供する。`String`メソッドによって、カスタムプリンタを実装できた。`Fprintf`は`Write`メソッドを実装するものに対して出力を生成することができる。一つか２つののメソッドしか持たないインターフェイスは Go では一般的で、通常メソッドの名前から名前が由来している。`Write`を実装する`io.Writer`など。

一つの型は複数のインターフェイスを実装することができる。例えば、`Len()`、`Less(i, j int) bool`、`Swap(i, j int)`を含む`sort.Inferface`を実装していれば、コレクションは`sort`パッケージのルーティンによってソートする事ができる。同様にカスタムフォーマッタも持つことができるだろう。以下の`Sequence`の例はどちらも満たす。

```go
type Sequence []int

// Methods required by sort.Interface.
func (s Sequence) Len() int {
    return len(s)
}
func (s Sequence) Less(i, j int) bool {
    return s[i] < s[j]
}
func (s Sequence) Swap(i, j int) {
    s[i], s[j] = s[j], s[i]
}

// Copy returns a copy of the Sequence.
func (s Sequence) Copy() Sequence {
    copy := make(Sequence, 0, len(s))
    return append(copy, s...)
}

// Method for printing - sorts the elements before printing.
func (s Sequence) String() string {
    s = s.Copy() // Make a copy; don't overwrite argument.
    sort.Sort(s)
    str := "["
    for i, elem := range s { // Loop is O(N²); will fix that in next example.
        if i > 0 {
            str += " "
        }
        str += fmt.Sprint(elem)
    }
    return str + "]"
}
```

# Conversions

`Sequence`の`String`メソッドは`Sprint`がスライスに対して行う仕事を再定義している。（しかも計算量 O(N²)でよろしくない）。`Sprint`を呼び出す前に`Sequence`を単純な`[]int`に変換できれば、その面倒な努力を減らすことができる。

```go
func (s Sequence) String() string {
    s = s.Copy()
    sort.Sort(s)
    return fmt.Sprint([]int(s))
}
```

このメソッドは、`String`メソッドから`Sprintf`を安全に呼ぶための変換のテニック。`Sequence`と`[]int`は型名以外は同じなので、名前を無視すれば、それらを変換するのは問題ない。変換は新しい値を生成せず、一時的に既存の値が新しい型を持つように振る舞う。（他にも、整数から浮動小数点数に変換するのも合法。この場合は新しい値を生成する）

Go では、違うメソッド群にアクセスするために型変換するのは慣用的である。例えば、`sort.IntSlice`を使って、上の例を reduce することができる。

```go
type Sequence []int

// Method for printing - sorts the elements before printing
func (s Sequence) String() string {
    s = s.Copy()
    sort.IntSlice(s).Sort()
    return fmt.Sprint([]int(s))
}
```

さて、`Sequence` が複数のインターフェイス（sort や print）を実装する代わりに、データを異なる型に変換して、一部の仕事をしている。

## Interface convertions and type assertions

型 switch は変換の一つの形である。あるインターフェイスを受け取り、switch のそれぞれの case の中である種の型変換を行っている。以下は`fmt.Printf`の中で、ある値を switch 文を使って文字列に変換している簡易的な例。もし既に文字列なら、そのインターフェイスが保持している実際の文字列の値を使い、一方で`String`メソッドを持っていたら、そのメソッドを呼び出した結果を使う。

```go
type Stringer interface {
    String() string
}

var value interface{} // Value provided by caller.
switch str := value.(type) {
case string:
    return str
case Stringer:
    return str.String()
}
```

はじめのケースでは具体的な値を見つけ、２つ目のケースではインターフェイスを違うインターフェイスに変換している。型をこのように混合することは何も問題ない。

もし一つの型しか扱わない場合は？もし、その値が`string`を持ち、ただそれを抽出したかったら？case が一つだけの switch 文でもいいだろうが、*型アサーション*も同じことができる。型アサーションはインターフェイスの値をとり、指定された型の値を取り出す。シンタックスは swich 文の句を拝借しているが、`type`キーワードではなく明確な型で読んでいる。

```go
value.(typeName)
```

その結果は、`typeName`で指定された静的な型の新しい値になる。その型はインターフェイスで保持された具体的な型か、変換可能な二次的なインターフェイス型のどちらかでなければならない。前述の value の文字列を取り出したいときは次のように書く。

```go
str := value.(string)
```

もし文字列が含まれない場合、プログラムは実行エラーでクラッシュする。それをガードするために、"comma, ok"慣用句で値が文字列がどうかを安全に検証できる。

```go
str, ok := value.(string)
if ok {
    fmt.Printf("string value is: %q\n", str)
} else {
    fmt.Printf("value is not a string\n")
}
```

もし型アサーションが失敗しても、`str`はゼロ値（空文字）として存在し続ける。

このセクションの最初の switch 文を型アサーションと`if-else`文を使って書くこともできる。

```go
if str, ok := value.(string); ok {
    return str
} else if str, ok := value.(Stringer); ok {
    return str.String()
}
```

# Generality

あるインターフェイスを実装するためだけに型が存在し、そのインターフェイス外にエクスポートされるメソッドを持たない場合、その型をエクスポートする必要はない。その型をエクスポートしても、インターフェイスが描く振る舞い以上に有用なものがないことを証明する。共通メソッドの各例のドキュメントを繰り返す必要性もない。

その場合、コンストラクタは型を実装するよりも、インターフェイスの値を返すべきだ。例えば、ハッシュライブラリ`crc32.NewIEEE`と`adler32.New`はどちらもインターフェイス型`hash.Hash32`を返す。Go で adler32 を CRC-32 アルゴリズムに置き換えるには、コンストラクタの呼び出しを変更するだけで良い。

# Interface and methods

何にでもメソッドを付加することができるので、あらゆるものがインターフェイスを満たすことが可能。例えば`http`パッケージは`Handler`インターフェイスを定義している。`Handler`を実装しているあらゆるオブジェクトは HTTP リクエストをサーブすることができる。

```go
type Handler interface {
    ServeHTTP(ResponseWriter, *Request)
}
```

`ResponseWriter`自身はクライアントにレスポンスを返すメソッドへのアクセスを提供するインターフェイス。標準の`Write`を含んでおり、`http.ResponseWriter`は`io.Writer`が使える場所であればどこでも使うことができる。`Request`はパースされたクライアントからのリクエストをを内包した構造体。

簡潔性のために、POST を無視して、HTTP のリクエストは常に GET であると仮定しよう。以下が、ページを訪れた回数をカウントするハンドラの実装。

```go
// Simple counter server.
type Counter struct {
    n int
}

func (ctr *Counter) ServeHTTP(w http.ResponseWriter, req *http.Request) {
    ctr.n++
    fmt.Fprintf(w, "counter = %d\n", ctr.n)
}
```

実際のサーバーでは、`ctr.n`へのアクセスは並行アクセスから保護されていなければならない。`sync`と`atomic`パッケージをチェックしてね。

参考として、以下がサーバーを URL ツリーのノードに紐付ける例。

```go
import "net/http"
...
ctr := new(Counter)
http.Handle("/counter", ctr)
```

もっというと`Counter`の構造体を作る必要もない。整数値さえあれば良い。（その場合はレシーバをポインタにして、加算が呼び出し元に分かるようにする必要がある）

```go
// Simpler counter server.
type Counter int

func (ctr *Counter) ServeHTTP(w http.ResponseWriter, req *http.Request) {
    *ctr++
    fmt.Fprintf(w, "counter = %d\n", *ctr)
}

```

プログラムが
ページに訪問されたかを通知する内部ステートをを保つ場合は？チャネルをウェブページに紐付ける。

```go
// A channel that sends a notification on each visit.
// (Probably want the channel to be buffered.)
type Chan chan *http.Request

func (ch Chan) ServeHTTP(w http.ResponseWriter, req *http.Request) {
    ch <- req
    fmt.Fprint(w, "notification sent")
}
```

最後に、サーバーのバイナリを呼ぶときに使われる引数を`/args`に表示したいとき。その出力関数は簡単に書くことができる。

```go
func ArgServer() {
    fmt.Println(os.Args)
}
```

それを HTTP サーバーにするにはどうすればいいか？`ArgServer`をある型のメソッドにしてその値を無視すればいいが、もっときれいな方法がある。ポインタとインターフェイス以外の方にはメソッドを定義できるので、関数に対するメソッドを書くけば良い。`http`パッケージは次のコードを含んでいる。

```go
// The HandlerFunc type is an adapter to allow the use of
// ordinary functions as HTTP handlers.  If f is a function
// with the appropriate signature, HandlerFunc(f) is a
// Handler object that calls f.
type HandlerFunc func(ResponseWriter, *Request)

// ServeHTTP calls f(w, req).
func (f HandlerFunc) ServeHTTP(w ResponseWriter, req *Request) {
    f(w, req)
}
```

`Handlerfunc`は`ServeHTTP`というメソッドを持つ型で、その型の値は HTTP リクエストを serve することができる。実装を見てみると、レシーバは関数`f`で、メソッドは`f`を呼んでいる。奇妙に見えるかもしれないが、レシーバがチャネルとなり、メソッドがそのチャネルに送信することそう違いはない。

`ArgServer`を HTTP サーバーにするためにはまず正しいシグネチャを持つように修正する。

```go
func ArgServer(w http.ResponseWriter, req *http.Request) {
    fmt.Fprintln(w, os.Args)
}
```

`ArgServer`は`HandleFunc`と同じシグネチャとなり、`Sequence`を`IntSlice`に変換して`IntSlice.Sort`にアクセスしたように、その型に変換してそのメソッドにアクセスできるようになる。

```go
http.Handle("/args", http.HandlerFunc(ArgServer))
```

誰かが`/args`のページを訪問したとき、そのページにインスールされたハンドラは`ArgServer`の値と`HandlerFunc`の型を持つ。HTTP サーバーは`ArgServer`をレシーバとして、その型のメソッド`ServeHTTP`を呼び、次に`ArgServer`を呼び出す。（`HandlerFunc.ServeHTTP`内部にある`f(w, req)`の呼び出しを経由して）。そして引数が表示される。

このセクションでは構造体、整数、チャネル、関数から HTTP サーバーを作成した。インターフェイスはメソッドのセットでしかなく、ほぼすべての方に対して定義できるのだ。

# The blank identifier

`for range`や`map`の文脈で空識別子について言及した。空識別子は任意の方に対して代入または宣言することができ、害なく値を捨てることができる。これは Unix に`/dev/nul`file を書くのに似ていて、変数が必要だが、実際の値が無県警のときに、プレースホルダーとして使用される書き込み専用の値を表している。今まで見てきた以上の使い方がある。

## The blank identifier in multiple assignment

左辺に複数の値の代入が必要だが、一方の値がプログラムで使われないとき、空識別子を代入の左辺に使うことで、ダミーの変数を生成してその値が捨てられることを明確にする必要がなくなる。例えば関数が値とエラーを返し、エラーだけが重要な場合、空識別子を使って関係のない値を捨てることができる。

```go
if _, err := os.Stat(path); os.IsNotExist(err) {
	fmt.Printf("%s does not exist\n", path)
}
```

良くない例だが、エラーを無視することもできる。いつもエラーはチェックしようね。

```go
// Bad! This code will crash if path does not exist.
fi, _ := os.Stat(path)
if fi.IsDir() {
    fmt.Printf("%s is a directory\n", path)
}
```

## Unused imports and variables

使わないパッケージをインポートしたり、変数を宣言するのはエラーになる。使わないインポートはプログラムを膨張させコンパイルを遅くするし、初期化されても使わない変数は、計算の無駄遣いだし大きなバグの起因となりえる。しかしプログラムがアクティブに開発されているとき、不使用のインポートや変数はよく発生するし、コンパイルを成功させるためだけにいちいち削除して、後からまた必要に書き直すのはストレスだ。空識別子はそのためのワークアラウンドを与えてくれる。

書きかけのプログラムに 2 つの不使用のインポート(`fmt`と`io`)と一つの不使用の変数(`fd`)があるとき、コンパイルは通らないが、その時点でコードが正しいかを確認したい。

```go
package main

import (
    "fmt"
    "io"
    "log"
    "os"
)

func main() {
    fd, err := os.Open("test.go")
    if err != nil {
        log.Fatal(err)
    }
    // TODO: use fd.
}
```

その時は、不使用のインポートや変数に空識別子を使えばコンパイルを通すことができる。

```go
package main

import (
    "fmt"
    "io"
    "log"
    "os"
)

var _ = fmt.Printf // For debugging; delete when done.
var _ io.Reader    // For debugging; delete when done.

func main() {
    fd, err := os.Open("test.go")
    if err != nil {
        log.Fatal(err)
    }
    // TODO: use fd.
    _ = fd
}
```

慣用的には、インポートエラーを黙らせるためのグローバル宣言はインポート文の直後にコメント付きで書く。そうすると見つけやすく、消すためのリマインダーとなる。

## Import for side effect

先の例では、インポートされたものは最終的には使われるか、削除される。Work in Progress として扱われる。しかし、時には使うことなくパッケージの副作用のためだけにインポートすることが役立つことがある。例えば`init`関数の中では、`net/http/pprof`パッケージがデバッグ情報を提供する HTTP ハンドラーを登録している。 エクスポートされた API はあるが、殆どのクライアントがハンドラの登録とウェブページを通したデータへのアクセスだけが必要。

```go
import _ "net/http/pprof"
```

こう書くことで、副作用のためだけに副作用のためだけにインポートされているということを明示できる。

## Interface checks

ある型はあるインターフェイスのメソッドを実装することでそのインターフェイスを実装する。インターフェイスの変換は静的なので、コンパイル時にチェックされる。例えば`*os.File`が`io.Reader`インターフェイスを実装していない限り、`io.Reader`を期待する関数に`*os.File`を渡すとコンパイルエラーになる。

しかしいくつかのインターフェイスチェックは実行時に発生する。一つの例は`encoding/json`パッケージ。これは`Marshaler`インターフェイスを定義している。JSON エンコードがインターフェイスを実装する値を受け取ったとき、エンコーダがその値のマーシャリングメソッドを呼び出し、通常の変換の代わりにその値を JSON に変換する。エンコーダはそのプロパティを型アサーションによって実行時にチェックする。

```go
m, ok := val.(json.Marshaler)
```

もし、インターフェイスは実際には使わず、インターフェイスを実装しているかドウかを問いたいときには、エラーチェックの一部として、アサートされた型を無視するために空識別子を使う。

```go
if _, ok := val.(json.Marshaler); ok {
    fmt.Printf("value %v of type %T implements json.Marshaler\n", val, val)
}
```

# Embedding

Go は型駆動のサブクラス化を提供しておらず、構造体やインターフェイス内に型を*埋め込み*ことによって実装の一部を借用することができる。

インターフェイスの埋め込みは非常にシンプル。

```go
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}
```

`io`パッケージはこのようなメソッドを実装できるオブジェクトを指定できる他のインターフェイスもエクスポートしている。例えば`io.ReadWriter`は`Read`と`Write`どちらも含むインターフェイスである。それら 2 つのメソッドを明示的にリストすることでも`io.Reader`を指定できるが、2 つのインターフェイスを組み込んだ新しいインターフェイスを生成するほうが、簡単でわかりやすい。

```go
// ReadWriter is the interface that combines the Reader and Writer interfaces.
type ReadWriter interface {
    Reader
    Writer
}
```

上のコードは、`ReadWriter`は`Reader`と`Writer`がすることをできる。埋め込みインターフェイスの結合である。インターフェイスに組み込めるのはインターフェイスだけである。

構造体にも同じ考えが適用でいるが、より広範囲である。`bufio`パッケージは 2 つの構造体型`bufio.Reader`、`bufio.Writer`を持っている。いずれも`io`パッケージと同類のインターフェイスを実装している。`bufio`はバッファリングされた読み込み/書き出しを実装している。それは埋め込みを使って reader と writer を一つの構造体に組み合わせていることで実現している。型をリストしているがフィールド名は与えていない。

```go
// ReadWriter stores pointers to a Reader and a Writer.
// It implements io.ReadWriter.
type ReadWriter struct {
    *Reader  // *bufio.Reader
    *Writer  // *bufio.Writer
}
```

組み込まれた要素は構造体へのポインタとなっており、使われる前に正しい構造体へのポイントに初期化されないといけない。`ReadWriter`構造体は次のようにも書ける。

```go
type ReadWriter struct {
    reader *Reader
    writer *Writer
}
```

ただし、フィールドのメソッドが`io`インターフェイスを満たすにはメソッドの転送も提供しなければならない。

```go
func (rw *ReadWriter) Read(p []byte) (n int, err error) {
    return rw.reader.Read(p)
}
```

構造体をフィールド名なしに直接埋め込みことで、この問題を避けることができる。埋め込み型のメソッドがタダで付いてくるので、`bufio.ReadWriter`は`bufio.Reader`と`bufio.Writer`のメソッドを持つだけでないく、`io.Reader`、`io.Writer`、`io.ReadWriter`の 3 つのインターフェイスを満たすことができる。

埋め込みはサブクラス化と違う重要な点がある。型を埋め込むとき、その型のメソッドは外側の型メソッドとなる。しかしそのメソッドが呼ばれるとき、レシーバーは外側でなく内側の型になる。上の例でいうと、`bufio.ReadWriter`の`Read`が呼ばれたとき、転送メソッドと全く同じ効果があるが、レシーバは`ReadWriter`ではなく、`ReadWriter`の`reader`フィールドとなる。

通常の名前付きフィールドと埋め込みフィールドを組み合わせることもできる

```go
type Job struct {
    Command string
    *log.Logger
}
```

`Job`型は`Print`、`Printf`、`Println`や`*log.Logger`が持つその他のメソッドを持つようになる。`Logger`にフィールド名を与えることもできるが、必要ない。一度初期化されると、`Job`にログする事ができる。

```go
job.Println("starting now...")
```

`Job`構造体の`Logger`は通常のフィールドなので、`Job`のコンストラクタの中で普通に初期化することができる。

```go
func NewJob(command string, logger *log.Logger) *Job {
    return &Job{command, logger}
}
```

もしくはコンポジットリテラルで次のようにも書ける。

```go
job := &Job{command, log.New(os.Stderr, "Job: ", log.Ldate)}
```

埋め込みフィールドを直接参照する必要がある場合、`ReadWriter`構造体の Read メソッドのようにパッケージ名を無視したフィールドのタイプ名がフィールド名となる。変数`job`の`Job`型の型の`*log.Logger`にアクセスする場合、`job.Logger`と書く。これは`Logger`のメソッドを改良したいときに役立つ。

```go
func (job *Job) Printf(format string, args ...interface{}) {
    job.Logger.Printf("%q: %s", job.Command, fmt.Sprintf(format, args...))
}
```

埋込み型は名前の衝突問題は引き起こすが、解決ルールはシンプルである。まず、フィールドまたはメソッド`X`はより深くネストされた`X`を隠す。`log.Logger`が`Command`というフィールドまたはメソッドを保つ場合、`Command`フィールドは`Job`型の`Command`フィールドが支配する。

2 つ目に、同じネストレベルで同じ名前が発生した場合、エラーとなる。`Job`構造体に`Logger`という別のフィールドまたはメソッドが含まれている場合、`log.Logger`を埋め込むのは誤り。しかし、重複した名前が定義以外のプログラム上で呼ばれなければ問題ない。埋込み型の変更を外側から保護する事ができる。

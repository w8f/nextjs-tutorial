# Next.js 学習メモ

Next.js に入門してみた。
備忘録として README.md に残してみた。

## <a id="index" href="#index">目次</a>

- [Why Next.js](#section1)
- [環境構築](#section2)
- [ルーティング](#section3)
- [Asset, Metadata, CSS](#section4)

## <a id="section1" href="#section1"> Why Next.js </a>

- SEO に強い SPA 開発
- パフォーマンスを効率化する仕組み
- ルーティングが楽
- API の作成がかんたん（プロジェクトの中でバックエンドの API を作れる）
- TypeScript を簡単に導入できる

---

## <a id="section2" href="#section2"> 環境構築</a>

### Next.js で環境構築するメリット

- Babel+Webpack の複雑な環境設定が不要
- Code Splitting のような最適化設定が不要
- パフォーマンスや SEO のための Pre-render 設定が不要
- Rendering のタイミングを選択できる
  - SSR 　レンダリングをサーバ側でしたり
  - SSG 　静的サイトジェネレーション
- サーバーサイドの処理を簡単に実装できる

### 手順

1. Node.js をインストールする。(ver.10.13 以降)
2. 下記コマンドを実行

```sh
npx create-next-app
```

---

## <a id="section3" href="#section3"> ルーティング </a>

pages ディレクトリで管理

```sh
ex)
pages/index.js → /
pages/posts/first_post.js → posts/first_post
```

**Client-Side Navigation とは？**

> クライアントサイド・ナビゲーションとは、JavaScript を使用してページの遷移を行うことで、\
> ブラウザが行うデフォルトのナビゲーションよりも高速に行うことができます。
>
> \<a>タグなどで遷移 → ページがすべて再読み込みされる
>
> \<Link>タグを利用することで、Production モードの際に、Link タグの JS を Prefetch されるので、\
> 表示の高速化につなげることができる。

className などの属性を追加する必要がある場合は、\
Link タグではなく、a タグに追加する。\
※Link タグの下に入れ子で a タグを利用する。

---

## <a id="section4" href="#section4">Asset, Metadata, CSS </a>

- 画像などの静的データは、public ディレクトリに配置する。

- \<img>タグではなく、\<Image>タグを使うといい感じに Next.js 側で調整してくれる。

  - リサイズ、最適化、および WebP などの最新フォーマットでの画像提供が可能に
    - ビューポートが小さいデバイスに大きな画像を配信することがなくなります
    - CMS などの外部データソースでホストされている場合でも、最適化してくれる。

- Next.js は、ビルド時に画像を最適化するのではなく、\
  ユーザーからのリクエストに応じてオンデマンドで画像を最適化する。

### 画像

```js
import Image from "next/image";
// next.jsが用意しているImageタグを使う
// Imageタグのsrc属性には絶対パスを記載する。
// Publicに保持している画像を表示したい場合は下記のように指定。

const image = () => {
  return (
    <>
      <Image
        priority
        src="/sauna_boy.png"
        className={utilStyles.borderCircle}
        height={144}
        width={144}
        alt={name}
      />
    </>
  );
};
```

### Metadata

```js
import Head from "next/head";
// next.jsが用意しているHeadタグを使う
const head = () => {
  return (
    <>
      <Head>
        <title>First Post</title>
      </Head>
    </>
  );
};
```

### CSS

```js
/**
 styled-jsxを利用して
 React Component内でCSSを書きたい時
 CSS-in-JSライブラリによって記法はいろいろあるっぽい。
 */

<style jsx>{`
  …
`}</style>
```

CSS Modules を利用してコンポーネント単位で CSS を 適用する方法

① CSS ファイルを用意する。

```css
.container {
  max-width: 36rem;
  padding: 0 1rem;
  margin: 3rem auto 6rem;
}
```

② style を適用したいコンポーネント内で css ファイルを Import し、className に記載する

```js
import styles from "./layout.module.css";

export default function Layout({ children }) {
  return <div className={styles.container}>{children}</div>;
}
```

> ブラウザ上でレンダリングされるときは、CSS Module がユニークなクラス名を生成するので、\
> CSS Module を利用している限りは、クラス名が衝突することはない。

### Global に CSS を適用したい時

グローバル CSS ファイルを読み込むために、pages/\_app.js というファイルを以下の内容で作成。

```js
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
```

- App コンポーネントは Top レベル
- グローバル CSS ファイルは、どこに置いても、どんな名前を使ってもよい
- 公式チュートリアルでは Top レベルに style ディレクトリを切り、そこに global.css を定義。\
  その css を pages/\_app.js に import することでグローバルに CSS を適用していた。

- css の tips(公式) \
  <https://nextjs.org/learn/basics/assets-metadata-css/styling-tips>

---

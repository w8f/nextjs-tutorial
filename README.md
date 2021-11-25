# Next.js 学習メモ

Next.js に入門してみた。
備忘録として README.md に残してみた。

## <a id="index" href="#index">目次</a>

- [Why Next.js](#section1)
- [環境構築](#section2)
- [ルーティング](#section3)
- [Asset, Metadata, CSS](#section4)
- [Pre-rendering and Data Fetching](#section5)
  - [SSG](#section6)
  - [Server-side Rendering](#section7)
  - [Client Side Rendering](#section8)
- [Dynamic Routes](#section9)
- [API Routes](#section10)

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

※チュートリアルで使用したライブラリのインストール

```sh
# markdownのパースに必要
npm install gray-matter
# markdownのレンダリングに必要
npm install remark remark-html
# 日付のフォーマットに必要
npm install date-fns

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

## <a id="section5" href="#section5">Pre-rendering and Data Fetching</a>

Next.js  は基本的に、全てのページを**プリレンダリング**する。

> Next.js は、クライアントサイドの JavaScript ですべてを処理するのではなく、\
> 各ページの HTML を事前に生成します。プリレンダリングを行うことで、パフォーマンスや SEO の向上につながります。

**プリレンダリング**の形式は 2 つある。\
具体的には HTML の生成されるタイミングが異なる。\
また、ページごとにレンダリングの方法を指定できる。

- SSG(Static Generation)　(※Next.js 公式は SSG を推奨している)

  > ビルド時に HTML を生成するプリレンダリング方式です。\
  > プリレンダリングされた HTML は、各リクエストで再利用されます。\
  > ページを一度作成して CDN で配信することで、リクエストごとにサーバーがページをレンダリングするよりもはるかに高速になる ◎

- SSR(Server-side Rendering)
  > サーバーサイドレンダリングは、リクエストごとに HTML を生成するプリレンダリング方式です。

### プリレンダリングの使い分け

ユーザーがリクエストする前に、このページを事前にレンダリングすることができるかどうか。\
→ 事前にレンダリングできる場合は、SSG がよい。\
頻繁に更新されるデータを表示するページでは、リクエストのたびにページの内容が変わる。\
→ Server-side Rendering 　を選択する。

## <a id="section6" href="#section6">SSG</a>

### getStaticProps

ビルド時にデータを fetch する必要がある場合
→ **getStaticProps** 関数を使用する。\
**getStaticProps** 関数内でデータを fetch して Props としてデータを渡すことができる。\
(ex, file system, api, DB...)

```js
import { getSortedPostsData } from "../lib/posts";

// getStaticPropsは、サーバー側で実行される関数
// = ブラウザ側に渡すこと無く、DBのクエリなども発行できちゃう。
// getStaticPropsは、pagesディレクトリのページでのみ使用可能
export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

export default function Home({ allPostsData }) {
  return (
    <div>
      // 描画内容
    </div>
  )

```

> 注：Next.js は、クライアントとサーバーの両方で fetch()を実装しています。\
> インポートする必要はありません。

## <a id="section7" href="#section7">Server-side Rendering</a>

> Server-side Rendering を使用するには、ページから getStaticProps ではなく\
> **getServerSideProps** をエクスポートする必要があります。

```js
// request時にデータを取得する必要がある場合のみ使用する。
export async function getServerSideProps(context) {
  return {
    props: {
      // props for your component
    },
  };
}
```

## <a id="section8" href="#section8">Client Side Rendering</a>

プリレンダリングする必要がそもそもない場合は Client Side Rendering を選択することもできる。

外部データを必要としないページのロード → クライアント側からデータを取得する。\
（ユーザのダッシュボード画面等頻繁に更新されるページ、SEO の対策が必要でない場合など）

Client Side Rendering を使用してデータを取得する場合は、\
**SWR** と言われる React hooks を使用するのが推奨されている。

```js
// 使用例
import useSWR from "swr";

function Profile() {
  const { data, error } = useSWR("/api/user", fetch);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return <div>hello {data.name}!</div>;
}
```

---

## <a id="section9" href="#section9">Dynamic Routes</a>

動的ルーティングで、静的ページを生成する方法

/posts/\<id>として、id ごとに 動的に静的ページを生成したい時\
**getStaticPaths** という非同期関数をエクスポートします。この関数では、id に指定できる値のリストを返す。

```js
// id に指定できる値のリストの例
// 文字列のリストではなく、オブジェクトの配列を返却しなければならない。
// 各オブジェクトは、params キーを持ち、id キーを持つオブジェクトを含んでいなければなりません\
//（ファイル名に[id]を使用しているため）。

[
  {
    params: {
      id: "ssg-ssr",
    },
  },
  {
    params: {
      id: "pre-rendering",
    },
  },
];
```

流れとしては、

1. /posts/[id].js 内に、**getStaticPaths**関数を定義し、 id の配列 を返却する
2. /posts/[id].js 内に、**getStaticProps**関数を定義し、id に紐づくデータを取得する。
3. 2 で取得したデータを Props として渡す。

```js
export async function getAllPostIds() {
  // Instead of the file system,
  // fetch post data from an external API endpoint
  const res = await fetch('..')
  const posts = await res.json()
  return posts.map(post => {
    return {
      params: {
        id: post.id
      }
    }
  })
}
```

### **getStaticPaths**関数のreturnに含まれるfallbackオプションについて

```js
export async function getStaticPaths() {
  // Return a list of possible value for id
  const paths = getAllPostsIds();
  return {
    paths,
    fallback: false,
  };
}
```

- fallback: falseの場合、
  > getStaticPathで生成されたパス以外を指定された場合に404のページを返却する。
- fallback: trueの場合、
  > getStaticPathで生成されたパス以外を指定された場合に404のページを返却しない。
- fallback: blockingの場合、
  > 新しいパスはサーバーサイドでgetStaticPropsを使ってレンダリングされ、\
  > 将来のリクエストに備えてキャッシュされるため、パスの生成は1回のみ実行される

### Dynamic Routeの拡張について

[連想配列].jsとして、getStaticPathsのパスの指定を下記のようにすることで、\
階層をより深くした動的パスのルーティングが生成ができる。

```js
// pages/posts/[...id].js matches /posts/a,
// but also /posts/a/b, /posts/a/b/c and so on.
return [
  {
    params: {
      // Statically Generates /posts/a/b/c
      id: ['a', 'b', 'c']
    }
  }
  //...
]
```

### Error Pageのカスタム

<https://nextjs.org/docs/advanced-features/custom-error-page>

```js
// pages/404.jsを作成し、Custom404()関数内に表示したい内容を返却する。
export default function Custom404() {
  return <h1>404 - Page Not Found</h1>
}

// ※500エラーの時なども同様
```

---

## <a id="section10" href="#section10">API Routes</a>

- APIエンドポイントをNode.jsのサーバーレス関数として作成できる。

### API Routes 作成手順

1. pagesディレクトリ配下にapiディレクトリ作成
2. apiディレクトリ配下にhoge.jsファイルを作成
3. 下記の用な感じでhandlerを定義してあげる

```js
  // pages/hoge.js
  export default function handler(req, res) {
    res.status(200).json({ text: "Hello" });
  }
```

<http://localhost:3000/api/hoge>にアクセスすると上記のAPIが叩かれる

※ API Routes配下では、getStaticProps or getStaticPathsは使用するべきではない。\
→サーバサイドで実行されるべきコード、ブラウザ側に渡したくないコード(DBのクエリ投げたり等)は、\
getStaticProps or getStaticPathsを使用する。

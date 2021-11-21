import Link from "next/link";
import Head from "next/head";
import Layout from "../../components/layout";

export default function FirstPost() {
  return (
    <Layout>
      <Head>
        <title>First Post</title>
      </Head>
      <h1>First Post</h1>
      <h2>
        {/*
          Client-Side Navigation
          クライアントサイド・ナビゲーションとは、JavaScriptを使用してページの遷移を行うことで、
          ブラウザが行うデフォルトのナビゲーションよりも高速に行うことができます。

          <a>タグなどで遷移→ページがすべて再読み込みされる
          <Link>タグを利用することで、Productionモードの際に、LinkタグのJSをPrefetchされるので、
          表示の高速化につなげることができる。

          classNameなどの属性を追加する必要がある場合は、Linkタグではなく、aタグに追加する
          ※Linkタグの下に入れ子でaタグを利用する。
        */}
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </h2>
    </Layout>
  );
}

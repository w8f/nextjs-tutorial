# Next.js 学習メモ

Next.js に入門してみた。
備忘録として README.md に残してみた。

## Why Next.js

- SEO に強い SPA 開発
- パフォーマンスを効率化する仕組み
- ルーティングが楽
- API の作成がかんたん（プロジェクトの中でバックエンドの API を作れる）
- TypeScript を簡単に導入できる

## 環境構築

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

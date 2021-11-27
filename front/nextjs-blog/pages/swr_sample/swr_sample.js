/**
 * swr sample page
 */

import useSwr from "swr";

// JSON データを使用する通常の RESTful API の場合、
// まずネイティブの fetch をラップした fetcher 関数を作成する必要があります：
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const swr_sample = () => {
  // dataとerrの変数から、リクエストの状態に応じたUIを返却できる。
  const { data, err } = useSwr("/api/hello", fetcher);
  if (err) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return (
    <div>
      <h1>swr sample page</h1>
      <p>{data.text}</p>
    </div>
  );
};

export default swr_sample;

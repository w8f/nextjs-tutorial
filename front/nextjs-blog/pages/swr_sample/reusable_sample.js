/**
 * 再利用可能なデータフックの作成。
 * データフックを作成してしまえば、そのデータフックを呼び出すことで、
 * 状態などをpropsなどで渡す必要がなくなる。
 */

import useSwr from "swr";

const fetcher = (...arg) => fetch(...arg).then((res) => res.json());
const reusable_sample = () => {
  const { user, isLoading, isErr } = useUser(1);

  if (isLoading) {
    return <p>取得中</p>;
  }

  if (isErr) {
    return <p>取得中</p>;
  }
  return (
    <>
      <title>再利用の用例</title>
      <ul>
        <li>{user.name}</li>
        <li>{user.age}</li>
      </ul>
    </>
  );
};

// ユーザ情報を取得するデータフックの作成
const useUser = (id) => {
  const { data, err } = useSwr(`/api/user/${id}`, fetcher);

  return {
    user: data,
    isLoading: !data && !err,
    isErr: err,
  };
};

export default reusable_sample;

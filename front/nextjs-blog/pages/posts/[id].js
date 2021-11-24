import Head from "next/head";
import Layout from "../../components/layout";
import { getAllPostsIds, getPostData } from "..//../lib/posts";
import Date from "../../components/date";
import utilStyles from "../../styles/utils.module.css";

export async function getStaticPaths() {
  // Return a list of possible value for id
  const paths = getAllPostsIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}

export default function Post({ postData }) {
  return (
    <Layout>
      <Head>{postData.title}</Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        {/*
            React上でHTMLを埋め込むする時に使用する
            XSSの危険があるため、サニタイズするか必要でない場合は使用を控える
            @see https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml
        */}
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
}

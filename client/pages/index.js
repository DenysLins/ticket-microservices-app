import Head from "next/head";
import styles from "../styles/Home.module.css";
import axiosBuilder from "../utils/axios-builder";

const Home = ({ currentUser }) => {
  console.log(currentUser);
  return (
    <div className={styles.container}>
      <Head>
        <title>Ticketing</title>
        <meta name="description" content="Ticketing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.grid}>
          {currentUser ? (
            <h1> You are sign in</h1>
          ) : (
            <h1>You are not sign in </h1>
          )}
        </div>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const axios = axiosBuilder(context);
  const { data } = await axios.get("/api/users/currentuser").catch((err) => {
    console.log(err.message);
  });

  return {
    props: data,
  };
};

export default Home;

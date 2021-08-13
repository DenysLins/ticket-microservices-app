import Head from "next/head";
import axios from "axios";
import styles from "../styles/Home.module.css";

const Home = ({ currentUser }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Ticketing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.grid}>
          <h1>Welcome!</h1>
        </div>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
};

Home.getInitialProps = async () => {
  const response = await axios
    .get(
      `http://${process.env.AUTH_URL}:${process.env.AUTH_PORT}/api/users/currentuser`
    )
    .catch((err) => {
      console.log(err.message);
    });
  return response.data;
};

export default Home;

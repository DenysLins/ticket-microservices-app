import axiosBuilder from "../utils/axios-builder";
import styles from "../styles/Home.module.css";

const Home = ({ currentUser }) => {
  return (
    <div className={styles.container}>
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

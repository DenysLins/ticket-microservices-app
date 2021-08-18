import Head from "next/head";
import Header from "../components/header";
import "bootstrap/dist/css/bootstrap.css";
import axiosBuilder from "../utils/axios-builder";
import "../styles/globals.css";

const AppComponent = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Ticketing</title>
        <meta name="description" content="Ticketing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header {...pageProps} />
      <Component {...pageProps} />
    </>
  );
};

AppComponent.getInitialProps = async (context) => {
  if (typeof window === "undefined") {
    const axios = axiosBuilder(context.ctx);
    const { data } = await axios.get("/api/users/currentuser").catch((err) => {
      console.log(err.message);
    });

    return {
      pageProps: data,
    };
  } else {
    return {};
  }
};

export default AppComponent;

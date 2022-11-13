import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "../apolloClient";
import Router from "next/router";
import { useState, useEffect } from "react";
import "../styles/Globals.css";
import { Oval } from "react-loader-spinner";

function MyApp({ Component, pageProps }: AppProps) {
  const client = apolloClient();

  /* loader for first visit and refresh */
  //problem: "Keep in mind that if you add a loader at the _app level to prevent rendering until window is defined, you're forcing all pages to fully render on the client-side, defeating the purpose of using Next.js for its SSR benefits"
  useEffect(() => {
    if (typeof window !== "undefined") {
      //how to use refs to get element from another file/component ?
      const loader = document.getElementById("globalLoader");
      if (loader) loader.style.display = "none";
    }
  }, []);

  /* loader for page transition and refresh */
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const start = () => {
      setLoading(true);
    };
    const end = () => {
      setLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);

    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  function spinner() {
    //sorry for basically inline style, reference id={styles.loaderDiv} doesn't pass, changed back to import "../styles/Globals.css";
    let spinStyle = {
      mainHeaderLoading: {
        marginTop: "40px",
        marginBottom: "10px",
        fontSize: "40px",
        fontWeight: "400",
      },
      loaderDiv: {
        textAlign: "center",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        flexWrap: "nowrap",
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        minΗeight: "100vh",
      },
    };

    return (
      <div style={spinStyle.loaderDiv}>
        <h1 style={spinStyle.mainHeaderLoading}>Collections</h1>
        <Oval
          height={80}
          width={80}
          color="black"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="gray"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
        <p>loading...</p>
      </div>
    );
  }

  return (
    <ApolloProvider client={client}>
      <>{loading ? spinner() : <Component {...pageProps} />}</>
    </ApolloProvider>
  );
}

export default MyApp;

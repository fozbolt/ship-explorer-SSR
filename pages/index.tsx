import Head from "next/head";
import { useQuery } from "@apollo/client";
import { GET_SHIPS } from "../graphQL/Queries";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Image from "next/image";
import { apolloClient } from "../apolloClient";
import { Oval } from "react-loader-spinner";

type Ships = {
  [key: string]: any; //dummy key/value
};

type Ship = {
  [key: string]: any;
};

export default function Home({ ships }: Ships) {
  /* ships - from Server side rendering */
  console.log(ships);

  /* ships - from apollo useQuery - Client side rendering*/
  //   const { data, loading, error } = useQuery(GET_SHIPS);

  /* check for errors - include when using CSR */
  //   if (error) {
  //     return <p>:( an error happened</p>;
  //   }

  // if all good return data
  return (
    <div className={styles.container}>
      <Head>
        <title>Ships</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main id={styles.homeMain}>
        {/* loading variables usable ONLY with CSR (useQuery) */}
        {/* {loading && (
          <div id={styles.loaderDiv}>
            <h1 id={styles.mainHeaderLoading}>Collections</h1>
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
        )} */}

        {<h1 id={styles.mainHeader}>Collections</h1>}
        <div className={styles.grid}>
          {ships?.map((ship: Ship) => (
            //I put link on whole card because arrow icon is small
            <Link
              href={{
                pathname: "/details",
                query: { id: ship.id },
              }}
              key={ship.id}
              className={styles.card}
            >
              {/* bad example of conditional rendering */}
              {ship.image && (
                <Image
                  src={ship.image}
                  id={styles.shipImage}
                  height="360"
                  width="160"
                  alt="Ship image"
                />
              )}

              {!ship.image && (
                <Image
                  src="https://source.unsplash.com/photos/ctXf1GVyf9A"
                  id={styles.shipImage}
                  height="360"
                  width="160"
                  alt="Ship image"
                />
              )}
              <div id={styles.cardBody}>
                <div id={styles.infoDiv}>
                  <span id={styles.shipName}>{ship.name}</span>
                  <span id={styles.shipType}>{ship.type}</span>
                </div>
                <div id={styles.forwardButtonDiv}>
                  <Image
                    src="/forwardIcon.svg"
                    alt="forward button"
                    id={styles.forwardButton}
                    height="24"
                    width="24"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer />
    </div>
  );
}

//SSR - server side
//https://stackoverflow.com/questions/63171293/difference-between-result-from-usequery-hook-apolloclient-and-getstaticprops
export async function getServerSideProps() {
  const client = apolloClient();

  const { data, loading, error } = await client.query({ query: GET_SHIPS });
  console.log(data);
  {
    loading && <p>loading...</p>;
  }

  // check for errors
  if (error) {
    return <p>:( an error happened</p>;
  }

  return {
    props: {
      ships: data.ships,
      loading: loading,
    },
  };
}

//ISR - server side
// export async function getStaticProps() {
//   const client = apolloClient();

//   const { data, loading, error } = await client.query({ query: GET_SHIPS });

//   {
//     loading && <p>loading...</p>;
//   }

//   // check for errors
//   if (error) {
//     return <p>:( an error happened</p>;
//   }

//   return {
//     props: {
//       ships: data.ships,
//       loading: loading,
//     },
//     revalidate: 10,
//   };
// }

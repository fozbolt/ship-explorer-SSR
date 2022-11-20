import Head from "next/head";
import { useQuery } from "@apollo/client";
import { GET_SHIPS, SEARCH_SHIPS } from "../graphQL/Queries";
import styles from "../styles/Home.module.css";
import { apolloClient } from "../apolloClient";
import { Oval } from "react-loader-spinner";
import React, { useState, useEffect, useId } from "react";
import Select from "react-select";
import Collapsible from "react-collapsible";
import Card from "../components/card";

//dummy types - not at all better than just explicit inline - "any" declaration
type Ships = {
  [key: string]: any;
};

type Ship = {
  [key: string]: any;
};

//SSR - server side
//https://stackoverflow.com/questions/63171293/difference-between-result-from-usequery-hook-apolloclient-and-getstaticprops
export async function getServerSideProps() {
  const client = apolloClient();

  const { data, loading, error } = await client.query({ query: GET_SHIPS });
  //console.log(data);
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

//get ship types for filter
function getTypes(allShips: []) {
  let uniqueTypes = [
    ...new Set(allShips.map((item: { type: string }) => item.type)),
  ];

  let filteredShipTypes = uniqueTypes.map((type: string) => ({
    label: type,
    value: type,
  }));

  filteredShipTypes.unshift({ label: "All", value: "" });

  return filteredShipTypes;
}

function filterData(name: string, type: string) {
  const { data, error, loading } = useQuery(SEARCH_SHIPS, {
    variables: {
      find: {
        name: name,
        type: type,
      },
    },
  });

  //   let content: any;

  if (data?.ships !== undefined && data?.ships !== null) {
    if (loading) {
      //  content = "Loading ships...";
    }

    if (error) {
      //  content = `Error Occured: ${error}`;
      return `Error Occured: ${error}`;
    }

    return data.ships;
  }
}

export default function Home({ ships }: Ships) {
  /* ships - from Server side rendering */
  let allShips: [] = ships;
  let uniqueTypes = getTypes(allShips);

  /* ships - from apollo useQuery - Client side rendering*/
  //   const { data, loading, error } = useQuery(GET_SHIPS);

  /* check for errors - include when using CSR */
  //   if (error) {
  //     return <p>:( an error happened</p>;
  //   }

  //  filter handler
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  ships = filterData(name, type);

  return (
    <div className={styles.container}>
      <Head>
        <title>Ships</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main id={styles.homeMain}>
        {/* loading variables usable ONLY with CSR (useQuery) - SSR has different loader*/}
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

        <h1 id={styles.mainHeader}>Collections</h1>

        {/* search and filter wrapped around collapsible */}
        <Collapsible
          trigger="FILTER ▼"
          triggerWhenOpen="FILTER ▲"
          overflowWhenOpen="visible"
          className={styles.collapsible}
          openedClassName={styles.collapsible}
          triggerClassName={styles.Collapsible__trigger}
          triggerOpenedClassName={styles.Collapsible__trigger}
          contentOuterClassName={styles.collapsibleContent}
          //   id={useId()}
        >
          <div id={styles.filterDiv}>
            <input
              type="text"
              placeholder="Search..."
              id={styles.searchBar}
              onChange={(event) => {
                //   sName = event.target.value;
                setName(event.target.value);
              }}
            />

            {uniqueTypes && (
              <Select
                id={styles.filterBar}
                placeholder={type || "All"}
                options={uniqueTypes}
                //   instanceId={useId()} //doesn't work because of conditional rendering
                instanceId={Math.floor(Math.random() * 100)} //quick fix
                onChange={(choice) => {
                  setType(choice?.value || "");
                }}
              />
            )}
          </div>
        </Collapsible>

        {/* ships grid*/}
        <div className={styles.grid}>
          {ships?.map((ship: Ship) => (
            <Card ship={ship} key={ship.id}></Card>
          ))}
        </div>
      </main>

      <footer />
    </div>
  );
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

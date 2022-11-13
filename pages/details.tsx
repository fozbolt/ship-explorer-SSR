import { useRouter } from "next/router";
import { apolloClient } from "../apolloClient";
import Head from "next/head";
import { useQuery } from "@apollo/client";
import { GET_SHIP } from "../graphQL/Queries";
import styles from "../styles/Details.module.css";
import Link from "next/link";
import Image from "next/image";
import { Oval } from "react-loader-spinner";

export default function DetailsPage({ ship }: any) {
  /* ship - from apollo useQuery - Client side rendering*/
  //    const router = useRouter();
  //    const {
  //      query: { id },
  //    } = router;

  //   const { data, loading, error } = useQuery(GET_SHIP, {
  //     variables: {
  //       id: id,
  //     },
  //   });

  /* check for errors - include when using CSR */
  //   if (error) {
  //     return <p>:( an error happened</p>;
  //   }

  let missions = ship?.missions;

  function getBasicInfo() {
    function cleanKey(str: string) {
      let upperCase = str.charAt(0).toUpperCase() + str.slice(1);
      return upperCase.replace(/_/g, " ");
    }

    return (
      ship &&
      Object.entries(ship)
        .filter(
          ([key]) =>
            key === "year_built" ||
            key === "weight_kg" ||
            key === "class" ||
            key === "home_port"
        )
        .map(([key]) => {
          return (
            <div key={key} id={styles.backgroundBox}>
              <>
                <div id={styles.basicInfoKey}>{cleanKey(key)}</div>
                <div id={styles.basicInfoValue}>{ship[key] || "Unknown"}</div>
              </>
            </div>
          );
        })
    );
  }

  return (
    <div id={styles.content}>
      <Head>
        <title>Ship details</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        {/* loading on page visit (for CSR) */}
        {/* {loading && (
          <div id={styles.loaderDiv}>
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
          </div>
        )} */}
        {/* Show image when loading is finished - if picture exists */}
        {ship?.image && (
          <div>
            <Link href={{ pathname: "/" }} className={styles.card}>
              <div id={styles.backButtonDiv}>
                <Image
                  src="/backIcon.svg"
                  alt="back button"
                  id={styles.backIcon}
                  height="24"
                  width="24"
                />
              </div>
            </Link>
            <Image
              src={ship.image}
              id={styles.heroImage}
              height="380"
              width="300"
              alt="Ship image"
            />
          </div>
        )}
        {/* Show default image when loading is finished - if picture doesn't exist */}
        {!ship?.image && (
          <div>
            <Image
              src="https://source.unsplash.com/photos/ctXf1GVyf9A"
              id={styles.heroImage}
              height="380"
              width="300"
              alt="Ship image"
            />
            <Link href={{ pathname: "/" }} className={styles.card}>
              <div id={styles.backButtonDiv}>
                <Image
                  src="/backIcon.svg"
                  alt="back button"
                  id={styles.backButton}
                  height="24"
                  width="24"
                />
              </div>
            </Link>
          </div>
        )}
      </div>
      {/* headers */}
      <div id={styles.mainInfo}>
        <div id={styles.title}>{ship?.name || "Name non existant"}</div>
        <div id={styles.type}>{ship?.type || "Name non existant"}</div>
      </div>
      {/* basic info */}
      <div id={styles.detailsInfo}>
        <div>
          <Image
            src="/basicInfo.svg"
            alt="basic info icon"
            id={styles.basicInfo}
            height="24"
            width="24"
          />
        </div>
        <div id={styles.backgroundBoxDiv}>{getBasicInfo()}</div>
        {/* missions */}
        <div>
          <Image
            src="/missionsIcon.svg"
            alt="basic info icon"
            id={styles.missionsIcon}
            height="24"
            width="24"
          />
          <div id={styles.missionsContainer}>
            {missions?.map((mission: any) => (
              <div id={styles.missionDiv} key={mission.name}>
                <div id={styles.missionName}>{mission.name}</div>
                <div id={styles.missioFlight}>Flight:{mission.flight}</div>
              </div>
            ))}
          </div>
        </div>
        {/* go to homepage */}
        <div>
          <Link href={{ pathname: "/" }} className={styles.card}>
            <div id={styles.backtoListDiv}>
              <Image
                src="/backIcon.svg"
                alt="back button"
                id={styles.backButton}
                height="24"
                width="24"
              />
              <div id={styles.backToListBtn}>Back to the list</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

//SSR
export async function getServerSideProps(context: any) {
  const client = apolloClient();
  const { query } = context;

  const { data, loading, error } = await client.query({
    query: GET_SHIP,
    variables: {
      id: query.id,
    },
  });

  {
    loading && <p>loading...</p>;
  }

  // check for errors
  if (error) {
    return <p>:( an error happened</p>;
  }

  return {
    props: {
      ship: data.ship,
    },
  };
}

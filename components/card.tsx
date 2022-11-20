import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useId } from "react";

function Card({ ship }: any) {
  return (
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
  );
}

export default Card;

import styles from "../styles/Home.module.css";
import HomePage from "./Home/Home";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>miau</h1>
        <HomePage />
      </main>

      <footer className={styles.footer}>
        <a
          href="https://apenasgabs.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/cathd.svg" alt="Prrrrrr Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}

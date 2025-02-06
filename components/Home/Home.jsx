import styles from "@/styles/Home.module.scss";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <h1>Interactive Map Polygon Editor</h1>
        <p>Draw, edit, and manage polygons with ease.</p>
        <Link href="/draw">
          <button className={styles.ctaButton}>Start Mapping</button>
        </Link>
      </header>

      <section className={styles.features}>
        <div className={styles.featureCard}>
          <h3>📍 Draw Polygons</h3>
          <p>Easily create and manage polygons on the map.</p>
        </div>
        <div className={styles.featureCard}>
          <h3>🎨 Customize Colors</h3>
          <p>Change polygon fill and border colors.</p>
        </div>
        <div className={styles.featureCard}>
          <h3>📊 Export & Import</h3>
          <p>Save and load polygons as JSON files.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

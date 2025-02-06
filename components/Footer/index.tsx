import styles from "@/styles/Footer.module.scss";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Company Information */}
        <div className={styles.info}>
          <h4>Maplens</h4>
          <p>
            &copy; {new Date().getFullYear()} Salman Sadik Siddiquee. All rights
            reserved.
          </p>
        </div>

        {/* Navigation Links */}
        <div className={styles.links}>
          <Link href="/">Home</Link>
          <Link href="/draw">Draw</Link>
          <Link href="/manage-polygons">Manage Polygons</Link>
        </div>

        {/* Social Media Links */}
        <div className={styles.social}>
          <a
            href="https://github.com/salsadsid"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </a>
          <a
            href="https://www.linkedin.com/in/salsadsid/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

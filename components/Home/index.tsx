"use client";

import styles from "@/styles/Home.module.scss";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiDownload, FiEdit, FiMap } from "react-icons/fi";

const HomePage = () => {
  const features = [
    {
      icon: <FiMap />,
      title: "Draw Polygons",
      text: "Create precise geographic shapes with intuitive drawing tools",
    },
    {
      icon: <FiEdit />,
      title: "Edit Properties",
      text: "Modify colors, borders, and metadata in real-time",
    },
    {
      icon: <FiDownload />,
      title: "Import/Export",
      text: "JSON support for seamless data integration",
    },
  ];

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.heroContent}
        >
          <h1>
            <span className={styles.gradientText}>GeoShape</span> Editor
          </h1>
          <p className={styles.subtitle}>
            Geospatial Polygon Management Solution
          </p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/draw" className={styles.cta}>
              Get Started →
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <section className={styles.features}>
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className={styles.featureCard}
          >
            <div className={styles.featureIcon}>{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default HomePage;

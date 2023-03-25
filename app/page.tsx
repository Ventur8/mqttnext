import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "./page.module.css";
import MqttClient from "./components/topics";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={styles.main}>
      <MqttClient />
    </main>
  );
}

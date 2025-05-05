import styles from "./styles.module.css";
import Head from "next/head";

export default function Dashboard() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Tarefas+ | Painel</title>
      </Head>

      <h1>Página painel</h1>
    </div>
  );
}

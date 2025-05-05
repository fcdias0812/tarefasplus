import { GetServerSideProps } from "next";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import styles from "./styles.module.css";
import Head from "next/head";
import { Textarea } from "@/components/textarea";
import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { db } from "@/services/firebaseConnection";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Link from "next/link";

interface DashboardProps {
  user: {
    email: string;
  };
}

interface TasksProps {
  id: string;
  created: Date;
  public: boolean;
  tarefa: string;
  user: string;
}

export default function Dashboard({ user }: DashboardProps) {
  const [input, setInput] = useState("");
  const [publicTask, setPublicTask] = useState(false);
  const [tasks, setTasks] = useState<TasksProps[]>([]);

  useEffect(() => {
    async function loadTarefas() {
      const tarefasRef = collection(db, "tarefas");
      const q = query(
        tarefasRef,
        orderBy("created", "desc"),
        where("user", "==", user?.email)
      );

      onSnapshot(q, (snapshot) => {
        let lista = [] as TasksProps[];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            created: doc.data().created,
            public: doc.data().public,
            tarefa: doc.data().tarefa,
            user: doc.data().user,
          });
        });

        setTasks(lista);
      });
    }

    loadTarefas();
  }, [user?.email]);

  function handleChangePublic(event: ChangeEvent<HTMLInputElement>) {
    setPublicTask(event.target.checked);
  }

  async function handleRegisterTask(e: FormEvent) {
    e.preventDefault();

    if (!input) {
      return;
    }

    try {
      await addDoc(collection(db, "tarefas"), {
        tarefa: input,
        created: new Date(),
        user: user?.email,
        public: publicTask,
      });

      setInput("");
      setPublicTask(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleShare(id: string) {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/task/${id}`
    );

    alert("URL copiada");
  }

  async function handleDeleteTask(id: string) {
    await deleteDoc(doc(db, "tarefas", id));
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Tarefas+ | Painel</title>
      </Head>

      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Qual sua tarefa?</h1>

            <form onSubmit={handleRegisterTask}>
              <Textarea
                value={input}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setInput(e.target.value)
                }
                placeholder="Digite qual a sua tarefa"
              />
              <div className={styles.checkboxArea}>
                <input
                  type="checkbox"
                  id="checkbox"
                  checked={publicTask}
                  onChange={handleChangePublic}
                  className={styles.checkbox}
                />
                <label htmlFor="checkbox">Deixar tarefa pública</label>
              </div>

              <button type="submit" className={styles.button}>
                Registrar
              </button>
            </form>
          </div>
        </section>

        <section className={styles.taskContainer}>
          <h1>Minhas tarefas</h1>

          {tasks.map((task) => (
            <article key={task.id} className={styles.task}>
              {task.public && (
                <div className={styles.tagContainer}>
                  <label className={styles.tag}>PUBLICA</label>
                  <button
                    onClick={() => handleShare(task.id)}
                    className={styles.shareButton}
                  >
                    <FiShare2 size={22} color="#3183ff" />
                  </button>
                </div>
              )}
              <div className={styles.taskContent}>
                {task.public ? (
                  <Link href={`/task/${task.id}`}>
                    <p>{task.tarefa}</p>
                  </Link>
                ) : (
                  <p>{task.tarefa}</p>
                )}
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className={styles.trashButton}
                >
                  <FaTrash size={24} color="#ea3140" />
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: {
        email: session?.user?.email,
      },
    },
  };
};

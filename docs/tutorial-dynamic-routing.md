# Guia de Roteamento Dinâmico no Next.js

Este guia vai te ensinar como criar rotas dinâmicas no Next.js, utilizando o ID como parâmetro, integrando com Firebase e utilizando variáveis de ambiente.

## Pré-requisitos

- Node.js instalado
- Projeto Next.js configurado
- Firebase configurado no projeto
- Conhecimento básico de JavaScript/TypeScript

## 1. Configurando o Ambiente

Primeiro, crie um arquivo `.env.local` na raiz do seu projeto e adicione suas variáveis de ambiente:

```env
NEXT_PUBLIC_URL=http://localhost:3000
```

## 2. Criando a Estrutura de Arquivos

Para criar uma rota dinâmica no Next.js, você precisa criar um arquivo dentro da pasta `pages` com o nome do recurso entre colchetes. Por exemplo:

```
src/
  pages/
    task/
      [id].tsx    # Rota dinâmica para tarefas
```

## 3. Implementando a Rota Dinâmica

Vamos criar uma página que mostra os detalhes de uma tarefa específica. Aqui está o código explicado:

```typescript
// src/pages/task/[id].tsx

import Head from "next/head";
import { GetServerSideProps } from "next";
import { db } from "@/services/firebaseConnection";
import { doc, getDoc } from "firebase/firestore";

// Interface para tipar os dados da tarefa
interface TaskProps {
  item: {
    tarefa: string;
    public: boolean;
    created: string;
    user: string;
    taskId: string;
  };
}

// Componente da página
export default function Task({ item }: TaskProps) {
  return (
    <div>
      <Head>
        <title>Tarefas+ | Detalhes da tarefa</title>
      </Head>

      <main>
        <h1>Tarefa</h1>
        <article>
          <p>{item.tarefa}</p>
        </article>
      </main>
    </div>
  );
}

// Função que roda no servidor antes da página ser renderizada
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  // Pega o ID da URL
  const id = params?.id as string;

  // Busca o documento no Firebase
  const snapshot = await getDoc(doc(db, "tarefas", id));

  // Se o documento não existir, redireciona para a home
  if (snapshot.data() === undefined) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Se a tarefa não for pública, redireciona para a home
  if (!snapshot.data()?.public) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Converte o timestamp do Firebase para data legível
  const miliseconds = snapshot.data()?.created?.seconds * 1000;

  // Formata os dados da tarefa
  const task = {
    tarefa: snapshot.data()?.tarefa,
    public: snapshot.data()?.public,
    created: new Date(miliseconds).toLocaleDateString(),
    user: snapshot.data()?.user,
    taskId: id,
  };

  // Retorna os dados para a página
  return {
    props: {
      item: task,
    },
  };
};
```

## 4. Explicação do Código

### Roteamento Dinâmico

- O arquivo `[id].tsx` indica que esta é uma rota dinâmica
- O parâmetro `id` pode ser acessado através de `params.id` no `getServerSideProps`

### getServerSideProps

- Esta função é executada no servidor antes da página ser renderizada
- Recebe o parâmetro `params` que contém os valores da URL
- Retorna um objeto com `props` que serão passadas para o componente da página

### Firebase Integration

- Utilizamos `getDoc` para buscar um documento específico no Firestore
- O documento é buscado usando o ID da URL
- Convertemos o timestamp do Firebase para uma data legível

### Redirecionamentos

- Se a tarefa não existir ou não for pública, redirecionamos para a home
- Usamos o objeto `redirect` para fazer o redirecionamento

## 5. Como Usar

Para acessar uma tarefa específica, use a URL:

```
http://localhost:3000/task/ID_DA_TAREFA
```

## 6. Dicas Importantes

1. Sempre trate casos onde o documento não existe
2. Use TypeScript para ter melhor tipagem e autocompletar
3. Mantenha suas variáveis de ambiente seguras no arquivo `.env.local`
4. Use o `getServerSideProps` quando precisar de dados que devem ser buscados no servidor

## 7. Exemplo de Uso com Links

Para criar links para suas tarefas, use o componente `Link` do Next.js:

```typescript
import Link from "next/link";

// Em seu componente
<Link href={`/task/${taskId}`}>Ver detalhes da tarefa</Link>;
```

## Conclusão

Agora você sabe como criar rotas dinâmicas no Next.js, integrando com Firebase e utilizando variáveis de ambiente. Este padrão pode ser aplicado para qualquer tipo de recurso que precise de uma página de detalhes baseada em um ID.

Lembre-se que o `getServerSideProps` é executado em cada requisição, então use-o quando precisar de dados sempre atualizados. Se os dados não mudam com frequência, considere usar `getStaticProps` com `getStaticPaths` para melhor performance.

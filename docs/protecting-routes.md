# Protegendo Rotas no Next.js com getServerSideProps e getSession

## Introdução

Neste guia, vamos aprender como proteger rotas em uma aplicação Next.js, garantindo que apenas usuários autenticados possam acessar determinadas páginas. Vamos utilizar o `getServerSideProps` e o `getSession` do NextAuth.js para implementar essa proteção.

## Pré-requisitos

Antes de começar, certifique-se de que você tem:

1. Uma aplicação Next.js configurada
2. NextAuth.js instalado e configurado
3. Um sistema de autenticação funcionando

## Como Funciona a Proteção de Rotas

A proteção de rotas funciona verificando se o usuário está autenticado antes de renderizar a página. Se o usuário não estiver autenticado, ele será redirecionado para a página de login.

## Exemplo Prático

Vamos analisar um exemplo prático de como proteger uma rota. Aqui está um código de uma página do dashboard:

```typescript
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
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
    props: {},
  };
};
```

## Explicação Detalhada

Vamos entender cada parte do código:

### 1. Importações Necessárias

```typescript
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
```

- `GetServerSideProps`: É um tipo do Next.js que define a função que será executada no servidor antes de renderizar a página
- `getSession`: É uma função do NextAuth.js que retorna a sessão atual do usuário

### 2. Função getServerSideProps

```typescript
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
    props: {},
  };
};
```

Esta função é executada no servidor antes da página ser renderizada. Vamos entender o que ela faz:

1. Recebe o objeto `req` (request) como parâmetro
2. Usa `getSession` para verificar se existe uma sessão ativa
3. Se não houver usuário na sessão (`!session?.user`):
   - Retorna um objeto de redirecionamento
   - O usuário será redirecionado para a página inicial ("/")
   - `permanent: false` indica que é um redirecionamento temporário
4. Se houver usuário na sessão:
   - Retorna um objeto com `props` vazio, permitindo que a página seja renderizada

## Como Usar em Outras Páginas

Para proteger outras páginas, você pode copiar a função `getServerSideProps` e adaptá-la. Por exemplo:

```typescript
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session?.user) {
    return {
      redirect: {
        destination: "/login", // Você pode mudar para qualquer página
        permanent: false,
      },
    };
  }

  return {
    props: {
      // Você pode passar dados adicionais aqui
      user: session.user,
    },
  };
};
```

## Dicas Importantes

1. Sempre verifique se o usuário existe na sessão antes de permitir o acesso
2. Escolha uma página de redirecionamento apropriada (login, home, etc.)
3. Você pode passar dados adicionais através das props para a página
4. Lembre-se que esta verificação acontece no servidor, então é segura

## Conclusão

Proteger rotas é uma parte essencial de qualquer aplicação web. Com Next.js e NextAuth.js, podemos implementar essa proteção de forma simples e eficiente. O `getServerSideProps` nos permite fazer verificações no servidor antes de renderizar a página, garantindo que apenas usuários autenticados tenham acesso ao conteúdo protegido.

## Recursos Adicionais

- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do NextAuth.js](https://next-auth.js.org/)
- [Tutorial de Autenticação com Next.js](https://nextjs.org/docs/authentication)

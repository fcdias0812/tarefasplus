# Autenticação com Google no Next.js usando NextAuth.js

## Introdução

Neste guia, vamos aprender como implementar autenticação com Google em uma aplicação Next.js usando NextAuth.js. Vamos cobrir desde a configuração inicial até a implementação do login/logout na interface.

## Pré-requisitos

Antes de começar, você precisa:

1. Uma aplicação Next.js configurada
2. Uma conta Google e acesso ao Google Cloud Console
3. Pacotes necessários instalados:
   ```bash
   npm install next-auth
   ```

## Configuração do Google Cloud Console

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá para "APIs & Services" > "Credentials"
4. Clique em "Create Credentials" > "OAuth client ID"
5. Configure as credenciais:
   - Tipo de aplicação: Web application
   - Nome: Seu app name
   - URIs de redirecionamento autorizados:
     - `http://localhost:3000/api/auth/callback/google` (desenvolvimento)
     - `https://seu-dominio.com/api/auth/callback/google` (produção)
6. Copie o Client ID e Client Secret gerados

## Configuração do NextAuth.js

### 1. Configuração das Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
GOOGLE_CLIENT_ID=seu_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
JWT_SECRET=uma_string_aleatoria_segura
```

### 2. Configuração do NextAuth

Crie o arquivo `src/pages/api/auth/[...nextauth].ts`:

```typescript
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.JWT_SECRET as string,
};

export default NextAuth(authOptions);
```

## Implementação do Login/Logout na Interface

### 1. Configuração do Provider

No seu arquivo `_app.tsx`, adicione o SessionProvider:

```typescript
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
```

### 2. Componente de Header com Login/Logout

Aqui está um exemplo de como implementar um header com botões de login/logout:

```typescript
import { useSession, signIn, signOut } from "next-auth/react";
import styles from "./styles.module.css";
import Link from "next/link";

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className={styles.header}>
      <section className={styles.content}>
        <nav className={styles.nav}>
          <Link href="/">
            <h1 className={styles.logo}>
              Tarefas<span>+</span>
            </h1>
          </Link>
          {session?.user && (
            <Link href="/dashboard" className={styles.link}>
              Meu Painel
            </Link>
          )}
        </nav>

        {status === "loading" ? (
          <></>
        ) : session ? (
          <button className={styles.loginButton} onClick={() => signOut()}>
            Olá {session?.user?.name}
          </button>
        ) : (
          <button
            className={styles.loginButton}
            onClick={() => signIn("google")}
          >
            Acessar
          </button>
        )}
      </section>
    </header>
  );
}
```

## Explicação Detalhada

### 1. Hooks e Funções do NextAuth

- `useSession()`: Hook que retorna o estado da sessão atual

  - `data`: Contém os dados da sessão (user, expires, etc.)
  - `status`: Estado da sessão ("loading", "authenticated", "unauthenticated")

- `signIn("google")`: Função para iniciar o processo de login com Google
- `signOut()`: Função para fazer logout do usuário

### 2. Estrutura do Componente

O componente Header implementa:

1. Verificação do estado da sessão
2. Renderização condicional baseada no estado:
   - Loading: Mostra nada
   - Autenticado: Mostra nome do usuário e botão de logout
   - Não autenticado: Mostra botão de login

## Como Usar em Outros Componentes

### Verificando Autenticação

```typescript
import { useSession } from "next-auth/react";

export function MeuComponente() {
  const { data: session } = useSession();

  if (session) {
    return <div>Olá, {session.user.name}!</div>;
  }

  return <div>Por favor, faça login</div>;
}
```

### Protegendo Rotas

Para proteger rotas, use o `getServerSideProps`:

```typescript
import { getSession } from "next-auth/react";

export const getServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
```

## Dicas Importantes

1. Sempre use variáveis de ambiente para credenciais
2. Implemente tratamento de erros adequado
3. Considere adicionar um estado de loading durante a autenticação
4. Personalize a experiência do usuário baseada no estado da sessão

## Conclusão

Implementar autenticação com Google usando NextAuth.js é uma maneira simples e segura de adicionar login social à sua aplicação Next.js. O NextAuth.js cuida de toda a complexidade da autenticação, permitindo que você se concentre na experiência do usuário.

## Recursos Adicionais

- [Documentação do NextAuth.js](https://next-auth.js.org/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Authentication](https://nextjs.org/docs/authentication)

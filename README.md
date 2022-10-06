## Dados do APP

Projeto JAMStack que oferece consumo de publicações do website por assinatura.

### Tecnologias

- Dependências: Next.js, SASS, React-icons, NextAuth.js, FaunaDb, Axios, pacotes do React.js, pacotes do Stripe, pacotes do Prismic CMS.
- APIs: Stripe, GitHub OAuth, FaunaDb, Prismic CMS

### Funcionalidades

- Autenticação com File-System Routing, NextAuth.js e OAuth
- Gerenciamento de produto e pagamentos com Stripe
- Armazenamento de dados do usuário em FaunaDb

### Rodando o servidor

Antes de começar, você vai precisar de Git, Node.js e um editor para o código, como VSCode.

```bash
# Clone o repositório
$ git clone https://github.com/pedroibribas/rocketseat-ignews-app.git
# ou com SSH
$ git clone git@github.com:pedroibribas/rocketseat-ignews-app.git

# Acesse a pasta do projeto
$ cd rocketseat-ignews-app

# Instale todas as dependências
npm install
# ou
yarn install


# Configure as variáveis de ambiente

# Rode o servidor de desenvolvimento
npm run dev
# ou
yarn dev

# O servidor será inicializado em <http://localhost:3000>
```

Agora, configure as variáveis de ambiente no arquivo raiz `.env.local`:

```bash
# Stripe
STRIPE_API_KEY=#Gere uma private key na plataforma Stripe
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=#Gere uma public key na plataforma Stripe
STRIPE_WEBHOOK_SECRET=#Gere um secret no Stripe CLI
STRIPE_SUCCESS_URL=http://localhost:3000/posts
STRIPE_CANCEL_URL=http://localhost:3000/posts

# GitHub
GITHUB_ID=#Gere um client-id do OAuth App
GITHUB_SECRET=#Gere um client-secret do OAuth App

# FaunaDb
FAUNADB_KEY=#Gere uma key do FaunaDb

# Prismic CMS
PRISMIC_ACCESS_TOKEN=#Gere uma key do Prismic CMS

# Variáveis de ambiente iniciadas com NEXT_PUBLIC podem ser lidas no front-end. As demais são lidas exclusivamente no back-end da aplicação.
```

## Minhas anotações

- Esse é um projeto que aplica a arquitetura JAMStack. Por essa razão, os serviços tradicionalmente oferecidos por um back-end da aplicação são implementados no consumo de API de terceiros.

- O conteúdo da publicação é parcialmente apresentado independente de autenticação para que a indexação por mecanismos de busca seja possível.

- O Prismic CMS é um sistema de gerenciamento de conteúdo, e oferece um painel de administração ao usuário para a criação de conteúdo.

- O Next.js é um servidor Node.js para servir a UI montada. Essa forma de geração de interface é chamada Server Side Rendering. O React.js puro não oferece uma camada de servidor, e a interface é montada pelo navegador, sendo esse padrão de geração de interface chamado Single Page Rendering.

- Efetuar chamadas à API através da hook React `useEffect()` gera o Layout Shifting, isto é, uma primeira renderização da interface sem o dado buscado na API, e uma segunda renderização com o dado obtido. Além de ser perceptível ao usuário, o dado obtido não será indexado pelo mecanismo de busca. Essa chamada à API acontece no client-side. Com o Next.js, é possível efetuar a chamada à API no server-side, usando uma função GetServerSideProps ou GetStaticProps.

- No Next.js, as formas para executar calls à API via server-side são por API Routes, getServerSideProps (SSR) ou getStaticProps (SSG).

- File System Routing é a funcionalidade de criação automática de rotas para os arquivos presentes na pasta `app/pages` ou `app/src/pages`. O nome da rota é igual ao nome do arquivo.

- O Next.js também oferece uma camada back-end para roteamento serverless, em `app/src/api`. A vantagem de uma aplicação aceitar uma camada assim no front-end é de assumir responsabilidades tradicionalmente atribuídas ao back-end que não são lógicas de negócio.

- O Next.js aplica o File System Routing nos arquivos dentro de `app/api`. Os arquivos dessa pasta se comportam como um back-end, recebendo e respondendo a requisições do front-end, de modo Serverless, isto é, independente de um servidor.Obs.: A chamada a uma rota serverless abre e fecha um ambiente para receber e responder a requisição.

- O FaunaDb é um banco de dados apropriado principalmente a aplicações serverless, porque ele funciona de forma otimizada em um ambiente que não mantêm uma conexão constante com o servidor.

- A metodologia de pesquisa de documento no FaunaDb depende do cadastramento prévio de índice. O índice é um dado que assume o papel de objeto de pesquisa; no caso deste App, o email do usuário. Nas databases em geral, cada dado do documento é lido até combinar com os termos da pesquisa e selecionar o documento buscado; pelo modelo de index, apenas o dado index é lido, e isso otimiza a pesquisa.

- O Next.js suporta nativamente Scoped CSS.

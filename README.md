## Dados do APP

Projeto front-end de serviço para consumo de publicações da página por assinatura.

### Tecnologias

- Next.js
- Stripe
- FaunaDb
- OAuth
- SASS
- React-icons

### Funcionalidades

- Inscrição
- Autenticação
- Pagamentos via Stripe

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

# Gere uma API KEY no site Stripe

# Configure uma STRIPE_API_KEY como variável de ambiente no arquivo raiz `.env.local`:

# Rode o servidor de desenvolvimento
npm run dev
# ou
yarn dev

# O servidor será inicializado em <http://localhost:3000>
```

## Minhas anotações

- O conteúdo da publicação é parcialmente apresentado independente de autenticação para que a indexação por mecanismos de busca seja possível.
- O FaunaDb favorece o roteamento serverless. Rotas serverless funcionam no front-end independentemente do acesso nelas pelo back-end, e isso reduz o acesso constante à base de dados.
- O Prismic CMS é um sistema de gerenciamento de conteúdo, e oferece um painel de administração ao usuário para a criação de conteúdo.
- O Next.js é um servidor Node.js para servir a UI montada. Essa forma de geração de interface é chamada Server Side Rendering. O React.js puro não oferece uma camada de servidor, e a interface é montada pelo navegador, sendo esse padrão de geração de interface chamado Single Page Rendering.
- File System Routing é a funcionalidade de criação automática de rotas para os arquivos presentes na pasta `app/pages` ou `app/src/pages`. O nome da rota é igual ao nome do arquivo.
- O Next.js suporta nativamente Scoped CSS.
- Efetuar chamadas à API através da hook React `useEffect()` gera o Layout Shifting, isto é, uma primeira renderização da interface sem o dado buscado na API, e uma segunda renderização com o dado obtido. Além de ser perceptível ao usuário, o dado obtido não será indexado pelo mecanismo de busca. Essa chamada à API acontece no client-side. Com o Next.js, é possível efetuar a chamada à API no server-side, usando uma função GetServerSideProps ou GetStaticProps.

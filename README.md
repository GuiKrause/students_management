# Projeto Fullstack Codetech 🌐

Este projeto foi desenvolvido como parte de um teste avaliativo com o objetivo de demonstrar habilidades de desenvolvimento Fullstack. O foco principal está na funcionalidade e na integração do que foi proposto, com melhorias no layout priorizadas após a implementação do sistema básico.

---

## ⚙️ Como Utilizar?

Este guia explica como executar o sistema localmente. Certifique-se de seguir todas as etapas abaixo.

### Pré-requisitos

- **Node.js**: Certifique-se de ter o Node.js instalado. [Baixe e instale aqui](https://nodejs.org/).
- **MongoDB**: Necessário ter uma URL de conexão com MongoDB e uma coleção chamada `students_management` .
- **Versão NodeJS**: Estou utilizando a versão 22, se tiver nvm, sugiro que troque para esta versão.
- **URL MongoDB**: Exemplo de url mongo: (mongodb+srv.../students_management).

---

### Passo 1: Instalação das dependências

1. Navegue até a pasta `backend` no terminal:
```
cd backend
npm install
```

2. Navegue até a pasta `frontend` no terminal:
```
cd frontend
npm install
```

### Passo 2: Configuração do arquivo de ambiente

1. Faça uma cópia do arquivo env.example e renomeie-o para .env
```
cd backend
cp env.example .env
```

2. Abra o arquivo .env e preencha as seguintes variáveis de ambiente

- PORT= # Porta onde o servidor será executado (ex.: 3000)
- SECRET_KEY= # Qualquer palavra para uso como chave secreta
- MONGO_URI= # URL de conexão com o MongoDB

### Passo 3: Adicionando registro ao banco de dados

1. Popular banco
```
cd backend
npm run seed
```

### Passo 4: Executando o sistema

1. Navegue até a pasta backend e inicie o servidor
```
cd backend
npm start
```

2. Navegue até a pasta frontend e inicie o servidor
```
cd frontend
npm run dev
```

### Passo 5: Utilização do sistema

Após executar o frontend verifique a url local que será fornecida algo como:

- http://localhost:<numero de 4 digitos>
---

## ⚙️ Funcionalidades

- **Login e Registro de Usuários**: Sistema de autenticação, permitindo que os usuários realizem login e criem contas.
- **CRUD de alunos**: Gerenciamento completo de estudantes, incluindo criação, leitura, atualização e exclusão de registros.

---

## 🚀 Estrutura do Projeto

### **Backend**
Implementação do backend com rotas para autenticação e crud de aluno, controllers, middleware de autenticação, models e conexão com banco de dados.

### **Frontend**
Tela de autenticação com tbas para realizar login e registrar. Também possui uma tela para visualização dos aluno, assim como opções para cadastrar, editar e excluir registros.

---

## 🔧 Tecnologias Utilizadas

- **Linguagens de Programação**: Javascript.
- **Frameworks e Bibliotecas**: React, Express, Nodemon, Cors, ShadcnUI, Tailwind.
- **Banco de Dados**: MongoDB.

---

## 👥 Autor

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/GuiKrause">
        <img src="https://avatars.githubusercontent.com/u/134097567?v=4" width="100px;" alt="Guilherme Krause Ramos"/>
        <br/>
        <sub><b>Guilherme Krause Ramos</b></sub>
      </a>
    </td>
  </tr>
</table>

## Ester Egg
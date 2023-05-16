<br>

<p align="center">
<img src="./docs/images/logo.png" height="60"/>
</p>

<p align="center">Create an app which is just like discord</p>

## Features
- New channel
![new-channel](/docs/images/new-channel.png)
- Send message
![send-message](/docs/images/send-message.png)
- Edit message
![edit-message](/docs/images/edit-message.png)
- Delete message
![delete-message](/docs/images/delete-message.png)
- Message search
![message-search](/docs/images/message-search.png)
- Link preview
![link-preview](/docs/images/link-preview.png)
- File uploader
![file-uploader](/docs/images/file-uploader.png)
- File preview
![file-preview](/docs/images/file-preview.png)
- Add reactions
![add-reactions](/docs/images/add-reactions.png)
- ChatGPT
![chat-gpt](/docs/images/chat-gpt.png)


## Tech Stack
- TypeScript Supported
- Client
  - [Vue.js@3.3](https://vuejs.org/)
  - [Vite@4](https://vitejs.dev/)
  - [UnoCSS](https://github.com/unocss/unocss)
  - [NaiveUI](https://www.naiveui.com/)
  - [VueUse](https://vueuse.org/)
- Server
  - express
  - MongoDB
  - socket.io


## Setup

### Before
Make sure you have installed [Node.js](https://nodejs.org/en/) and [MongoDB](https://www.mongodb.com/try/download/community) first.
> I use Nodejs `v18.14.2` and MongoDB `v6.0.4`

### Install dependencies
I use pnpm as package manager, please install it first. see [pnpm](https://pnpm.io/)
```
pnpm install
```
### Setup DateBase
The default db name is `emcord`, you can change it in [here](/packages/server/src/index.ts)

After created the db, you can run `pnpm run dev` to start the both server and client(Powered by `concurrently`)
## License

[MIT](./LICENSE) License © 2023 [Cheng-DX](https://github.com/Cheng-DX)

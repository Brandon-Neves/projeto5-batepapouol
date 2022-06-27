let mensagens = []
let nomes
let nomeStatus
let participantes = []
let destinatario = []
let typeMessage
let nomeUsuarioSelecionado

setInterval(procurarMensagem, 3000)
setInterval(buscarUsuariosOnline, 10000)

function buscarUsuariosOnline() {
  let promessaParticipantes = axios.get(
    'https://mock-api.driven.com.br/api/v6/uol/participants'
  )
  promessaParticipantes.then(usuariosOnline)
}

function usuariosOnline(resposta) {
  participantes = resposta.data
  let containerUsuarios = document.querySelector('.box-participantes')
  containerUsuarios.innerHTML = ' '
  for (let i = 0; i < participantes.length; i++) {
    let quantidadeUsuariosOnline = participantes[i].name
    containerUsuarios.innerHTML += `
          
          <div class="participantes" onclick="selecionarUsuario(this)">
          <ion-icon class="visivel" name="person-circle-outline"></ion-icon>
            <h3 class="nome-usuario">${quantidadeUsuariosOnline}</h3>
            <ion-icon class="invisivel" name="checkmark-outline"></ion-icon>
          </div>  
    `
  }
}

function menuParticipantes(bolinha) {
  let menuParcipantesEscondido = document.querySelector('.menu-participantes')
  let backgroundMenuEscondido = document.querySelector('.background')
  menuParcipantesEscondido.classList.remove('escondido')
  backgroundMenuEscondido.classList.remove('escondido')
}

function selecionarUsuario(usuarios) {
  let usuarioClicado = document.querySelector('.usuario-selecionado')
  if (usuarioClicado !== null) {
    usuarioClicado.classList.remove('usuario-selecionado')
  }
  usuarios.classList.add('usuario-selecionado')
  nomeUsuarioSelecionado = document.querySelector(
    '.usuario-selecionado .nome-usuario'
  ).innerHTML
}

function selecionarTipoDaMensagem(tipo) {
  let tipoClicado = document.querySelector('.tipo-selecionado')
  if (tipoClicado !== null) {
    tipoClicado.classList.remove('tipo-selecionado')
  }
  tipo.classList.add('tipo-selecionado')
  typeMessage = document.querySelector(
    '.tipo-selecionado .tipo-mensagem'
  ).innerHTML
  if (typeMessage === 'Público') {
    typeMessage = 'message'
  }
  if (typeMessage === 'Reservadamente') {
    typeMessage = 'private_message'
  }
}

function fecharMenuParticipantes(bolinha) {
  let background = document.querySelector('.background')
  let fecharMenu = document.querySelector('.menu-participantes')
  fecharMenu.classList.add('escondido')
  background.classList.add('escondido')
}

function escolherDestinatario(bolinha) {}

function procurarMensagem() {
  let promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages')
  promessa.then(buscarResposta)
  rolagem()

  function buscarResposta(resposta) {
    mensagens = resposta.data
    escreverMensagens(mensagens)
  }
}

function pegarNome() {
  nomes = String(prompt('Digite o seu lindo nome'))
  let removerClasse = document.querySelector('.container-principal')
  let promessaEnvio = axios.post(
    'https://mock-api.driven.com.br/api/v6/uol/participants ',
    { name: nomes }
  )
  promessaEnvio.then(function () {
    removerClasse.classList.remove('escondido')
  })
  promessaEnvio.catch(nomeJaExiste)
}

function nomeJaExiste(resposta) {
  let removerClasse = document.querySelector('.container-principal')
  nomes = String(prompt('Esse nome já existe, escolha outro'))
  let promessa = axios.post(
    'https://mock-api.driven.com.br/api/v6/uol/participants ',
    { name: nomes }
  )
  promessa.then(function () {
    removerClasse.classList.remove('escondido')
  })
  promessa.catch(nomeJaExiste)
}

function statusUsuario() {
  let promessaStatusUsuario = axios.post(
    'https://mock-api.driven.com.br/api/v6/uol/status',
    {
      name: nomes
    }
  )
  promessaStatusUsuario.then()
}
setInterval(statusUsuario, 5000)

function escreverMensagens(mensagens) {
  let containerMensagem = document.querySelector('.container-mensagens')
  containerMensagem.innerHTML = ' '
  for (let i = 0; i < mensagens.length; i++) {
    let tipoMessage = mensagens[i].type
    let tipoTexto = mensagens[i].text
    let destinatario = mensagens[i].to
    let horario = mensagens[i].time
    let nome = mensagens[i].from
    if (tipoMessage === 'status') {
      containerMensagem.innerHTML += `
      <li class="mensagem-entrar-sair">
      <div class="horario">
        <h3>(${horario})</h3>
      </div>
      <div class="nome-usuario">
        <h2>${nome}</h2>
      </div>
      <div class="conteudo">
        <p>${tipoTexto}</p>
      </li>`
    } else if (tipoMessage === 'message') {
      containerMensagem.innerHTML += `
      <li class="mensagem-normal">
            <div class="horario">
              <h3>(${horario})</h3>
            </div>
            <div class="nome-usuario">
              <h2>${nome}</h2>
            </div>
            <div class="conteudo">
              <p>para</p>
            </div>
            <div class="nome-recebe-mensagem">
              <h2>${destinatario}:</h2>
            </div>
            <div class="mensagem">
              <p>${tipoTexto}</p>
            </div>
          </li>`
    } else if (tipoMessage === 'private_message' && nomes === destinatario) {
      containerMensagem.innerHTML += `
      <li class="mensagem-privada">
            <div class="horario">
              <h3>(${horario})</h3>
            </div>
            <div class="nome-usuario">
              <h2>${nome}</h2>
            </div>
            <div class="conteudo">
              <p>reservadamente para</p>
            </div>
            <div class="nome-recebe-mensagem">
              <h2>${destinatario}:</h2>
            </div>
            <div class="mensagem">
              <p>${tipoTexto}</p>
            </div>
          </li>`
    }
  }
}

function rolagem() {
  const ultimoElemento = document.querySelector(
    '.container-mensagens li:last-child'
  )
  ultimoElemento.scrollIntoView()
}

function enviarMensagem() {
  let conteudoMensagem = document.querySelector('.conteudo-mensagem').value
  if (conteudoMensagem !== '') {
    let promessaEnviarMensagem = axios.post(
      'https://mock-api.driven.com.br/api/v6/uol/messages',
      {
        from: nomes,
        to: nomeUsuarioSelecionado,
        text: conteudoMensagem,
        type: typeMessage
      }
    )
    promessaEnviarMensagem.then(function (respostas) {
      respostas.data

      procurarMensagem()
    })
    document.querySelector('.conteudo-mensagem').value = ''
    promessaEnviarMensagem.catch(mensagemErro)
  }
}

function mensagemErro() {
  alert('Usuario desconectado')
  window.location.reload()
}

document.addEventListener('keypress', function (enter) {
  if (enter.key === 'Enter') {
    const botaoEnter = document.querySelector('.apertar-enter')
    botaoEnter.click()
  }
})

procurarMensagem()
rolagem()
pegarNome()

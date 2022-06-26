let mensagens = []
let nomes
let nomeStatus

setInterval(procurarMensagem, 3000)
setInterval(statusUsuario, 5000)
pegarNome()

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
  const objetoNome = {
    name: nomes
  }
  let promessaEnvio = axios.post(
    'https://mock-api.driven.com.br/api/v6/uol/participants ',
    objetoNome
  )
  promessaEnvio.then(enviarNome)
  promessaEnvio.catch(nomeJaExiste)
}

function nomeJaExiste(resposta) {
  console.log(resposta)
  pegarNome()
}

function enviarNome(resposta) {
  nomeStatus = resposta
  let removerClasse = document.querySelector('.container-principal')
  if (nomes !== '') {
    removerClasse.classList.remove('escondido')
  } else {
    pegarNome()
  }
  statusUsuario()
}

function statusUsuario() {
  let promessaStatusUsuario = axios.post(
    'https://mock-api.driven.com.br/api/v6/uol/status',
    {
      name: nomes
    }
  )
  promessaStatusUsuario.then()
  promessaStatusUsuario.cath()
}

function escreverMensagens(mensagens) {
  let containerMensagem = document.querySelector('.container-mensagens')
  containerMensagem.innerHTML = ' '
  for (let i = 0; i < mensagens.length; i++) {
    let tipoTexto = mensagens[i].text
    let destinatario = mensagens[i].to
    let horario = mensagens[i].time
    let nome = mensagens[i].from
    if (tipoTexto === 'entra na sala...' || tipoTexto === 'sai da sala...') {
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
    } else if (destinatario === 'Todos') {
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
    } else if (
      destinatario !== 'Todos' &&
      destinatario !== 'todos' &&
      nomes === destinatario
    ) {
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
  console.log(ultimoElemento)
  ultimoElemento.scrollIntoView()
}

function enviarMensagem(bolinha) {
  let conteudoMensagem = document.querySelector('.conteudo-mensagem').value
  console.log(conteudoMensagem)
  let promessaEnviarMensagem = axios.post(
    'https://mock-api.driven.com.br/api/v6/uol/messages',
    {
      from: nomes,
      to: 'Todos',
      text: `${conteudoMensagem}`,
      type: 'message'
    }
  )
  promessaEnviarMensagem.then()
  let apagarMensagem = (document.querySelector('.conteudo-mensagem').value = '')
  apagarMensagem
}

procurarMensagem()
rolagem()

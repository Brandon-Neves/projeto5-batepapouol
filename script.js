let mensagens = []
let nomes

setInterval(procurarMensagem, 3000)

function procurarMensagem() {
  let promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages')
  promessa.then(buscarResposta)
  rolagem()

  function buscarResposta(resposta) {
    mensagens = resposta.data
    escreverMensagens(mensagens)
  }
}

function escreverMensagens(mensagens) {
  let containerMensagem = document.querySelector(
    '.mensagens .container-mensagens'
  )
  containerMensagem.innerHTML = ' '
  for (let i = 0; i < mensagens.length; i++) {
    let tipoTexto = mensagens[i].text
    let destinatario = mensagens[i].to
    let horario = mensagens[i].time
    let nome = mensagens[i].from
    if (tipoTexto === 'entra na sala...' || tipoTexto === 'sai da sala...') {
      console.log('deu certo')
      containerMensagem.innerHTML += `
      <div class="mensagem-entrar-sair">
      <div class="horario">
        <h3>(${horario})</h3>
      </div>
      <div class="nome-usuario">
        <h2>${nome}</h2>
      </div>
      <div class="conteudo">
        <p>${tipoTexto}</p>
      </div>`
    } else if (destinatario === 'Todos') {
      containerMensagem.innerHTML += `
      <div class="mensagem-normal">
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
          </div>`
    } else if (destinatario !== 'Todos' || destinatario !== 'todos') {
      containerMensagem.innerHTML += `
      <div class="mensagem-privada">
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
          </div>`
    }
  }
}

function rolagem() {
  const ultimoElemento = document.querySelector(
    '.container-mensagens > div:last-of-type'
  )
  ultimoElemento.scrollIntoView()
}

procurarMensagem()

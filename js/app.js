/* ============================================================
   APP — Ateliê Celeste
   Catálogo, carrinho e checkout.
   Depende de dados.js, carregado ANTES deste arquivo.
   ============================================================ */


/* ============================================
   1. ATALHOS E FERRAMENTAS
   ============================================ */
const $ = (seletor) => document.querySelector(seletor);

const moeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

function formatarPreco(valor) {
  return moeda.format(valor);
}

// Número do WhatsApp: 55 + DDD + número, só dígitos.
const WHATSAPP_LOJA = '5531975697984';


/* ============================================
   2. CAMINHO DAS FOTOS
   Monta "img/" + id + ".jpeg" automaticamente.
   O || devolve o primeiro valor verdadeiro: se o produto
   tiver "foto", ela ganha da regra automática.
   ============================================ */
const PASTA_FOTOS = 'img/';
const EXT_FOTO = '.jpeg';

function caminhoFoto(produto) {
  return produto.foto || PASTA_FOTOS + produto.id + EXT_FOTO;
}


/* ============================================
   3. RENDERIZAÇÃO DO CATÁLOGO
   ============================================ */
function montarCard(produto, categoria) {

  // name="op-ID" isola o grupo de radios por card.
  const opcoesHTML = produto.opcoes.map((opcao, indice) => `
    <label class="pilula">
      <input type="radio" name="op-${produto.id}" value="${opcao}"
             ${indice === 0 ? 'checked' : ''}>
      <span>${opcao}</span>
    </label>
  `).join('');

  // O círculo que no template era o número 01/02/03 virou
  // etiqueta de preço: numerar produto seria informação falsa.
  return `
    <article class="produto" data-id="${produto.id}" style="--giro:${produto.giro}deg">

      <div class="produto-preco">
        ${formatarPreco(produto.preco)}
      </div>

      <div class="produto-imagem">
        <img src="${caminhoFoto(produto)}"
             alt="${produto.nome} — bordado do Ateliê Celeste"
             loading="lazy"
             onerror="this.closest('.produto-imagem').classList.add('sem-foto'); this.remove()">
      </div>

      <div class="produto-conteudo">

        <span class="produto-tag">${categoria.titulo.toUpperCase()}</span>

        <h3>${produto.nome}</h3>

        <p>${produto.descricao}</p>

        <div class="produto-opcoes">
          <span class="produto-rotulo">${categoria.rotuloOpcao}</span>
          <div class="pilulas">${opcoesHTML}</div>
        </div>

        <button class="button primary full js-add" data-id="${produto.id}">
          Adicionar ao pedido
        </button>

      </div>

    </article>
  `;
}

function renderizarCatalogo() {
  CATEGORIAS.forEach((categoria) => {
    const secao = $('#' + categoria.id);
    if (!secao) return;   // seção não existe no HTML: pula sem quebrar

    // Variáveis CSS da seção: herdadas por todos os filhos
    secao.style.setProperty('--cor-secao', categoria.cor);
    secao.style.setProperty('--fundo-secao', categoria.fundo);

    const itens = PRODUTOS.filter((p) => p.categoria === categoria.id);

    const cardsHTML = itens
      .map((produto) => montarCard(produto, categoria))
      .join('');

    secao.innerHTML = `
      <div class="section-heading">
        <span>${categoria.etiqueta}</span>
        <h2>${categoria.titulo} <em>${categoria.destaque}</em></h2>
        <p>${categoria.chamada}</p>
      </div>

      <div class="produtos-grid">${cardsHTML}</div>
    `;
  });
}


/* ============================================
   4. ESTADO DO CARRINHO
   localStorage só guarda TEXTO: stringify na saída,
   parse na entrada. O try/catch cobre a aba anônima,
   onde o acesso pode lançar exceção.
   ============================================ */
const CHAVE_STORAGE = 'codedog:celeste:carrinho';

function carregarCarrinho() {
  try {
    const salvo = localStorage.getItem(CHAVE_STORAGE);
    return salvo ? JSON.parse(salvo) : [];
  } catch (erro) {
    console.warn('Não foi possível ler o carrinho:', erro);
    return [];
  }
}

function salvarCarrinho() {
  try {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(carrinho));
  } catch (erro) {
    console.warn('Não foi possível salvar o carrinho:', erro);
  }
}

let carrinho = carregarCarrinho();


/* ============================================
   5. OPERAÇÕES DO CARRINHO
   "linha" = id + opção. Camiseta P e camiseta G são o mesmo
   produto, mas linhas diferentes do pedido (chave composta).
   ============================================ */
function acharProduto(id) {
  return PRODUTOS.find((p) => p.id === id);
}

function adicionarAoCarrinho(idProduto, opcao) {
  const produto = acharProduto(idProduto);
  if (!produto) return;

  const linha = `${idProduto}|${opcao}`;
  const existente = carrinho.find((item) => item.linha === linha);

  if (existente) {
    existente.qtd += 1;
  } else {
    carrinho.push({
      linha: linha,
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      foto: caminhoFoto(produto),
      opcao: opcao,
      qtd: 1
    });
  }

  salvarCarrinho();
  renderizarCarrinho();
}

function alterarQtd(linha, delta) {
  const item = carrinho.find((i) => i.linha === linha);
  if (!item) return;

  item.qtd += delta;

  if (item.qtd <= 0) {
    carrinho = carrinho.filter((i) => i.linha !== linha);
  }

  salvarCarrinho();
  renderizarCarrinho();
}

function calcularTotal() {
  return carrinho.reduce((soma, item) => soma + item.preco * item.qtd, 0);
}

function contarItens() {
  return carrinho.reduce((soma, item) => soma + item.qtd, 0);
}


/* ============================================
   6. RENDERIZAÇÃO DO CARRINHO E DO RESUMO
   ============================================ */
function renderizarCarrinho() {
  const container = $('#carrinhoItens');
  if (!container) return;

  if (carrinho.length === 0) {
    container.innerHTML = `
      <p class="carrinho-vazio">
        Seu carrinho está vazio.<br>
        Escolha uma peça para bordar.
      </p>`;
  } else {
    container.innerHTML = carrinho.map((item) => `
      <div class="carrinho-item">

        <div class="carrinho-item-foto">
          <img src="${item.foto}" alt="" onerror="this.remove()">
        </div>

        <div class="carrinho-item-info">
          <p class="carrinho-item-nome">${item.nome}</p>
          <p class="carrinho-item-opcao">${item.opcao}</p>
          <p class="carrinho-item-preco">${formatarPreco(item.preco * item.qtd)}</p>
        </div>

        <div class="carrinho-item-controles">
          <button class="qtd-btn js-menos" data-linha="${item.linha}"
                  aria-label="Diminuir quantidade">&minus;</button>
          <span class="qtd-valor">${item.qtd}</span>
          <button class="qtd-btn js-mais" data-linha="${item.linha}"
                  aria-label="Aumentar quantidade">+</button>
        </div>

      </div>
    `).join('');
  }

  $('#carrinhoTotal').textContent = formatarPreco(calcularTotal());
  $('#contadorCarrinho').textContent = contarItens();
  renderizarResumo();
}

function renderizarResumo() {
  const container = $('#resumoItens');
  if (!container) return;

  if (carrinho.length === 0) {
    container.innerHTML = `
      <p class="resumo-vazio">Nenhum item selecionado ainda.</p>`;
  } else {
    container.innerHTML = carrinho.map((item) => `
      <div class="resumo-linha">
        <span>${item.qtd}× ${item.nome} <em>(${item.opcao})</em></span>
        <strong>${formatarPreco(item.preco * item.qtd)}</strong>
      </div>
    `).join('');
  }

  $('#resumoTotal').textContent = formatarPreco(calcularTotal());
}


/* ============================================
   7. ABRIR E FECHAR O PAINEL
   ============================================ */
function abrirCarrinho() {
  $('#carrinho').classList.add('ativo');
  $('#overlay').classList.add('ativo');
  $('#carrinho').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';   // trava a rolagem do fundo
}

function fecharCarrinho() {
  $('#carrinho').classList.remove('ativo');
  $('#overlay').classList.remove('ativo');
  $('#carrinho').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}


/* ============================================
   8. MENU MOBILE
   ============================================ */
const btnMenu = $('#btnMenu');
const nav = $('#nav');

btnMenu.addEventListener('click', () => {
  const aberto = nav.classList.toggle('aberto');
  btnMenu.setAttribute('aria-expanded', aberto);
  btnMenu.textContent = aberto ? '✕' : '☰';
});

// Clicar num link do menu fecha ele no celular
nav.addEventListener('click', (evento) => {
  if (evento.target.tagName === 'A') {
    nav.classList.remove('aberto');
    btnMenu.setAttribute('aria-expanded', 'false');
    btnMenu.textContent = '☰';
  }
});


/* ============================================
   9. EVENTOS
   Delegação: UM ouvinte no document em vez de um por botão.
   Obrigatório aqui, porque os botões + e − são recriados
   a cada renderização do carrinho.
   ============================================ */
$('#btnCarrinho').addEventListener('click', abrirCarrinho);
$('#btnFecharCarrinho').addEventListener('click', fecharCarrinho);
$('#overlay').addEventListener('click', fecharCarrinho);

document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape') fecharCarrinho();
});

document.addEventListener('click', (evento) => {

  // closest sobe na árvore: funciona ao clicar no texto do botão
  const btnAdd = evento.target.closest('.js-add');
  if (btnAdd) {
    const id = btnAdd.dataset.id;
    const card = btnAdd.closest('.produto');
    const selecionado = card.querySelector('input[type="radio"]:checked');
    const opcao = selecionado ? selecionado.value : '-';

    adicionarAoCarrinho(id, opcao);
    abrirCarrinho();
    return;
  }

  const btnMais = evento.target.closest('.js-mais');
  if (btnMais) {
    alterarQtd(btnMais.dataset.linha, +1);
    return;
  }

  const btnMenos = evento.target.closest('.js-menos');
  if (btnMenos) {
    alterarQtd(btnMenos.dataset.linha, -1);
    return;
  }
});


/* ============================================
   10. CHECKOUT
   ============================================ */
function mostrarErro(campo, mensagem) {
  campo.classList.add('invalido');
  campo.querySelector('.campo-erro').textContent = mensagem;
}

function limparErro(campo) {
  campo.classList.remove('invalido');
  const alvo = campo.querySelector('.campo-erro');
  if (alvo) alvo.textContent = '';
}

function validarFormulario(form) {
  let valido = true;

  form.querySelectorAll('.campo').forEach(limparErro);

  const nome = form.nome;
  if (nome.value.trim().length < 3) {
    mostrarErro(nome.closest('.campo'), 'Informe seu nome completo.');
    valido = false;
  }

  // \D = tudo que NÃO é dígito: valida sem se importar
  // com parênteses, espaços ou traço.
  const zap = form.whatsapp;
  const digitos = zap.value.replace(/\D/g, '');
  if (digitos.length < 10 || digitos.length > 11) {
    mostrarErro(zap.closest('.campo'), 'Use DDD + número. Ex.: 31 99999-9999.');
    valido = false;
  }

  const cidade = form.cidade;
  if (cidade.value.trim().length < 3) {
    mostrarErro(cidade.closest('.campo'), 'Informe cidade e estado.');
    valido = false;
  }

  return valido;
}

function montarMensagem(form) {
  const linhas = carrinho.map(
    (item) => `• ${item.qtd}x ${item.nome} (${item.opcao}) — ${formatarPreco(item.preco * item.qtd)}`
  );

  return [
    '*Novo pedido — Ateliê Celeste*',
    '',
    ...linhas,
    '',
    `*Total:* ${formatarPreco(calcularTotal())}`,
    '',
    `*Nome:* ${form.nome.value.trim()}`,
    `*WhatsApp:* ${form.whatsapp.value.trim()}`,
    `*Cidade:* ${form.cidade.value.trim()}`,
    `*Entrega:* ${form.entrega.value}`,
    `*Obs.:* ${form.observacao.value.trim() || 'nenhuma'}`
  ].join('\n');
}

$('#formPedido').addEventListener('submit', (evento) => {
  evento.preventDefault();   // impede o recarregamento da página
  const form = evento.currentTarget;

  if (carrinho.length === 0) {
    alert('Seu carrinho está vazio. Escolha ao menos uma peça.');
    return;
  }

  if (!validarFormulario(form)) return;

  // encodeURIComponent converte espaços, acentos e quebras de
  // linha para o formato seguro de URL. Sem isso o link quebra.
  const texto = encodeURIComponent(montarMensagem(form));
  window.open(`https://wa.me/${WHATSAPP_LOJA}?text=${texto}`, '_blank');
});

$('#btnFinalizar').addEventListener('click', () => {
  fecharCarrinho();
  $('#checkout').scrollIntoView({ behavior: 'smooth' });
});


/* ============================================
   11. INICIALIZAÇÃO
   Sem estas chamadas, as funções acima existem
   mas nunca são executadas.
   ============================================ */
renderizarCatalogo();
renderizarCarrinho();

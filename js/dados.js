/* ============================================================
   DADOS — Ateliê Celeste
   Só informação. Nenhuma função, nenhum clique.
   Para vender algo novo, acrescente um objeto em PRODUTOS.
   ============================================================ */


/* ============================================
   CATEGORIAS — as 4 seções do catálogo.
   id          -> precisa bater com o id da <section> no HTML
   rotuloOpcao -> "Tamanho", "Diâmetro", "Medida"
   cor         -> cor do selo e dos detalhes daquela seção
   fundo       -> fundo da seção inteira
   ============================================ */
const CATEGORIAS = [
  {
    id: 'camiseta',
    etiqueta: 'PEÇA 01',
    titulo: 'Camiseta',
    destaque: 'bordada.',
    chamada: 'Algodão penteado 30.1, bordado no peito ou nas costas.',
    rotuloOpcao: 'Tamanho',
    cor: '#ed8bbd',
    fundo: 'transparent'
  },
  {
    id: 'moletom',
    etiqueta: 'PEÇA 02',
    titulo: 'Moletom',
    destaque: 'quentinho.',
    chamada: 'Moletom flanelado, bordado resistente a lavagens.',
    rotuloOpcao: 'Tamanho',
    cor: '#9ca8d0',
    fundo: '#f1eff8'
  },

  {
    id: 'badge',
    etiqueta: 'PEÇA 04',
    titulo: 'Badge',
    destaque: 'termocolante.',
    chamada: 'Patch bordado com costas termocolantes. Passa o ferro e pronto.',
    rotuloOpcao: 'Medida',
    cor: '#f4b1d0',
    fundo: '#fdf1f7'
  }
];


/* ============================================
   PRODUTOS

   preco  -> número puro (89.90), nunca texto. É preciso somar.
   opcoes -> tamanho / diâmetro / medida, conforme a categoria.
   foto   -> OPCIONAL. Sem ele, o app monta "img/" + id + ".jpeg".
   giro   -> inclinação do card em graus. Dá o ar de colagem.
   ============================================ */
const PRODUTOS = [

  /* ---------- CAMISETAS ---------- */
  {
    id: 'cam-01',
    categoria: 'camiseta',
    nome: 'Margarida',
    preco: 89.90,
    foto: 'img/cam-01.jpg',   // exceção: este arquivo é .jpg, não .jpeg
    descricao: 'Buquê bordado no lado esquerdo do peito.',
    opcoes: ['P', 'M', 'G', 'GG'],
    giro: -1.5
  },
  {
    id: 'cam-02',
    categoria: 'camiseta',
    nome: 'Cerejeira',
    preco: 94.90,
    descricao: 'Ramo bordado em degradê, ponto cheio.',
    opcoes: ['P', 'M', 'G', 'GG'],
    giro: 1.2
  },
  {
    id: 'cam-03',
    categoria: 'camiseta',
    nome: 'Monograma',
    preco: 79.90,
    descricao: 'Sua inicial em serifa clássica. Personalizável.',
    opcoes: ['P', 'M', 'G', 'GG'],
    giro: -1
  },
  {
    id: 'cam-04',
    categoria: 'camiseta',
    nome: 'Lua Cheia',
    preco: 99.90,
    descricao: 'Fases da lua bordadas em linha metálica.',
    opcoes: ['P', 'M', 'G', 'GG'],
    giro: 1.5
  },

  /* ---------- MOLETONS ---------- */
  {
    id: 'mol-01',
    categoria: 'moletom',
    nome: 'Girassol',
    preco: 189.90,
    descricao: 'Bordado grande nas costas, gola careca.',
    opcoes: ['P', 'M', 'G', 'GG'],
    giro: 1.2
  },
  {
    id: 'mol-02',
    categoria: 'moletom',
    nome: 'Trilha',
    preco: 199.90,
    descricao: 'Paisagem em ponto matiz no peito. Com capuz.',
    opcoes: ['M', 'G', 'GG'],
    giro: -1.5
  },
  {
    id: 'mol-03',
    categoria: 'moletom',
    nome: 'Coração Vintage',
    preco: 179.90,
    descricao: 'Coração com fita bordada, estilo anos 90.',
    opcoes: ['P', 'M', 'G'],
    giro: 1
  },

  /* ---------- BADGES ---------- */
  {
    id: 'bad-01',
    categoria: 'badge',
    nome: 'Estrela Y2K',
    preco: 24.90,
    descricao: 'Patch com contorno em cetim brilhante.',
    opcoes: ['5 cm', '8 cm'],
    giro: 1.2
  },
  {
    id: 'bad-02',
    categoria: 'badge',
    nome: 'Cogumelo',
    preco: 27.90,
    descricao: 'Bordado denso, ideal para jaqueta jeans.',
    opcoes: ['5 cm', '8 cm'],
    giro: -1.5
  },
  {
    id: 'bad-03',
    categoria: 'badge',
    nome: 'Inicial',
    preco: 19.90,
    descricao: 'Letra bordada em bloco. Escolha no checkout.',
    opcoes: ['4 cm', '6 cm'],
    giro: 1
  },
  {
    id: 'bad-04',
    categoria: 'badge',
    nome: 'Coraçãozinho',
    preco: 21.90,
    descricao: 'Mini patch, vem em par.',
    opcoes: ['3 cm', '5 cm'],
    giro: -1
  }

];

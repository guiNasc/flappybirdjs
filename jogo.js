
const som_HIT = new Audio();
som_HIT.src = './efeitos/hit.wav';

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');
let frames = 0;

const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  desenhar() {
    contexto.fillStyle = '#70c5ce';
    contexto.fillRect(0,0, canvas.width, canvas.height);

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      planoDeFundo.x, planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura
    );

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura
    );
  }

};

function criarChao() {
  const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    atualizar() {
      const movimentoDoChao = 1;
      const repeteEm = chao.largura / 2 ;
      const movimentacao = chao.x - movimentoDoChao;

      // console.log('[chao.x]', chao.x);
      // console.log('[repeteEm]', repeteEm);
      // console.log('[movimentacao]', movimentacao % repeteEm);

      chao.x = movimentacao % repeteEm;

    },
    desenhar() {
      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        chao.x, chao.y,
        chao.largura, chao.altura
      );
  
      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        (chao.x + chao.largura), chao.y,
        chao.largura, chao.altura
      );
    }
  
  };
  return chao;  
}

function fazColisao(flappyBird, chao) {
  const flappyBirdY = flappyBird.y + flappyBird.altura;
  const chaoY = chao.y;

  if(flappyBirdY >= chaoY) {
    return true;
  }

  return false;
}

function criarFlappyBird() {
  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x:10,
    y: 50,
    gravidade: 0.25,
    velocidade: 0,
    atualizar() {
      if(fazColisao(flappyBird, globais.chao)) {
        som_HIT.play();
        setTimeout(() => {
          mudarTela(Telas.INICIO);
        }, 500);
        return;
      }
      flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
      flappyBird.y = flappyBird.y + flappyBird.velocidade;
    },
    pulo: 4.6,
    pular() {
      flappyBird.velocidade = - flappyBird.pulo;
    },
    movimentos: [
      {spriteX: 0, spriteY: 0},
      {spriteX: 0, spriteY: 26},
      {spriteX: 0, spriteY: 52}
    ],
    frameAtual: 0,
    atuarlizarFrameAtual() {
      const intervaloDeFrames = 10;
      const passouOIntervalo = frames % intervaloDeFrames === 0;

      if(passouOIntervalo){
        const baseDoIncremento = 1;
        const incremento = baseDoIncremento + flappyBird.frameAtual;
        const baseRepeticao = flappyBird.movimentos.length;
        flappyBird.frameAtual = incremento % baseRepeticao;
      }
    },

    desenhar() {
      flappyBird.atuarlizarFrameAtual();
      const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];
      contexto.drawImage(
        sprites,
        spriteX, spriteY,
        flappyBird.largura, flappyBird.altura,
        flappyBird.x, flappyBird.y,
        flappyBird.largura, flappyBird.altura
      );
    }
  };
  return flappyBird;
}



const mensagemGetReady = {
  spriteX: 134,
  spriteY: 0,
  largura: 174,
  altura: 152,
  x: (canvas.width / 2) - 174 / 2,
  y: 50,
  desenhar() {
    contexto.drawImage(
      sprites,
      mensagemGetReady.spriteX, mensagemGetReady.spriteY,
      mensagemGetReady.largura, mensagemGetReady.altura,
      mensagemGetReady.x, mensagemGetReady.y,
      mensagemGetReady.largura, mensagemGetReady.altura
    );
  }
};

const globais = {};
let telaAtiva = {};
function mudarTela(novaTela) {
  telaAtiva = novaTela;

  if(telaAtiva.inicializa) {
    telaAtiva.inicializa();
  }
}

const Telas = {
  INICIO: {
    inicializa() {
      globais.flappyBird = criarFlappyBird();
      globais.chao = criarChao();
    },

    desenhar() {
      planoDeFundo.desenhar();
      globais.chao.desenhar();
      globais.flappyBird.desenhar();
      mensagemGetReady.desenhar();
    },
    click() {
      mudarTela(Telas.JOGO);
    },
    atualizar() {
      globais.chao.atualizar();
    }
  }
};

Telas.JOGO = {
  desenhar() {
    planoDeFundo.desenhar();
    globais.chao.desenhar();
    globais.flappyBird.desenhar();
  },
  click() {
    globais.flappyBird.pular();
  },
  atualizar() {
    globais.flappyBird.atualizar();
  }
};


function loop() {
  telaAtiva.desenhar();
  telaAtiva.atualizar();
  frames = frames +1;
  requestAnimationFrame(loop);
}

window.addEventListener('click', function(){
  if(telaAtiva.click) {
    telaAtiva.click();
  }
});

mudarTela(Telas.INICIO);
loop();
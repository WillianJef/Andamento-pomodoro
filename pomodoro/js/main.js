let worktitle = document.getElementById('work');
let breaktitle = document.getElementById('break');

let workTime = 40;
let breakTime = 5;

let workMinutos = workTime;
let breakMinutos = breakTime;
let secunds = "00";
let breackwork = 0;
let intervalId; // Variável para armazenar a referência do intervalo

window.onload = () => {
    document.getElementById('minutos').innerHTML = workTime;
    document.getElementById('secunds').innerHTML = secunds;

    worktitle.classList.add('botoes');

    document.getElementById('start').addEventListener('click', start);
    document.getElementById('reset').addEventListener('click', reset);

}

//FIM DO CABEÇALHO---------------------------------


//INICÍO DOS BOTÕES--------------------------------

function start() {
    document.getElementById('start').style.display = "none";
    document.getElementById('reset').style.display = "block";
    let workMinutos = workTime - 1;
    let breakMinutos = breakTime - 1;

    breackwork = 0;
    secunds = 59;
    let Timefunction = () => {
        document.getElementById('minutos').innerHTML = workMinutos;
        document.getElementById('secunds').innerHTML = secunds;
        secunds = secunds - 1;

        if (secunds === 0) {
            workMinutos = workMinutos - 1;

            if (workMinutos === -1) {
                if (breackwork % 2 === 0) {
                    workMinutos = breakMinutos;

                    worktitle.classList.remove('botoes')
                    breaktitle.classList.add('botoes')

                    breackwork++;
                } else {
                    workMinutos = workTime;
                    worktitle.classList.add('botoes')
                    breaktitle.classList.remove('botoes')
                    breackwork++;

                }

            }
            secunds = 59;
        }
    }
    setInterval(Timefunction, 1000);
};

let btnMenu = document.getElementById('btnMenu');
let menu = document.getElementById('sites-bloqueados');
let btnfechar = document.getElementById('fechar')
let bloqueio = document.getElementById('bloqueio');
let abrir = document.querySelector('.buscar-box');
let exit = document.querySelector('.exit');
const pattern =
    /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;

btnMenu.addEventListener('click', () => {
    menu.classList.add('abrir-menu')
})
btnfechar.addEventListener('click', () => {
    menu.classList.remove('abrir-menu')
});
bloqueio.addEventListener('click', (event) => {
    event.stopPropagation();
    abrir.classList.add('ativar')
});
menu.addEventListener('click', (event) => {
    event.stopPropagation();
});
exit.addEventListener('click', (event) => {
    event.stopPropagation();
    abrir.classList.remove('ativar')
});
//FIM DA CLASSE MENU//

const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
    input.addEventListener('blur', (evento) => {
        valida(evento.target)
    })
});
function valida(input) {
    const tipodeinput = input.dataset.tipo;
    if (validadores[tipodeinput]) {
        validadores[tipodeinput](input)
    }
    if(input.validity.valid){
        input.parentElement.classList.remove('verificacao-input')
     }else{(input.validity.valid)
       input.parentElement.classList.add('verificacao-input')
    };
     
}

const validadores = {
    verificacao: input => validaverificacao(input)
}
/*
document.getElementById('buscas').addEventListener('click', function () {
    var url = document.getElementById('buscas').value;
    if (!url) {
        return;
    }
    var overlay = document.getElementById('overlay');
    var iframe = document.getElementById('iframe');
    iframe.src = url;
    overlay.style.display = 'flex';

    // Defina o tempo de bloqueio em milissegundos (exemplo: 5000ms = 5 segundos)
    var tempoBloqueio = 5000;

    setTimeout(function () {
        overlay.style.display = 'none';
    },
        tempoBloqueio);
    const tiposDeErro = [
        'valueMissing',
    ]
});*/
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const redis = require('redis');
const util = require('util');

// Cria o cliente Redis
const client = redis.createClient();
client.get = util.promisify(client.get);
client.set = util.promisify(client.set);

// Configuração do servidor Express
const app = express();
const PORT = 3000;

// Função de middleware para verificar se a URL está bloqueada
async function blockMiddleware(req, res, next) {
    const site = req.headers.host;
    const isBlocked = await client.get(site);

    if (isBlocked) {
        res.status(403).send('Este site está bloqueado no momento.');
    } else {
        next();
    }
}

// Adiciona o middleware de bloqueio
app.use(blockMiddleware);

// Configura o proxy reverso
app.use('/', createProxyMiddleware({
    target: 'http://originalsite.com', // Substitua pelo site que você deseja bloquear
    changeOrigin: true
}));

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});

// Função para bloquear um site por um período de tempo
async function blockSite(site, duration) {
    await client.set(site, 'blocked', 'EX', duration);
}

// Exemplo de uso: bloqueia "originalsite.com" por 25 minutos (1500 segundos)
blockSite('originalsite.com', 1500);

const computeResult = document.currentScript.getAttribute('computeResult');
const h1 = document.getElementById('h1');
const h2 = document.getElementById('h2');

if(computeResult == 2) {
    h1.innerText = 'Seu voto já foi computado!';
} else if(computeResult == 3) {
    h1.innerText = 'Ocorreu um erro durante a computação do voto :(';
    h2.innerText = 'Recarregue a página e tente novamente.'
}
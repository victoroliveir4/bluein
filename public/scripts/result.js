const result = document.currentScript.getAttribute('result');
const totalVotesElement = document.getElementById('totalVotes');
const jardinVotesElement = document.getElementById('jardinVotes');
const evianVotesElement = document.getElementById('evianVotes');
const olimpiaVotesElement = document.getElementById('olimpiaVotes');
const jardinProgressElement = document.getElementById('jardinProgress');
const evianProgressElement = document.getElementById('evianProgress');
const olimpiaProgressElement = document.getElementById('olimpiaProgress');

const resultJson = JSON.parse(result);
console.log(JSON.parse(result));
const { jardinVotes, evianVotes, olimpiaVotes, totalVotes, namesWhoVoted} = resultJson;

totalVotesElement.innerText = 'Total: ' + totalVotes + (totalVotes != 1 ? ' votos' : ' voto');
jardinVotesElement.innerText = jardinVotes + (jardinVotes != 1 ? ' votos' : ' voto');
evianVotesElement.innerText = evianVotes + (evianVotes != 1 ? ' votos' : ' voto');
olimpiaVotesElement.innerText = olimpiaVotes + (olimpiaVotes != 1 ? ' votos' : ' voto');

if(totalVotes != 0) {
    jardinProgressElement.style = 'width: ' + (jardinVotes/totalVotes)*100  + '%;';
    evianProgressElement.style = 'width: ' + (evianVotes/totalVotes)*100  + '%;';
    olimpiaProgressElement.style = 'width: ' + (olimpiaVotes/totalVotes)*100  + '%;';
}
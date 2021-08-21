const resultData = JSON.parse(document.currentScript.getAttribute('resultData'));
const totalVotesElement = document.getElementById('totalVotes');
const jardinVotesElement = document.getElementById('jardinVotes');
const evianVotesElement = document.getElementById('evianVotes');
const olimpiaVotesElement = document.getElementById('olimpiaVotes');
const jardinProgressElement = document.getElementById('jardinProgress');
const evianProgressElement = document.getElementById('evianProgress');
const olimpiaProgressElement = document.getElementById('olimpiaProgress');
const tableWhoVoted = document.getElementById("whoVoted");
const searchInput = document.getElementById("searchInput");
const tr = tableWhoVoted.getElementsByTagName("tr");

const { jardinVotes, evianVotes, olimpiaVotes, totalVotes, whoVoted} = resultData;

totalVotesElement.innerText = 'Total: ' + totalVotes + (totalVotes != 1 ? ' votos' : ' voto');
jardinVotesElement.innerText = jardinVotes + (jardinVotes != 1 ? ' votos' : ' voto');
evianVotesElement.innerText = evianVotes + (evianVotes != 1 ? ' votos' : ' voto');
olimpiaVotesElement.innerText = olimpiaVotes + (olimpiaVotes != 1 ? ' votos' : ' voto');

// Caso o total de votos seja diferente de zero, preenche os dados do resultado
if(totalVotes != 0) {
    jardinProgressElement.style = 'width: ' + (jardinVotes/totalVotes)*100  + '%;';
    evianProgressElement.style = 'width: ' + (evianVotes/totalVotes)*100  + '%;';
    olimpiaProgressElement.style = 'width: ' + (olimpiaVotes/totalVotes)*100  + '%;';
    loadTableData();
}

// Quando algo é digitado no campo de pesquisa da tabela, chama a função que filtra os dados
searchInput.onkeyup = function () {
	searchFunction();
}

// Carrega as informações dos usuários que já votaram na tabela
function loadTableData() {
    let cont = 1;
    whoVoted.forEach((item) => {
        if(item.name.length > 40) item.name = item.name.substring(0, 40) + '...';
        let row = tableWhoVoted.insertRow();
        row.insertCell(0).innerText = cont;
        row.insertCell(1).innerText = item.name;
        row.insertCell(2).innerText = item.date;
        cont++;
    });
}

// Filtra os nomes e datas da tabela de usuários, de acordo com o campo de pesquisa
function searchFunction() {
    let filter = searchInput.value.toUpperCase();
    for (i = 0; i < tr.length; i++) {
        let name = tr[i].getElementsByTagName("td")[1];
        let date = tr[i].getElementsByTagName("td")[2];
        if (name || date) {
            let nameValue = name.textContent || name.innerText;
            let dateValue = date.textContent || date.innerText;
            if (nameValue.toUpperCase().indexOf(filter) > -1 || dateValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}
const userEmail = document.currentScript.getAttribute('userEmail');
const jardinButton = document.getElementById('jardinButton');
const evianButton = document.getElementById('evianButton');
const olimpiaButton = document.getElementById('olimpiaButton');

jardinButton.onclick = function () {
	// Usuário votou no empreendimento 1 - Le Jardin
	postRequest({userEmail: userEmail, enterpriseId: 1});
}

evianButton.onclick = function () {
	// Usuário votou no empreendimento 2 - Evian
	postRequest({userEmail: userEmail, enterpriseId: 2});
}

olimpiaButton.onclick = function () {
	// Usuário votou no empreendimento 3 - Olímpia Thermas
	postRequest({userEmail: userEmail, enterpriseId: 3});
}

// Requisição POST
function postRequest(params) {
	const form = document.createElement('form');
	form.method = 'POST';
	form.action = '/vote';
  
	for (const key in params) {
	  if (params.hasOwnProperty(key)) {
		const hiddenField = document.createElement('input');
		hiddenField.type = 'hidden';
		hiddenField.name = key;
		hiddenField.value = params[key];
		form.appendChild(hiddenField);
	  }
	}
	document.body.appendChild(form);
	form.submit();
  }
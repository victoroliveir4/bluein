const userEmail = document.currentScript.getAttribute('userEmail');
const jardinButton = document.getElementById('jardinButton');
const evianButton = document.getElementById('evianButton');
const olimpiaButton = document.getElementById('olimpiaButton');

jardinButton.onclick = function () {
	postRequest(1);
}

evianButton.onclick = function () {
	postRequest(2);
}

olimpiaButton.onclick = function () {
	postRequest(3);
}

function postRequest(enterpriseId) {
	var http = new XMLHttpRequest();
	var url = 'http://localhost:3000/vote';
	var params = encodeURIComponent('userEmail') + '=' + encodeURIComponent(userEmail) + '&' +
				encodeURIComponent('enterpriseId') + '=' + encodeURIComponent(enterpriseId);
	http.open('POST', url, true);
    http.withCredentials = true;

	http.onreadystatechange = function() {
		if(http.readyState == 4) {
			if(http.status == 200) {
				window.location.href = '/computed';
			} else {
				window.location.href = '/logout';
			}
		}
	}
	//Send the proper header information along with the request
	http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	http.send(params);
}
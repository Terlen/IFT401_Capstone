// This script initiates Facebook login and handles the GET request from the Facebook GraphAPI once the user's access token is recovered.
window.onload = function() {
	// Chrome extension security policy prevents any inline scripts in HTML, so all listeners and triggers must be written in the script itself.
	document.getElementById("Login").onclick = function() {
		/* This url is a Facebook OAuth endpoint that generates an access token for the user with the desired permissions. In this request, scope defines
		   the rights requested by the application. We currently generate a token that allows access to email and public_profile information.
		   The redirect_uri is the page that the user is redirected to after authentication. In our case, we are using a page designed by Facebook for 
		   desktop applications which don't have a server to host a landing page. */
		// Old storage data is cleared for a new login.
		chrome.storage.sync.remove(['accessToken','userdata','userpic']);
		var win = window.open("https://www.facebook.com/v2.8/dialog/oauth?client_id=284227568629145&response_type=token&scope=public_profile,user_friends&redirect_uri=https://www.facebook.com/connect/login_success.html");
	};	
};
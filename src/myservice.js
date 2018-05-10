export default function(wUrl){

	return new Promise( (resolve, reject) => {
			let req = new XMLHttpRequest();
			req.onload = () => {
				resolve(req.response);
			}
			req.onerror = () => {
				reject(req.statusText);
			}
			req.open("GET", wUrl, true);
			req.responseType = "json";
			req.send();
		} );

}
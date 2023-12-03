/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request) {
		let endpoint = "https://api.waqi.info/feed/geo:";
		const token = "d6eb5e79aee9760203632b1f71cfdd760c0b1655";
		let html_style = `body{padding:6em; font-family: sans-serif;} h1{color:#f6821f}`;

    	let html_content = "<h1>Weather 🌦</h1>";

		const latitude = request.cf.latitude;
		const longitude = request.cf.longitude;
		endpoint += `${latitude};${longitude}/?token=${token}`;
		const init = {
			headers: {
				"content-type": "application/json;charset=UTF-8",
			},
		};

		const response = await fetch(endpoint, init);
		const content = await response.json();
	
		html_content += `#loc @ ${latitude},${longitude}.</p>`;
		html_content += `<p>#data @ <a href="${content.data.city.url}">${content.data.city.name}</a>:</p>`;
		html_content += `<p>_AQI: ${content.data.aqi}</p>`;
		html_content += `<p>_N02: ${content.data.iaqi.no2?.v}</p>`;
		html_content += `<p>_O3:  ${content.data.iaqi.o3?.v}</p>`;
		html_content += `<p>_TMP: ${content.data.iaqi.t?.v}°C</p>`;
	
		let html = `
		  <!DOCTYPE html>
		  <head>
			<title>unhomed friendly?</title>
		  </head>
		  <body>
			<style>${html_style}</style>
			<div id="container">
			${html_content}
			</div>
		  </body>`;
	
		return new Response(html, {
		  headers: {
			"content-type": "text/html;charset=UTF-8",
		  },
		});
	  },
	};
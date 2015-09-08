angular.module('isgh.Constant', []).constant("Constant", {
	
	url_wsapp: "http://177.136.74.42/appserver/", 
	url_intranet: "http://177.136.74.42/intranet/",
	url_site: "http://177.136.74.42/site/",
	url_procseletivo: "http://177.136.74.42/processos_seletivos/",
	
	database: { 
		name: 'isgh.db',
		tables: {
			news: {
				name: 'news',
				columns: [
					{ name: 'id', type: 'integer primary key' },
					{ name: 'title', type: 'text' },
					{ name: 'images', type: 'text' },
					{ name: 'created', type: 'numeric' },
					{ name: 'introtext', type: 'text' },
					{ name: 'striptext', type: 'text' },
					{ name: 'category', type: 'text' },
					{ name: 'unit', type: 'text' }
				]	
			},
			lecturesevents: {
				name: 'lecturesevents',
				columns: [
					{ name: 'id', type: 'integer primary key' },
					{ name: 'title', type: 'text' },
					{ name: 'image', type: 'text' },
					{ name: 'thumbnail', type: 'text' },
					{ name: 'location', type: 'text' },
					{ name: 'location_alias', type: 'text' },
					{ name: 'register_opened', type: 'numeric' },
					{ name: 'register_closed', type: 'numeric' },
					{ name: 'event_closed', type: 'numeric' },
					{ name: 'filename', type: 'text' },
					{ name: 'form_date_up', type: 'text' },
					{ name: 'form_date_down', type: 'text' },
					{ name: 'form_workload', type: 'text' },
					{ name: 'form_location', type: 'text' },
					{ name: 'form_speaker', type: 'text' },
					{ name: 'form_audience', type: 'text' },
					{ name: 'form_investment', type: 'text' },
					{ name: 'form_content_1', type: 'text' },
					{ name: 'form_content_2', type: 'text' },
					{ name: 'form_content_3', type: 'text' },
					{ name: 'form_content_4', type: 'text' },
					{ name: 'form_link', type: 'text' },
					{ name: 'register_link', type: 'text' },
					{ name: 'status', type: 'text' }
					
				]
			}
		}
	}
	
});

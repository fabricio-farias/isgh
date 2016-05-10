angular.module('isgh.Constant', [])
    .constant(
        "Constant",
        {

            url_wsapp: "http://177.136.74.42/appWSisgh/",
            url_intranet: "http://177.136.74.42/intranet/",
            url_site: "http://177.136.74.42/",
            url_procseletivo: "http://177.136.74.42/processos_seletivos/",

            // url_wsapp: "http://127.0.0.1/build/appWSisgh/", 
            // url_intranet: "http://127.0.0.1/build/intranet/",
            // url_site: "http://127.0.0.1/build/site/",
            // url_procseletivo: "http://127.0.0.1/build/processos_seletivos/",

            ionInfiniteScrollConfig: { distance: '1%', interval: '15' },
            backButton: (ionic.Platform.isAndroid()) ? 'ion-android-arrow-back' : 'ion-ios-arrow-back',
            closeButton: (ionic.Platform.isAndroid()) ? 'ion-android-close' : 'ion-ios-close-empty',
            procseletsTitles: ['', 'Inscrições Abertas', 'Em Andamento', 'Processos Finalizados'],
            emails: {
                cursos: { to: "cepep@isgh.org.br", cc: "contato@isgh.org.br" }
            },

            database: {
                name: 'isgh.db',
                tables: {
                    news: {
                        name: 'news',
                        indexes: [
                            'id',
                            'title',
                            'created',
                            'striptext',
                            'unit'
                        ],
                        columns: [
                            'id integer primary key',
                            'title text',
                            'images text',
                            'created numeric',
                            'introtext text',
                            'striptext text',
                            'category text',
                            'unit text',
                            'hits integer',
                            'liked_sum integer',
                            'unliked_sum integer'
                        ]
                    },
                    lectures: {
                        name: 'lectures',
                        indexes: [
                            'id',
                            'title',
                            'location'
                        ],
                        columns: [
                            'id integer primary key',
                            'title text',
                            'image text',
                            'thumbnail text',
                            'location text',
                            'location_alias text',
                            'date numeric',
                            'filename text',
                            'form_date_up text',
                            'form_date_down text',
                            'form_workload text',
                            'form_location text',
                            'form_speaker text',
                            'form_audience text',
                            'form_investment text',
                            'form_content_1 text',
                            'form_content_2 text',
                            'form_content_3 text',
                            'form_content_4 text',
                            'form_link text',
                            'register_link text',
                            'register_planning integer',
                            'status text',
                            'widgetkit_module integer',
                            'widgetkit text'
                        ]
                    },
                    events: {
                        name: 'events',
                        indexes: [
                            'id',
                            'title',
                            'unit'
                        ],
                        columns: [
                            'id integer primary key',
                            'title text',
                            'unit text',
                            'date numeric',
                            'form_date_up text',
                            'form_date_down text',
                            'form_workload text',
                            'form_location text',
                            'form_speaker text',
                            'form_audience text',
                            'form_investment text',
                            'form_link text',
                            'introtext text'
                        ]
                    },
                    procselets: {
                        name: 'procselets',
                        indexes: [
                            'catid',
                            'category',
                            'unit'
                        ],
                        columns: [
                            'catid integer primary key',
                            'code text',
                            'category text',
                            'description text',
                            'file text',
                            'unid integer',
                            'unit text',
                            'status integer',
                            'created numeric',
                            'files text'
                        ]
                    },
                    birthdays: {
                        name: 'birthdays',
                        indexes: [
                            'num_matricula',
                            'dsc_nome',
                            'dsc_filial'
                        ],
                        columns: [
                            'num_matricula integer primary key',
                            'dsc_nome text',
                            'dsc_funcao text',
                            'dsc_setor text',
                            'dsc_filial text',
                            'dat_nasc text'
                        ]
                    }
                }
            }

        });
/**
 * Déclaration du dictionnaire des rubriques, formulaires et vues de l'application
 * id: toujours en majuscule
 */
module.exports = {
    application: {
        title: 'ATOMIUM',
        desc: 'CRUD with Dictionary',
        url: 'https://github.com/pbillerot/atomium',
        copyright: 'ATOMIUM 2016 - version 0.1.0',
    },
    tables: {
        USERS: {
            basename: '/home/billerot/conf/acteur/tex.sqlite',
            key: 'IDUSER',
            rubs: {
                IDUSER: {
                    label_long: 'COMPTE',
                    label_short: 'COMPTE',
                    type: 'text',
                    length: 9,
                    formatter: null,
                    required: true,
                    default: '',
                    pattern: "[A-Z,a-z]*",
                    error: "Obligatoire",
                    tooltip: null,
                    list: null, //val1,val2
                    options: ''
                },
                NOMUSER: {
                    label_long: 'NOM ou PSEUDO',
                    label_short: 'NOM',
                    type: 'text',
                    length: 70,
                    form: 'FORM_1',
                    formatter: null,
                    default: '',
                    pattern: null,
                    tooltip: 'Nom ou le pseudo du compte',
                    list: null, //val1,val2
                    options: ''
                },
                EMAIL: {
                    label_long: 'EMAIL',
                    label_short: 'EMAIL',
                    type: 'email',
                    length: 70,
                    formatter: null,
                    default: '',
                    pattern: null,
                    error: null,
                    tooltip: 'Email du compte',
                    list: null, //val1,val2
                    options: ''
                },
                _BTN: {
                    label_long: '',
                    label_short: 'BTN',
                    type: 'button',
                    length: 20,
                    formatter: null,
                    form: 'FORM_2',
                    default: '',
                    pattern: null,
                    error: null,
                    tooltip: null,
                    list: null,
                    options: ''
                }
            },
            views: {
                VUE_1: {
                    title: 'LISTE DES COMPTES',
                    form_add: 'FORM_1',
                    form_update: 'FORM_1',
                    form_delete: null,
                    rubs: {
                        IDUSER: {},
                        NOMUSER: {},
                        EMAIL: {},
                        _BTN: {}
                    }
                },
                VUE_2: {
                    title: 'LISTE DES UTILISATEURS',
                    form_add: 'FORM_2',
                    form_update: 'FORM_2',
                    form_delete: null,
                    rubs: {
                        IDUSER: {},
                        NOMUSER: {}
                    }
                }
            },
            forms: {
                FORM_1: {
                    title: 'COMPTE',
                    rubs: {
                        IDUSER: {},
                        NOMUSER: {},
                        EMAIL: {},
                    }
                },
                FORM_2: {
                    title: 'EMAIL',
                    rubs: {
                        IDUSER: {},
                        EMAIL: {},
                    }
                }

            }
        },
        TEX: {
            basename: '/home/billerot/conf/acteur/tex.sqlite',
            key: 'cleunique',
            rubs: {
                cleunique: {
                    label_long: 'ID',
                    label_short: 'ID',
                    type: 'text',
                    length: 23,
                    formatter: null,
                    required: true,
                    default: '',
                    pattern: "[A-Z,a-z,0-9_]*",
                    error: "Obligatoire",
                    tooltip: null,
                    list: null, //val1,val2
                    options: ''
                },
                nom: {
                    label_long: 'NOM ou PSEUDO',
                    label_short: 'NOM',
                    type: 'text',
                    length: 70,
                    formatter: null,
                    default: '',
                    pattern: null,
                    tooltip: 'Nom ou le pseudo du compte',
                    list: null, //val1,val2
                    options: ''
                },
                email: {
                    label_long: 'EMAIL',
                    label_short: 'EMAIL',
                    type: 'email',
                    length: 70,
                    formatter: null,
                    default: '',
                    pattern: null,
                    error: null,
                    tooltip: 'Email du compte',
                    list: null, //val1,val2
                    options: ''
                },
                _btn: {
                    label_long: '',
                    label_short: 'BTN',
                    type: 'button',
                    length: 20,
                    formatter: null,
                    form: 'F_2',
                    default: '',
                    pattern: null,
                    error: null,
                    tooltip: null,
                    list: null,
                    options: ''
                }
            },
            views: {
                V_1: {
                    title: 'TEX COMPTES',
                    form_add: 'F_1',
                    form_update: 'F_1',
                    form_delete: null,
                    rubs: {
                        cleunique: {},
                        nom: {},
                        email: {},
                        _btn: {}
                    }
                },
                V_2: {
                    title: 'TEX EMAIL',
                    form_add: 'F_2',
                    form_update: 'F_2',
                    form_delete: null,
                    rubs: {
                        cleunique: {},
                        email: {}
                    }
                }
            },
            forms: {
                F_1: {
                    title: 'TEX COMPTE',
                    rubs: {
                        cleunique: {},
                        nom: {},
                        email: {},
                    }
                },
                F_2: {
                    title: 'TEX EMAIL',
                    rubs: {
                        cleunique: {},
                        email: {},
                    }
                }

            }
        }
    }
} // end exports

/**
 * Fonction pour récupérer l'élément id d'une branche
 */
function getObj(objs, id) {
    var response = null
    objs.forEach((obj) => {
        if (obj.id == id) {
            response = obj
        }
    });
    if (response == null) throw new Error('Element "' + id + '" not found')
    //console.dir(response)
    return response;
}
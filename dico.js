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
                    required: true,
                    min: null,
                    max: null,
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
                    min: null,
                    max: null,
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
                    min: null,
                    max: null,
                    default: '',
                    pattern: null,
                    error: null,
                    tooltip: 'Email du compte',
                    list: null, //val1,val2
                    options: ''
                }

            },
            views: {
                VUE_1: {
                    id: 'VUE_1',
                    title: 'LISTE DES COMPTES',
                    rubs: {
                        IDUSER: {
                        },
                        NOMUSER: {
                        },
                        EMAIL: {
                        }
                    }
                },
                VUE_2: {
                    title: 'LISTE DES UTILISATEURS',
                    rubs: {
                        NOMUSER: {
                        },
                        IDUSER: {
                        }
                    }
                }
            },
            forms: {
                FORM_1: {
                    title: 'COMPTE',
                    rubs: {
                        IDUSER: {
                        },
                        NOMUSER: {
                        },
                        EMAIL: {
                        }
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
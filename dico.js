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
            rubs: {
                IDUSER: {
                    is_key: true,
                    label_long: 'COMPTE',
                    label_short: 'COMPTE',
                    type: 'text', // type HTML5
                    len: 30,
                    min: null,
                    max: null,
                    defaut: '',
                    placeholder: 'compte id',
                    pattern: null,
                    tooltip: null,
                    list: null, //val1,val2
                    options: ''
                },
                NOMUSER: {
                    is_key: false,
                    label_long: 'NOM ou PSEUDO',
                    label_short: 'NOM',
                    type: 'text', // type HTML5
                    len: 70,
                    min: null,
                    max: null,
                    defaut: '',
                    placeholder: 'nom ou psudo',
                    pattern: null,
                    tooltip: 'Nom ou le pseudo du compte',
                    list: null, //val1,val2
                    options: ''
                },
                EMAIL: {
                    is_key: false,
                    label_long: 'EMAIL',
                    label_short: 'EMAIL',
                    type: 'email', // type HTML5
                    len: 70,
                    min: null,
                    max: null,
                    defaut: '',
                    placeholder: 'email@info.net',
                    pattern: null,
                    tooltip: 'Email du compte',
                    list: null, //val1,val2
                    options: ''
                }

            },
            views: {
                VUE_1: {
                    id: 'VUE_1',
                    title: 'LISTE DES COMPTES',
                    form_ajout: 'FORM_1',
                    form_maj: 'FORM_1',
                    form_view: 'FORM_1',
                    form_suppr: null,
                    options: null,
                    select: null,
                    securite: null,
                    help: 'help.md',
                    cols: {
                        IDUSER: {
                            tri: null,
                            is_hidden: false,
                            is_rupture: false,
                            is_cumul: false,
                            is_filtre: true,
                            filtre: null
                        },
                        NOMUSER: {
                            tri: 'A',
                            is_hidden: false,
                            is_rupture: false,
                            is_cumul: false,
                            is_filtre: true,
                            filtre: null
                        },
                        EMAIL: {
                            tri: null,
                            is_hidden: false,
                            is_rupture: false,
                            is_cumul: false,
                            is_filtre: true,
                            filtre: null
                        }
                    }
                },
                VUE_2: {
                    title: 'LISTE DES UTILISATEURS',
                    form_ajout: 'FORM_1',
                    form_maj: 'FORM_1',
                    form_view: 'FORM_1',
                    form_suppr: null,
                    options: null,
                    select: null,
                    securite: null,
                    help: 'help.md',
                    cols: {
                        NOMUSER: {
                            tri: 'A',
                            is_hidden: false,
                            is_rupture: false,
                            is_cumul: false,
                            is_filtre: true,
                            filtre: null
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
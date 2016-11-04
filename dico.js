module.exports = {
    application: {
        name: 'Gestionnaire de configuration',
        desc: 'Editeur des fichiers système',
        url: 'https://github.com/pbillerot/atomium',
        menuTitle: 'Fichiers'
    },

    rubriques: [
        {
            id_rubrique: 'pseudo',
            is_key: true,
            label_long: 'Pseudo',
            label_short: 'Pseudo',
            type: 'text', // type HTML5
            len: 30,
            min: null,
            max: null,
            defaut: '',
            placeholder: 'pseudo',
            pattern: null,
            help: 'Indiquer le pseudo',
            list: null, //val1,val2
            options: ''
        },
        {
            id_rubrique: 'email',
            is_key: true,
            label_long: 'Email',
            label_short: 'Email',
            type: 'email', // type HTML5
            len: 70,
            min: null,
            max: null,
            defaut: '',
            placeholder: 'nom@fournisseur.ext',
            pattern: null,
            help: 'Indiquer le nom',
            list: null, //val1,val2
            options: ''
        }
    ],
    formulaires: [
        {
            id_formulaire: 'form_1',
            label: 'Compte',
            options: null,
            script: null,
            securite: null,
            help: 'help.md',
            champs: [
                {
                    id_rubrique: 'nom',
                    is_maj: true,
                    is_protege: false,
                    is_hidden: false,
                    is_meme_ligne: false
                },
                {
                    id_rubrique: 'pseudo',
                    is_maj: true,
                    is_protege: false,
                    is_hidden: false,
                    is_meme_ligne: false
                }
            ]
        }
    ],
    vues: [
        {
            id_vue: 'vue_1',
            label: 'Compte',
            form_ajout: 'form_1',
            form_maj: 'form_1',
            form_view: 'form_1',
            form_suppr: null,
            options: null,
            select: null,
            securite: null,
            help: 'help.md',
            colonnes: [
                {
                    id_rubrique: 'nom',
                    tri: 'A',
                    is_hidden: false,
                    is_rupture: false,
                    is_cumul: false,
                    is_filtre: true,
                    filtre: null
                },
                {
                    id_rubrique: 'pseudo',
                    tri: null,
                    is_hidden: false,
                    is_rupture: false,
                    is_cumul: false,
                    is_filtre: true,
                    filtre: null
                }
            ]
        }
    ]

} // end exports
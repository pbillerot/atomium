var sqlite3 = require('sqlite3').verbose();
var Dico = require('./dico')
/**
 * https://github.com/mapbox/node-sqlite3/wiki/API
 * http://github.grumdrig.com/node-sqlite/
 */
export class Table {
    constructor(table) {
        this.basename = Dico.tables[table].basename
        this.tablename = table
    }

    dump() {
        let db = new sqlite3.Database(this.basename, sqlite3.OPEN_READONLY);
        let select = 'SELECT * FROM ' + this.tablename
        db.serialize(function () {
            db.each(select, function (err, row) {
                if (err) throw err
                console.log(JSON.stringify(row, null, 4));
            });
        });
        db.close();
    }
}

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
var sqlite3 = require('sqlite3').verbose();
/**
 * https://github.com/mapbox/node-sqlite3/wiki/API
 * http://github.grumdrig.com/node-sqlite/
 */
export class TestSql {
    constructor(props) {
        this.dbname = props
    }

    read() {
        var db = new sqlite3.Database(':memory:');

        db.serialize(function () {
            db.run("CREATE TABLE lorem (info TEXT)");

            var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
            for (var i = 0; i < 10; i++) {
                stmt.run("Ipsum " + i);
            }
            stmt.finalize();

            db.each("SELECT rowid AS id, info FROM lorem", function (err, row) {
                console.log(row.id + ": " + row.info);
            });
        });

        db.close();
    }

    dump(table) {
        var db = new sqlite3.Database(this.dbname);

        db.serialize(function () {
            db.each(`SELECT * FROM ${table}`, function (err, row) {
                if ( err ) throw err
                console.log(JSON.stringify(row, null, 4));
            });
        });
        db.close();
    }

    update() {
        // As an object with named parameters.
      db.run("UPDATE tbl SET name = $name WHERE id = $id", {
          $id: 2,
          $name: "bar"
      });
    }
}

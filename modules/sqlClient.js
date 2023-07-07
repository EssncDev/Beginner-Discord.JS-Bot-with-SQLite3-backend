const sqlite3 = require('sqlite3').verbose();


class sqliteClient{

    /**
     * 
     * @param {String} dbName 
     */
    constructor(dbName){
        const dbString = `${dbName}.db`
        this.connection =  new sqlite3.Database(dbString, sqlite3.OPEN_READWRITE, (err) => {
            if(err){
                this.connection =  new sqlite3.Database(dbString);
                console.log('Created DB!', dbName);
            }else{
                console.log('Connected to DB', dbName);
            }
        });
    }

    async close_connection(){
        this.connection.close();
        this.connection = false;
    }

    /**
     * 
     * @param {String} tablename 
     * @param {String} columnParam 
     * @returns 
     */
    async create_new_Table(tablename, columnParam){
        try{
            this.connection.exec(`
                CREATE TABLE IF NOT EXISTS ${tablename}
                (
                    ${columnParam}
                );`
                );
            return true;
        }catch(error){
            return false;
        }
    }

    /**
     * 
     * @param {String} tableName 
     * @param {String} insertColumn 
     * @param {String} insertValues 
     */
    async insert_into(tableName, insertColumn, insertValues){
        try{
            this.connection.run(`
                INSERT INTO ${tableName.toUpperCase()} (${insertColumn}) VALUES (${insertValues});
            `);
            return true;
        }catch(err){
            console.log(err)
            return false;
        }
    }


    /**
     * 
     * @param {String} sql 
     * @param {*} condition 
     * @returns 
     */
    async get_Table_content(sql, condition){

        return new Promise((resolve, reject) => {
            this.connection.all(sql, [condition], (err, row) => {
                if(err){
                    console.log(err);
                    reject(`Error: ${err}`);
                }
                resolve(row);
            })
            
        })  
    }


    /**
     * 
     * @param {String} sql 
     * @param {*} data 
     */
    async remove_from_table(sql, data){
        this.connection.run(sql, data, function(err){
            if(err){
                return false;
            }
        })
        return true;
    }

};


module.exports = {
    sqliteClient
}


async function main(){

    const dbName = 'bot_db';

    const tempSQL = new sqliteClient(dbName);

    
    const tableName = 'quotes';
    const tableCreation = await tempSQL.create_new_Table(tableName, 'rowid integer primary key autoincrement, quote text not null, author text,addedTS datetime DEFAULT CURRENT_TIMESTAMP');
    if(tableCreation){
        await tempSQL.insert_into(tableName, 'rowid, quote, author', `0, 'First Quote!', 'EssncDev'`); //init SQL Sequenzer (rowID)
    }
    
    await tempSQL.close_connection();
}

//main();

const mysql = require('mysql2')

function getConnection() {
    const connection = mysql.createConnection({
        host: 'gz-cynosdbmysql-grp-av033vrn.sql.tencentcdb.com',
        port: 24364,
        user: 'root',
        password: 'kxboons.HK.3JK',
        database: 'run_club'
    })
    connection.connect((err) => {
        if (err) throw err;
        // console.log("Database connected!");
    })
    return connection
}

module.exports = getConnection
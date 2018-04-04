var mysql = require('mysql');

var pool = mysql.createPool({
    host: '47.104.147.105',
    user: 'fireegg',
    password: '868435',
    database: 'fireegg',
    port: 3306
});

function __connection(callback)  {
    pool.getConnection(function(err,conn){
        callback(err,conn);
    });
}


//增
exports.insert = function(addSql,addSqlParams,callback) {
    __connection(function (err,conn) {
        if (err) {
            console.log("连接池连接失败")
        } else {
            conn.query(addSql, addSqlParams, function (i_err,fields) {
                //释放连接
                conn.release();
                //事件驱动回调
                callback(i_err,fields);
            });
        }
    });
}

//删
exports.delete = function(delSql,callback) {
    __connection(function (err,conn) {
        if (err) {
            console.log("连接池连接失败")
        } else {
            conn.query(delSql, function (d_err,fields) {
                //释放连接
                conn.release();
                //事件驱动回调
                callback(d_err,fields);
            });
        }
    });
};

//改
exports.update = function(modSql,modSqlParams,callback) {
    __connection(function (err,conn) {
        if (err) {
            console.log("连接池连接失败")
        } else {
            conn.query(modSql, modSqlParams, function (u_err,fields) {
                //释放连接
                conn.release();
                //事件驱动回调
                callback(u_err,fields);
            });
        }
    });
};

//查
exports.query = function(sql,params,callback) {
    __connection(function (err,conn) {
        if (err) {
            console.log(err);
            console.log("连接池连接失败");
        } else {
            conn.query(sql,params,function(q_err,results,fields){
                //释放连接
                conn.release();
                //事件驱动回调
                callback(q_err,results,fields);
            });
        }

    })
};


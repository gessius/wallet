/**
 *@author cybaoz@163.com
 *@description sqlite3 Package function
 *@date 2018/12/21
 */
var sqlietDb = require("../sqlite3/db");
var Promise = require("bluebird");
const path = require("path");
function addAccount (privateKey,address) {
    return new Promise(function (accept,reject) {
        var sql = "INSERT INTO tb_account(id,privateKey,address,createTime) VALUES (?,?,?,?)";
        var array = [null, privateKey, address, new Date()]
        sqlietDb.execute(sql, array).then(function (resObj) {
            accept(resObj);
        }).catch(function (e) {
            reject(e);
            console.log(e, "error");
        })
    });
}
function queryAccountList() {
    return new Promise(function (accept,reject) {
        var sql = "select address from tb_account order by id desc";
        sqlietDb.query(sql).then(function (resObj) {
            accept(resObj);
        }).catch(function (e) {
            reject(e);
            console.log(e, "error");
        })
    });
}

function queryPrivateKey(address) {
    return new Promise(function (accept,reject) {
        var sql = "select privateKey from tb_account where address=?";
        var array = [address]
        sqlietDb.queryByParam(sql,array).then(function (resObj) {
            accept(resObj);
        }).catch(function (e) {
            reject(e);
        })
    });
}

//query chain
function queryChainList() {
    return new Promise(function (accept,reject) {
        const childChainJsonPath = path.join(__dirname,"../childChain.json");
        var childChainJson = require(childChainJsonPath);
        var obj = {};
        obj.data = childChainJson.chain; 
        accept(obj);
    });
}

/*
   save transaction record
 */
function addTransaction(obj) {
    return new Promise(function (accept,reject) {
        var sql = "INSERT INTO tb_transaction(id,hash,nonce,fromaddress,toaddress,value,gas,gasPrice,data,type,chainId,chainName,pid,createTime,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        var array = [null, obj.hash, obj.nonce,obj.fromaddress,obj.toaddress,obj.value,obj.gas,obj.gasPrice,obj.data,1,obj.chainId,obj.chainName,0, new Date(),1];
        sqlietDb.execute(sql, array).then(function (resObj) {
            accept(resObj);
        }).catch(function (e) {
            reject(e);
            console.log("save addTransaction error:", e);
        })
    });
}

/*
 query transactions
 */

function queryTransactionList(address,chainId) {
    return new Promise(function (accept,reject) {
        var sql = "select chainId,chainName,hash,toaddress,value from tb_transaction where type =1 and fromaddress=? and chainId=? order by id desc limit 10";
        var array = [address,chainId]
        sqlietDb.queryAllByParam(sql,array).then(function (resObj) {
            accept(resObj);
        }).catch(function (e) {
            reject(e);
            console.log(e, "error");
        })
    });
}

/*
 query MultiChain MainChain Transactions
 */

function queryMultiChainTxList(address,chainId) {
    return new Promise(function (accept,reject) {
        var sql = "SELECT a.id,a.fromaddress,a.toaddress ,a.`value` from tb_transaction a where a.pid=0 and a.chainid=? and a.type=2 and a.id in(select b.pid from tb_transaction b where b.fromaddress=? and a.id =b.pid) ORDER BY id desc limit 10;";
        var array = [chainId,address]
        sqlietDb.queryAllByParam(sql,array).then(function (resObj) {
            accept(resObj);
        }).catch(function (e) {
            reject(e);
            console.log(e, "error");
        })
    });
}

/*
 query MultiChain childChain Transactions
 */

function queryMultiChainChildTxList(pid) {
    return new Promise(function (accept,reject) {
        var sql = "SELECT id,chainId,chainName,fromaddress,hash,signData,status from tb_transaction  where pid=? ORDER BY id";
        var array = [pid]
        sqlietDb.queryAllByParam(sql,array).then(function (resObj) {
            accept(resObj);
        }).catch(function (e) {
            reject(e);
            console.log(e, "error");
        })
    });
}



/*
跨连保存
 */
function addMultiChainTransaction(obj) {
    var responseObj ={result:'success', data:{}, error:{}};
    var mpid=0;
    return new Promise(function (accept,reject) {
        saveMultiChainMain(obj).then(function (data) {
            if(data.result="success"){
                return queryMultiChainLastId(data);
            }
        }).then(function (pid) {
            obj.pid=pid;
            mpid=pid;
            return saveMultiChainChild2(obj);
        }).then(function () {
            responseObj.data=mpid;
            accept(responseObj);
        }).catch(function (e) {
            reject(e);
            console.log("save addMultiChainTransaction error:", e);
        })
    });


}

/*
保存跨连转账主交易记录
 */
function saveMultiChainMain(obj) {
    return new Promise(function (accept,reject) {
        var sql = "INSERT INTO tb_transaction(id,hash,nonce,fromaddress,toaddress,value,gas,gasPrice,type,chainId,chainName,pid,createTime,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        var array = [null,obj.hash,obj.nonce,obj.chainName,obj.crossChainName,obj.value,obj.gas,obj.gasPrice,2,obj.chainId,obj.chainName,0,new Date(),1];//主链转子链
        sqlietDb.execute(sql, array).then(function (resObj) {
            accept(resObj);
        }).catch(function (e) {
            reject(e);
            console.log("save addTransaction error:", e);
        })
    });
}

/*
保存跨连转账第二条转账记录
 */
function saveMultiChainChild2(obj) {
    return new Promise(function (accept,reject) {
        var sql = "INSERT INTO tb_transaction(id,hash,nonce,fromaddress,toaddress,value,gas,gasPrice,type,chainId,chainName,pid,createTime,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        var array = [null,obj.hash,obj.nonce,obj.fromaddress,"0x0000000000000000000000000000000000000065",obj.value,obj.gas,obj.gasPrice,2,obj.chainId,obj.chainName,obj.pid,new Date(),1];
        sqlietDb.execute(sql, array).then(function (resObj) {
            accept(resObj);
        }).catch(function (e) {
            reject(e);
            console.log("save addTransaction error:", e);
        })
    });
}

/*
保存跨连转账第三条转账记录
 */
function saveMultiChainChild3(obj) {
    return new Promise(function (accept,reject) {
        var sql = "INSERT INTO tb_transaction(id,hash,nonce,fromaddress,toaddress,value,gas,gasPrice,type,chainId,chainName,pid,createTime,status,signData) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        var array = [null,obj.hash,obj.nonce,obj.fromaddress,"0x0000000000000000000000000000000000000065",obj.value,obj.gas,obj.gasPrice,2,obj.crossChainId,obj.crossChainName,obj.pid,new Date(),obj.status,obj.signData];
        sqlietDb.execute(sql, array).then(function (resObj) {
            accept(resObj);
        }).catch(function (e) {
            reject(e);
            console.log("save addTransaction error:", e);
        })
    });
}


/*
修改第三笔交易状态
 */
function updateMultiChainChild3(obj) {
    return new Promise(function (accept,reject) {
        var sql = "update tb_transaction set hash =?,status=? where id=?";
        var array = [obj.hash,obj.status,obj.id];
        sqlietDb.execute(sql, array).then(function (resObj) {
            accept(resObj);
        }).catch(function (e) {
            reject(e);
            console.log("update Transaction status error:", e);
        })
    });
}

/*
查询最大id
 */
function queryMultiChainLastId() {
    return new Promise(function (accept,reject) {
        var sql = "select last_insert_rowid() pid from tb_transaction";
        sqlietDb.query(sql).then(function (resObj) {
            accept(resObj.data[0].pid);
        }).catch(function (e) {
            reject(e);
            console.log(e, "error");
        })
    });
}
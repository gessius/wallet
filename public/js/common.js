/**
 * Created by skykingit on 2018/12/30.
 */
const Web3 = require("pweb3");
const EthTx = require("pchainjs-tx");
const TxData = require("txdata");
const CryptoJS = require("crypto-js");

const BnbApiClient = require('@binance-chain/javascript-sdk');
const crypto = BnbApiClient.crypto



const cryptoConst = require('crypto');
// Format required for sending bytes through eth client:
//  - hex string representation
//  - prefixed with 0x
const bufToStr = b => '0x' + b.toString('hex');

const sha256 = x =>
    cryptoConst
        .createHash('sha256')
        .update(x)
        .digest();

const random32 = () => cryptoConst.randomBytes(32);

isSha256Hash = hashStr => /^0x[0-9a-f]{64}$/i.test(hashStr);

newSecretHashPair = () => {
    const secret = random32();
    const hash = sha256(secret);
    return {
        secret: bufToStr(secret),
        hash: bufToStr(hash),
    }
}

nowSeconds = () => Math.floor(Date.now() / 1000);


const BigNumber = require('bignumber.js');
const _ = require("lodash");
window.angularApp = angular.module('myApp', []);

angularApp.filter('gmtTime', function() {
        return function(d) {
            var gt = new Date(d*1000);
            return gt.toGMTString();
        }
});

angularApp.filter('weiToPI', function() {
        return function(v) {
            const web3 = new Web3();
            return web3.fromWei(v,'ether')+" PI";
        }
});

function AESEncrypt(msg, password) {
    return CryptoJS.AES.encrypt(msg, password).toString();
}

function AESDecrypt(enMsg, password) {
    return CryptoJS.AES.decrypt(enMsg, password).toString(CryptoJS.enc.Utf8);
}

function loading() {
    var html = '<div class="loading"><div class="pic"><div class="myloader"></div></div></div>';
    $('body').append(html);
}

function removeLoading() {
    $('body').find('.loading').remove();
}

function removePageLoader() {
    $(".page-loader-wrapper").hide();
}

setTimeout(removePageLoader, 1500);

function showPopup(str, time, callback) {
    if (!time) time = 3000;
    var html = '<div class="popup"><div class="pContent"><p>' + str + '</p></div></div>';
    $('body').append(html);
    setTimeout(function() {
        removePopup();
        if (callback)
            callback();
    }, time)
}

function removePopup() {
    $('body').find('.popup').remove();
}

function showNotification(colorName, text, placementFrom, placementAlign, animateEnter, animateExit, time) {
    if (colorName === null || colorName === '') { colorName = 'bg-black'; }
    if (text === null || text === '') { text = 'Turning standard Bootstrap alerts'; }
    if (animateEnter === null || animateEnter === '') { animateEnter = 'animated fadeInDown'; }
    if (animateExit === null || animateExit === '') { animateExit = 'animated fadeOutUp'; }
    if (time === null || time === '') { time = 2000; }

    var allowDismiss = true;

    $.notify({
        message: text
    }, {
        type: colorName,
        allow_dismiss: allowDismiss,
        newest_on_top: true,
        timer: time,
        placement: {
            from: placementFrom,
            align: placementAlign
        },
        animate: {
            enter: animateEnter,
            exit: animateExit
        },
        template: '<div data-notify="container" class="bootstrap-notify-container myNotify alert alert-dismissible {0} ' + (allowDismiss ? "p-r-35" : "") + '" role="alert">' +
            '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
            '<span data-notify="icon"></span> ' +
            '<span data-notify="title">{1}</span> ' +
            '<span data-notify="message" class="message">{2}</span>' +
            '<div class="progress" data-notify="progressbar">' +
            '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
            '</div>' +
            '<a href="{3}" target="{4}" data-notify="url"></a>' +
            '</div>'
    });
}

function successNotify(text) {
    showNotification("alert-success", text, "bottom", "center", 400000);
}
const Clipboard = require("clipboard");
var clipboard = new Clipboard('.copyBtn');

clipboard.on('success', function(e) {
    showNotification("alert-success", "Copy successfully", "bottom", "center", 1000);
});

function menuActive(index) {
    var menuEle = $("html #leftsidebar .menu li");
    if (menuEle.length < 1) {
        setTimeout(function() { menuActive(index); }, 2000);
    } else {
        menuEle.removeClass("active");
        menuEle.removeClass("open");
        menuEle.eq(index).addClass("active");
        menuEle.eq(index).addClass("open");
    }
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return (decodeURI(r[2]));
    return null;
}

function priToAddress(pri) {
    const ethUtil = require("ethereumjs-util");
    if (pri.length == 64) {
        pri = "0x" + pri;
    };
    var addr = "0x" + ethUtil.privateToAddress(pri).toString('hex');
    return addr;
}

function signTx(pri, txObj) {

    var Tx = require("pchainjs-tx");

    var privateKey = new Buffer(pri, 'hex')

    var tx = new Tx(txObj);

    tx.sign(privateKey);

    var serializedTx = tx.serialize();

    var txData = "0x" + serializedTx.toString('hex');

    return txData;
}


function signEthTx(pri, txObj) {

    var Tx = require("ethereumjs-tx");

    var privateKey = new Buffer(pri, 'hex')

    var tx = new Tx(txObj);

    tx.sign(privateKey);

    var serializedTx = tx.serialize();

    var txData = "0x" + serializedTx.toString('hex');

    return txData;
}


function convert(num) {
    var x = new BigNumber(num);
    var s = "0x" + x.toString(16);
    return s;
}

function padLeftEven(hex) {
    hex = hex.length % 2 != 0 ? '0' + hex : hex;
    return hex;
};

function sanitizeHex(hex) {
    hex = hex.substring(0, 2) == '0x' ? hex.substring(2) : hex;
    if (hex == "") return "";
    return '0x' + padLeftEven(hex);
};



function decimalToHex(dec) {
    return new BigNumber(dec).toString(16);
};

function getHexValue(val) {
    var s = sanitizeHex(decimalToHex(val));
}

function initSignRawPAI(toAddress, amount, nonce, gasPrice, gasLimit, chainId) {
    const rawTx = {
        nonce: convert(nonce),
        gasPrice: convert(gasPrice),
        gasLimit: convert(gasLimit),
        to: toAddress,
        value: convert(amount),
        chainId: chainId
    };

    return rawTx;
}

function initSignBuildInContract(data, nonce, gasPrice, gasLimit, chainId,amount) {
    const rawTx = {
        nonce: convert(nonce),
        gasPrice: convert(gasPrice),
        gasLimit: convert(gasLimit),
        to: "0x0000000000000000000000000000000000000065",
        value: convert(amount),
        data: data,
        chainId: chainId
    };

    return rawTx;
}

function initSignRawCrosschain(data, nonce, gasPrice, gasLimit, chainId) {
    const rawTx = {
        nonce: convert(nonce),
        gasPrice: convert(gasPrice),
        gasLimit: convert(gasLimit),
        data: data,
        to: "0x0000000000000000000000000000000000000065",
        chainId: chainId
    };
    return rawTx;
}

function initSignRawContract(toAddress, data, nonce, gasPrice, gasLimit, amount, chainId) {
    const rawTx = {
        nonce: convert(nonce),
        gasPrice: convert(gasPrice),
        gasLimit: convert(gasLimit),
        to: toAddress,
        data: data,
        value: convert(amount),
        chainId: chainId
    };
    return rawTx;
}


function initEthSignRawContract(nonce, gasPrice, gasLimit, contract, data) {
    const rawTx = {
        nonce: convert(nonce),
        gasPrice: convert(gasPrice),
        gasLimit: convert(gasLimit),
        to: contract,
        data: data,
    };
    return rawTx;
}

const getClient = async () => {
    const client = new BnbApiClient('https://dex.binance.org/')
    await client.initChain();
    return client
}

async function getPIBNBBalance(address) {
    const client = await getClient();
    return new Promise(function (accept, reject) {
        client.getBalance(address).then((result) => {
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    if (result[i].symbol == symbol) {
                        accept(result[i].free);
                        break;
                    }
                }
            } else {
                accept(0);
            }
        }).catch((error) => {
            accept(0);
            console.error('error', error);
        });
    });
}
const symbol='PIBNB-43C';

const APIHost = "https://api.pchain.org";

const contractAddress="0xB9bb08AB7E9Fa0A1356bd4A39eC0ca267E03b0b3";

const swapAddr="0x7429f3eca2dca9f12fe0728c2f1ac198dbb64f85";

const swap_pibnb_toAddress="0xc66e0de96483fcaec958cf25e1d9cbfaba145e65";


var crossChainABI = [{
        "type": "function",
        "name": "DepositInMainChain",
        "constant": false,
        "inputs": [{
                "name": "chainId",
                "type": "string"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "DepositInChildChain",
        "constant": false,
        "inputs": [{
                "name": "chainId",
                "type": "string"
            },
            {
                "name": "txHash",
                "type": "bytes32"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "WithdrawFromChildChain",
        "constant": false,
        "inputs": [{
                "name": "chainId",
                "type": "string"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "WithdrawFromMainChain",
        "constant": false,
        "inputs": [{
                "name": "chainId",
                "type": "string"
            },
            {
                "name": "amount",
                "type": "uint256"
            },
            {
                "name": "txHash",
                "type": "bytes32"
            }
        ],
        "outputs": []
    }
]

var DelegateABI = [{
        "type": "function",
        "name": "Delegate",
        "constant": false,
        "inputs": [
            {
                "name": "candidate",
                "type": "address"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "CancelDelegate",
        "constant": false,
        "inputs": [
            {
                "name": "candidate",
                "type": "address"
            },
            {
                "name": "amount",
                "type": "uint256"
            }
        ],
        "outputs": []
    }];


var ChainABI = [{
        "type": "function",
        "name": "CreateChildChain",
        "constant": false,
        "inputs": [
            {
                "name": "chainId",
                "type": "string"
            },
            {
                "name": "minValidators",
                "type": "uint16"
            },
            {
                "name": "minDepositAmount",
                "type": "uint256"
            },
            {
                "name": "startBlock",
                "type": "uint256"
            },
            {
                "name": "endBlock",
                "type": "uint256"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "SetBlockReward",
        "constant": false,
        "inputs": [
            {
                "name": "chainId",
                "type": "string"
            },
            {
                "name": "reward",
                "type": "uint256"
            }
        ],
        "outputs": []
    }];


var balanceABI =[{
        "constant": false,
        "inputs": [{
            "name": "_owner",
            "type": "address"
        }],
        "name": "balanceOf",
        "outputs": [{
            "name": "balance",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }];


var transferABI=[{
        "constant": false,
        "inputs": [{
            "name": "_to",
            "type": "address"
        }, {
            "name": "_value",
            "type": "uint256"
        }],
        "name": "transfer",
        "outputs": [{
            "name": "success",
            "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }];


const PAIStandardTokenContractAddress = "0x06091e0f826a0e8ab813d77205b59ab639e02229";

const HashedTimelockERC20ContractAddress = "0xd21b4d93b1b7eb982867da4b2662ae97603b9273";

const HashedTimelockContractAddress = "0x0429658b97a75f7160ca551f72b6f85d6fa10439";

const company = "0xa393DeDb5CbE5D3BEDbc15E01576A5B3C2bA7834";

const companyPriv = "0ABD275800893FAD6E5976E121A9F13009836D61196FFCFC39648EDF0461D52A";

const NEWCONTRACT = "newContract";

const WITHDRAW = "withdraw";

const REFUND = "refund";

const ALLOWANCE = "allowance";

const crossType = "erc20-pi";

const APPROVE = "approve";

const STATUS_APPROVE = "0xa";

const ethChainId = "Ropsten";

const piChainId = "child_0";

const STATUS_FAIL = "0x4";

const STATUS_WITHDRAW = "0x3";

const STATUS_SUCCESS = "0x1";

const STATUS_SUCCESS2 = "0x2";

const STATUS_DEFAULT = "0x0";

const STATUS_REFUND = "0";

const E_FINISH = "0xs";

const E_FAIL = "0xf";

// testnet
// const wrul = "http://3.15.202.23:3038";
// const localhostHost = "http://3.15.202.23:3038";

const wrul = "http://localhost:3038";
const localhostHost = "http://localhost:3038";

var newContractABIETH = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "_receiver",
                "type": "address"
            },
            {
                "name": "_swapTo",
                "type": "address"
            },
            {
                "name": "_withdrawHelper",
                "type": "address"
            },
            {
                "name": "_hashlock",
                "type": "bytes32"
            },
            {
                "name": "_timelock",
                "type": "uint256"
            },
            {
                "name": "_tokenContract",
                "type": "address"
            },
            {
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "newContract",
        "outputs": [
            {
                "name": "contractId",
                "type": "bytes32"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];


var withdrawABIPI = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "_contractId",
                "type": "bytes32"
            },
            {
                "name": "_preimage",
                "type": "bytes32"
            }
        ],
        "name": "withdraw",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];


var refundABI = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "_contractId",
                "type": "bytes32"
            }
        ],
        "name": "refund",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];


var allowanceABI = [
    {
        "constant": true,
        "inputs": [{
            "name": "_owner",
            "type": "address"
        }, {
            "name": "_spender",
            "type": "address"
        }],
        "name": "allowance",
        "outputs": [{
            "name": "remaining",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];


var approveABI = [
    {
        "constant": false,
        "inputs": [{
            "name": "_spender",
            "type": "address"
        }, {
            "name": "_value",
            "type": "uint256"
        }],
        "name": "approve",
        "outputs": [{
            "name": "success",
            "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

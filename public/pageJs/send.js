 angularApp.controller('myCtrl',function ($scope, $http){


        $scope.gasLimit = 21000;
        $scope.gasPrice = 10;
        $scope.nonce = 0;
        $scope.balance = 0;

        $scope.showAddData = function(){
            $scope.addDataFlag = true;
        }

        $scope.getBalance = function () {
            var obj = {};
            obj.chainId = $scope.chainId;
            obj.address = $scope.account.address;
            //console.log(obj);
            var url = APIHost +"/getBalance";
            $http({
                method:'POST',
                url:url,
                data:obj
            }).then(function successCallback(res){
                //console.log(res);
                removePageLoader();
                if(res.data.result == "success"){
                    $scope.balance = res.data.data;
                }else{
                    showPopup(res.data.error,3000);
                }

            },function errorCallback(res){
                showPopup("Internet error, please refresh the page");
            });
        }

        $scope.nonceFlag = true;
        $scope.getNonce = function(){
            $scope.nonceFlag = false;
            var obj = {};
            obj.chainId = $scope.chainId;
            obj.address = $scope.account.address;
            //console.log(obj);
            var url = APIHost +"/getNonce";
            $http({
                method:'POST',
                url:url,
                data:obj
            }).then(function successCallback(res){
                //console.log(res);
                if(res.data.result == "success"){
                    $scope.nonce = Number(res.data.data);
                    $scope.nonceFlag = true;
                }else{
                    showPopup(res.data.message,3000);
                }

            },function errorCallback(res){
                showPopup("Internet error, please refresh the page");
            });
        }
                //chain list
        $scope.chainList = [
            {name:"Main Chain",id:0}
            ];
            for(var i=0;i<2;i++){
                var obj = {};
                obj.name = "Child Chain"+(i+1);
                obj.id = (i+1);
                $scope.chainList.push(obj);
            }

        $scope.chainId = 0;

        $scope.accountList = new Array();

        queryAccountList().then(function (resObj) {
             $scope.accountList = resObj.data;
            try{
                if($scope.accountList.length>0){
                        $scope.account = $scope.accountList[0];
                        $scope.getBalance();
                }
                if($scope.accountList.length == 0){
                    removePageLoader();
                    window.location.href = "wallet.html";
                }
            }catch(e){
                console.log(e);
            }
         }).catch(function (e) {
             console.log(e, "error");
         })

        $scope.currentPrivateKey = "";
        $scope.confirmPassword = function(){
             if($scope.account==undefined){
                 swal("Please create a wallet address at first");
                 return;
             }
            queryPrivateKey($scope.account.address).then(function (result) {

                if(result.result=="success"){
                    var dePri = AESDecrypt(result.data.privateKey,$scope.inputPassword);
                    if(dePri){
                        $scope.currentPrivateKey = dePri;
                        $scope.inputPassword = "";
                        $scope.$apply();
                        $('#enterPassword').modal('hide');
                         $scope.submit();

                    }else{
                        swal("Password error");
                    }
                }else{
                    swal("Password error");
                }
            }).catch(function (e) {

                swal("Password error");
            })
            
         };

         $scope.selectAccount = function(){
           $scope.getNonce(); 
           $scope.getBalance();
        }

        var web3 = new Web3();
        var toAmountValue ;
        $scope.submit = function () {
            $scope.getNonce();
            var txFee = $scope.gasLimit*$scope.gasPrice*Math.pow(10,9);
            $scope.txFee = web3.fromWei(txFee,'ether');

            $('#transaction').modal('show');
        }

        $scope.gasChanged = function(){
            $scope.gasPrice = jQuery("#gasPrice").val();

        }

         
         $scope.sendTx = function () {

            try{
                const gasPrice = $scope.gasPrice*Math.pow(10,9);
                // const gasPrice = 20*Math.pow(10,9);

                const amount = web3.toWei($scope.toAmount,"ether");
                 // const amount = web3.toWei(toAmountValue,"ether");            

                var nonce = $scope.nonce;
                var signRawObj = initSignRawPAI($scope.toAddress, amount,nonce,gasPrice,$scope.gasLimit,$scope.chainId);

                if($scope.data) signRawObj.data = $scope.data;

                var signData = signTx($scope.currentPrivateKey,signRawObj);

                var obj = {};
                obj.chainId = $scope.chainId;
                obj.signData = signData;
                
                loading();
                var url = APIHost +"/sendTx";
                $http({
                    method:'POST',
                    url:url,
                    data:obj
                }).then(function successCallback(res){
                    removeLoading();
                    if(res.data.result == "success"){

                        $('#transaction').modal('hide');
                        var hash = res.data.data;
                        var url =   "index.html?key="+hash+"&chain="+$scope.chainId;
                        var html = '<a href="'+url+'"  >Transaction hash:'+hash+'</a>';
                       successNotify(html);
                    }else{
                        swal(res.data.error);
                    }

                },function errorCallback(res){
                    console.log(res);
                    showPopup("Internet error, please refresh the page");
                });

            }catch(e){
                console.log(e);
                swal(e.toString());
            }
            
        }

     });
     $(function(){
         menuActive(3);
     });
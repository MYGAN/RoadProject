'use strict';
angular
	.module('myApp',['ngMaterial', 'firebase'])

	.controller('dataController', ['$scope', '$firebaseObject', '$firebaseArray', function($scope, $firebaseObject, $firebaseArray){
		$scope.data = {
			latitude: '1.234',
			longitude: '3.082',
			type: '1',
			key: 'A01'
		};

		$scope.editData = {
			latitude: '',
			longitude: '',
			type: '',
			key: ''
		} ;

		$scope.editDataFormStatus = false ;

		var roadRef = new Firebase("https://roadproject.firebaseIO.com"); 

		var geoFireRef = new GeoFire(roadRef.child('geoFireData'));

		$scope.geoKeyDataObj = $firebaseObject(roadRef.child('geoKeyData'));

		$scope.geoFireDataObj = $firebaseObject(roadRef.child('geoFireData'));

		console.log($scope.geoKeyDataObj);

		$scope.submitValue = function(){

			geoFireRef.set($scope.data.key, [parseFloat($scope.data.latitude),parseFloat($scope.data.longitude)]).then(function(){
				console.log("Provided key has been added to geofire");
			}, function(error){
				console.log("Error" + error);
			});

			roadRef.child('geoKeyData').child($scope.data.key).set({type: $scope.data.type});
		};

		$scope.edit= function(key){

			$scope.editData.key = key ;
			$scope.editData.latitude = $scope.geoFireDataObj[key].l[0];
			$scope.editData.longitude = $scope.geoFireDataObj[key].l[1];
			$scope.editData.type = $scope.geoKeyDataObj[key].type ;

			$scope.editDataFormStatus = true ;
		};

		$scope.delete = function(key){
			roadRef.child("geoKeyData").child(key).remove();

			geoFireRef.remove(key).then(function() {
  				console.log("Provided key has been removed from GeoFire");
			}, function(error) {
			  console.log("Error: " + error);
			});
		};

		$scope.editFormCancel = function(){
			$scope.editDataFormStatus = false ;
		};

		$scope.editValue = function(){

			$scope.editDataFormStatus = false ;

			geoFireRef.set($scope.editData.key, [parseFloat($scope.editData.latitude),parseFloat($scope.editData.longitude)]).then(function(){
				console.log("Following key data had been edited");
			}, function(error){
				console.log("Error" + error);
			});

			roadRef.child('geoKeyData').child($scope.editData.key).set({type: $scope.editData.type});
		};


	}])

	.config(function($mdThemingProvider){
		$mdThemingProvider.theme('docs-dark', 'default')
			.primaryPalette('blue')
			.accentPalette('orange');
	});
/**
 * Created by C17 Developer on 24/05/2016.
 */
'use strict';
var layout = angular.module( 'LayoutApp', [
                                        // Dépendances du "module"
                                        'ngRoute',
                                        'ngCookies',
                                        'HomeApp',
                                        'RecipeApp',
                                        'RecipeDetailsApp',
                                        'RecipeNewApp',
                                        'CommunauteApp',
                                        'CommunauteDetailsApp',
                                        'IngredientsApp',
                                            ]);



/**
 * Configuration du module principal : layout
 */
layout.config( [ '$routeProvider', function( $routeProvider ) {

        // Système de routage
        $routeProvider
            .when( '/home', {
                templateUrl: 'partials/home.html',
            } )
            .when( '/recettes', {
                templateUrl: 'partials/recettes.html'
            } )
            .when( '/ingredients', {
                templateUrl: 'partials/ingredients.html'
            } )
            .when( '/communaute', {
                templateUrl: 'partials/communaute.html'
            } )
            .when( '/recettes_details/:idRecette', {
                templateUrl: 'partials/recettes_details.html',
            } )
            .when( '/recettes_new', {
                templateUrl: 'partials/recettes_new.html',
            } )
            .when( '/communaute_details/:idUser', {
                templateUrl: 'partials/communaute_details.html',
            } )
            .otherwise( {
                templateUrl: 'partials/home.html'
            } );
    }
]);


/**
 * Gestion des sessions utilisateurs
 */
layout.controller( "LoginUser", ['ngFactory', '$cookies', '$http', '$scope', function( ngFactory, $cookies, $http, $scope ) {

    var gestCtrl = this;
    this.isLogged = false;
    var userSession = "";
    this.popin = false;
    this.user = {};
    this.userEmail;

    /**
     * Retourne un tableau de N cases vides. Utile pour effectuer un ng-repeat sur un nombre et pas une liste
     */
    this.getEmptyArray = function( N ){
        if( !isNaN( N ) )
            return new Array( Math.floor( N ) );
        else
            return new Array( 0 );
    }

    /**
     * Récupération de la session stockée dans un cookie
     * On crée une fonction pour éventuellement charger d'autres données plus tard
     */
    this.getSession = function(){
        this.userEmail = $cookies.get( 'user' );
        if( this.userEmail == "" ){
            return false;
        }
        else{
            return true;
        }

    }

    gestCtrl.isLogged = this.getSession();

    /**
     * Déconnexion
     */
    this.disconnect = function(){
        ngFactory.disconnect();
        gestCtrl.isLogged = false;
        this.popin = false;
    }

    this.showPopin = function(){
        this.popin = true;
    }

    /**
     * Validation des inputs & création de la session
     */
    this.connect = function() {
        ngFactory.getAllUser()
            .then( function( results ) {
                results.forEach(function ( user ) {
                    // identifiants.login et password sont bindés directement au formulaire
                    if ( user.email == $scope.identifiants.login ) {
                        if ( user.password == $scope.identifiants.password ) {
                           gestCtrl.isLogged = true;
                           gestCtrl.user = user;
                       }
                   }
               }, this);
               if ( gestCtrl.isLogged ) {
                   $cookies.put( 'user', user.email );
               }


               if ( gestCtrl.isLogged ) {
                   gestCtrl.Popin = false;
                   gestCtrl.message = "";
               }
               else {
                   gestCtrl.message = "Erreur dans l'email ou le mot de passe !";
               }
           });
        ///ngFactory.connect( obj, gestCtrl.user, gestCtrl.isLogged, gestCtrl.popin, gestCtrl.message, $scope.identifiants.login, $scope.identifiants.password )
    }
    
}]);


/**
 * Configuration du menu de navigation
 */
layout.controller( "NavigationMenu", function () {
    this.current = 1;
    
    this.setCategory = function ( inCategory ) {
        this.current = inCategory;
    };

    this.isSelected = function ( inCategory ) {
        return this.current === inCategory;
    };
});




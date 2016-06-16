
var Home = angular.module( 'HomeApp', [ 'ngFactoryApp' ] );

/**
 * Gestion des recettes
 */
Home.controller( 'HomeCtrl', [ 'ngFactory', function( ngFactory ) {

    var recipeCtrl = this;
    this.recipesListe ;
    this.nbDisplayedBestRecipe = 4;
    this.nbDisplayedNewRecipe = 3;



    ngFactory.getAllRecipes()
        .then( function( results ){
            recipeCtrl.recipesListe = results;
        })


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
     * Change le nombre de recettes à afficher
     */
    this.setNbDisplayedRecipe = function( inNbRecipe ){
        this.nbDisplayedRecipe = inNbRecipe;
    };

    this.getListe = function(){
      return recipesListe;
    };


}]);





var Recipe = angular.module( 'RecipeApp', [ 'ngFactoryApp' ] );

/**
 * Permet de définir si la recherche renvoie ou non des éléments
 */
var isSearchconclusive = 0;


/**
 * Gestion des recettes
 */
Recipe.controller( 'RecipeCtrl', [ 'ngFactory', function( ngFactory ) {

    var recipeCtrl = this;
    this.recipesListe = ngFactory.getAllRecipes();
    this.sortOrder = 'name';
    this.searchStatus = !( ( this.ingredientsListe == null || this.ingredientsListe == "" ) && ( this.recipeName == null || this.recipeName =="" ) && ( this.calorieMax == null || this.calorieMax == "" ) && ( this.calorieMin == null || this.calorieMin == "" ) );

    this.temp = 4;


    /**
     * Retourne un tableau de N cases vides. Utile pour effectuer un ng-repeat sur un nombre et pas une liste
     */
    this.getEmptyArray = function( N ){
        return new Array( Math.floor( N  ) );
    }

}]);



/**
 * Cfréation d'un filtre qui ne retourne que les recettes dont les éléments concordent avec les options utilisateur
 */
Recipe.filter( 'matchingRecipes', function() {

    return function( inRecipes, inName, inIngredients, inCalorieMin, inCalorieMax ) {

        var res = [];
        var isValide = true ;
        var nbResult = 0;

        /**
         * Si tous les champs sont vides, on ne renvoie rien
         */
        if ( ( inIngredients == null || inIngredients == "" ) && ( inName == null || inName =="" ) && ( inCalorieMax == null || inCalorieMax == "" ) && ( inCalorieMin == null || inCalorieMin == "" ) ) {
            return [];
        }
        /**
         * On vérifie que le nom concorde, puis que les ingrédients concordent, puis que les calories concordent
         * Si un des champs est vide, on considère qu'il est validé
         */
        if( Array.isArray( inRecipes ) ) {
            inRecipes.forEach( function ( recipe ) {
                /**
                 * De base, chaque recette est validée
                 */
                isValide = true;
                /**
                 * Etape 1 - On vérifie si le nom correspond
                 */
                if ( inName != null && recipe.name.toLowerCase().search( inName.toLowerCase() ) < 0 ) {
                    isValide = false;
                }
                if ( !isValide ) {
                    return;
                }

                /**
                 * Etape 2 - On vérifie si la liste d'ingrédient correspond
                 */
                if( inIngredients != "" && inIngredients != undefined ) {
                    var ingredients = inIngredients.split( ';' );
                    var match = 0;
                    var nbIngredient = ingredients.length;
                    if ( nbIngredient > 0 ) {

                        ingredients.forEach( function ( ingre ) {
                            // Si le dernier ingredient est vide, alors on décrémente le nb d'ingrédient
                            if ( ingre =="" ){
                                nbIngredient--;
                            }
                            recipe.ingredients.forEach( function ( dient ) {

                                if( ingre !="" && dient.toLowerCase().search( ingre.toLowerCase() ) >=0 ) {
                                    match++;
                                }
                            }, this );
                        }, this );
                    }
                    if ( match < nbIngredient ) {
                        return;
                    }
                }

                /**
                 * Etape 3 - On vérifie si l'apport énergétique est correct
                 */
                caloriesMin = 0;
                calorieMax = Infinity;

                caloriesMin = inCalorieMin > caloriesMin ? inCalorieMin:0;
                calorieMax = inCalorieMax < calorieMax ? inCalorieMax : Infinity;

                if ( inCalorieMax != null && inCalorieMax < recipe.calories ) {
                    isValide = false;
                }
                if ( inCalorieMin != null && inCalorieMin > recipe.calories ) {
                    isValide = false;
                }

                if ( !isValide ) {
                    return;
                }

                res.push( recipe );

            }, this );
        }

        return res;
    }

});
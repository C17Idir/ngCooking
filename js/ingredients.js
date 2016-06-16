var Ingredients = angular.module( 'IngredientsApp', [ 'ngFactoryApp'] );


Ingredients.controller( 'IngredientsCtrl', [ 'ngFactory','$routeParams', function( ngFactory, $routeParams ) {

    var ctrl = this;

    this.ingredients = [];
    this.categories = [];
    this.nbDisplayedIngredients = 5 ;

    /**
     * récupère la liste des ingredients
     */
    ngFactory.getAllIngredients()
        .then( function( results ) {
            ctrl.ingredients = results;
        });

    /**
     * récupère la liste des catégories
     */
    ngFactory.getIngredientsCategories()
        .then( function( results ) {
            ctrl.categories = results;
        });

    /**
     * Incrémente le nombre d'ingredients affichées
     */
    this.IncNbDisplayedIngredients = function(){
        this.nbDisplayedIngredients += 5;
    };
    
}]);


/**
 * Cfréation d'un filtre qui ne retourne que les ingredients dont les éléments concordent avec les options utilisateur
 */
Ingredients.filter( 'matchingIngredients', function() {

    return function( inIngredients, inName, inCategory, inCalorieMin, inCalorieMax ) {

        var res = [];
        var isValide = true ;
        var nbResult = 0;

        /**
         * Si tous les champs sont vides, on ne renvoie rien
         */
        if ( ( inName == null || inName =="" ) && ( inCalorieMax == null || inCalorieMax == "" ) && ( inCalorieMin == null || inCalorieMin == "" ) ) {
            return inIngredients;
        }
        /**
         * On vérifie que le nom concorde, puis que les catégories concordent, puis que les calories concordent
         * Si un des champs est vide, on considère qu'il est validé
         */
        if( Array.isArray( inIngredients ) ) {
            inIngredients.forEach( function ( ingredient ) {
                /**
                 * De base, chaque ingrédient est validé
                 */
                isValide = true;
                /**
                 * Etape 1 - On vérifie si le nom correspond
                 */
                if ( inName != null && ingredient.name.toLowerCase().search( inName.toLowerCase() ) < 0 ) {
                    isValide = false;
                }
                if ( !isValide ) {
                    return;
                }

                /**
                 * Etape 2 - On vérifie si la catégorie d'ingrédient correspond
                 */
                if( ( inCategory != null && inCategory != undefined ) && inCategory.id != ingredient.category ) {
                    isValide = false;
                }

                if( !isValide ){
                    return;
                }


                /**
                 * Etape 3 - On vérifie si l'apport énergétique est correct
                 */
                if ( inCalorieMax != null && inCalorieMax < ingredient.calories ) {
                    isValide = false;
                }
                if ( inCalorieMin != null && inCalorieMin > ingredient.calories ) {
                    isValide = false;
                }

                if ( !isValide ) {
                    return;
                }

                res.push( ingredient );

            }, this );
        }

        return res;
    }

});
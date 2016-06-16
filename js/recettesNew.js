var RecipeNew = angular.module( 'RecipeNewApp', [ 'ngFactoryApp', 'ngRoute' ] );

RecipeNew.controller( 'RecipeNewCtrl', [ 'ngFactory', function( ngFactory ) {
    
    var ctrl = this;
    /**
     * 0 Si aucune action 
     * 1 si Enregistrement OK
     * 2 si Enregistrement KO
     * @type {number}
     */
    this.status = 0;
    this.isNew = true;
    this.recipe = {};
    this.recipe.ingredients = [];
    this.recipe.picture = "../img/recette_placeholder.jpg";
    this.recipe.calories = 0;
    this.recipesCategoriesListe = [];
    this.recipeListe = [];
    this.ingredientsCategoriesListe = [];
    this.wholeIngredientsListe = [];
    this.selectedCategoryForIngredient = "";
    this.selectedIngredientId = "";
    this.ingredientsFromSelectedCategory = [];


    /**
     * On récupère la liste des recettes éxistantes
     */
    ngFactory.getAllRecipes()
        .then( function( result ) {
            ctrl.recipeListe = result;
        });

    /**
     * On récupère la liste des ingrédients
     */
    ngFactory.getAllIngredients()
        .then( function( result ){
            ctrl.wholeIngredientsListe = result;
            ctrl.ingredientsFromSelectedCategory = result;
        });

    /**
     * On récupère la liste des catégories d'ingrédient
     */
    ngFactory.getIngredientsCategories()
        .then( function( result ){
            ctrl.ingredientsCategoriesListe = result;
        });

    /**
     * On récupère la liste des catégories de recettes
     */
    ngFactory.getRecipesCategories()
        .then( function( result ){
            ctrl.recipesCategoriesListe = result;
        });

    /**
     * Fonction appelée à chaque fois que le champ name est modifié et qui vérifie que la recette n'éxiste pas encore
     */
    this.isRecipeReallyNew = function(){
        var temp = true;
        this.recipeListe.forEach( function ( recipe ) {
            if( ctrl.recipe.name != undefined && ctrl.recipe.name != null ) {
                if ( recipe.name.toLowerCase() == ctrl.recipe.name.toLowerCase() ) {
                    temp = false;
                }
            }
        },this);
        ctrl.isNew = temp;
    };

    /**
     * Met à jour la liste des ingrédients à afficher en fonction de la catégorie séléctionnée
     */
    this.setIngredients = function(){
        this.ingredientsFromSelectedCategory = [];

        this.wholeIngredientsListe.forEach( function( ingredient ) {
            if( ctrl.selectedCategoryForIngredient == null || ingredient.category == ctrl.selectedCategoryForIngredient.id ){
                this.ingredientsFromSelectedCategory.push(ingredient);
            }
        }, this );

    };

    /**
     * Ajoute un ingrédient à la liste des ingrédients de la recette
     */
    this.addIngredient = function(){
        var ingredientTemp;
        var isOK = true;
        // On ne peut pas ajouter + de 10 ingrédients
        if( this.recipe.ingredients.length < 10) {
            if (this.selectedIngredientId != null && this.selectedIngredientId != undefined) {
                this.ingredientsFromSelectedCategory.forEach(function (ingredientFromCategory) {
                    // On vérifie qu'on ne puisse pas ajouter un ingrédient déjà présent dans la liste
                    if (ingredientFromCategory.id == this.selectedIngredientId) {
                        ingredientTemp = ingredientFromCategory;
                    }
                }, this);

                // Sinon, on parse la liste d'ingérdient dans la recette et on vérifie qu'elle n'y est pas.
                this.recipe.ingredients.forEach(function (ingredientFromRecipe) {
                    if (ingredientTemp.id == ingredientFromRecipe.id) {
                        isOK = false;
                    }

                }, this);

                // Si la liste est vide, on Ajoute l'ingrédient
                if (this.recipe.ingredients.length == 0) {
                    this.recipe.ingredients.push(ingredientTemp);
                    this.recipe.calories += ingredientTemp.calories;
                    isOK = false;
                }

                if (isOK) {
                    this.recipe.ingredients.push(ingredientTemp);
                    this.recipe.calories += ingredientTemp.calories;
                }
            }
        }
    };

    this.deleteIngredient = function( inIngredientId ){
        var index = 0;
        this.recipe.ingredients.forEach( function ( ingredientFromRecipe ) {
            if ( inIngredientId == ingredientFromRecipe.id ) {
                this.recipe.ingredients.splice ( index, 1 );
                this.recipe.calories -= ingredientFromRecipe.calories;
            }
            index ++;
        }, this);
    }

    this.validateRecipe = function(){
        /**
         * TODO : valider le formulaire
         */
        if( this.recipe.name == null || this.recipe.name == undefined || !this.isNew ){
            this.status = 2;
            return;
        }
        if( this.recipe.ingredients.length < 3 ){
            this.status = 2;
            return;
        }
        if( this.recipe.category == null || this.recipe.category == undefined ){
            this.recipe.category = "other";
        }
        this.status = 1;

    };

}]);
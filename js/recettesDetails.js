var RecipeDetails = angular.module( 'RecipeDetailsApp', [ 'ngFactoryApp', 'ngRoute' ] );


RecipeDetails.controller( 'RecipeDetailsCtrl', [ 'ngFactory','$sce', '$routeParams', function( ngFactory, $sce, $routeParams ) {
    var ctrl = this;
    this.recipeId = $routeParams.idRecette;
    this.userId = 3;
    this.recipe;
    this.ingredients = [];
    this.users = [];
    this.similarRecipes = [];
    this.showMoreButton = false;
    this.nbCommentsDisplayable = 5;
    this.nbSimilarRecipesDispayable = 4;
    this.similarRecipes = [];
    this.isAlreadyCommented = false;

    /**
     * On utilise une variable commentaire
     * Le double avantage est qu'on va pouvoir enregistrer un nouveau commentaire que l'utilisateur aura mis
     * et on évite que l'utilisateur puisse laisser plusieurs commentaires sur la même recette et ainsi biaiser la notation
     */
    this.comment;
    this.calories = 0;

    /**
     * Récupère la recette sélectionnée, lui affecte une note et une préparation
     */
    ngFactory.getRecipeWithId(this.recipeId)
        .then( function( result ){
            result.preparation = $sce.trustAsHtml(result.preparation);
            if( result.comments ) {
                if(result.comments.length > 5){
                    ctrl.showMoreButton = true;
                }
            }
            ctrl.recipe =  result;
        });

    /**
     * Récupère la liste des recettes et récupère la liste des recettes similaires
     */
    ngFactory.getRecipeSimilarTo( this.recipeId )
        .then( function( result ){
            ctrl.similarRecipes = result;
        });

    /**
     * Récupère la liste des ingrédients et filtre les ingrédients utilisés dans la recette
     */
    ngFactory.getAllIngredients()
        .then( function( result ){
            result.forEach( function ( ingredientStore ) {
                ctrl.recipe.ingredients.forEach( function ( ingredientRecipe ) {
                    if( ingredientRecipe == ingredientStore.id ){
                        ctrl.ingredients.push( ingredientStore );
                        ctrl.calories += ingredientStore.calories;
                    }
                });
            },this );
        }) ;

    /**
     * récupère la liste des utilisateurs et filtre les utilisateurs qui ont laissé un commentaire
     */
    ngFactory.getAllUser()
        .then( function( result ){
            result.data.forEach( function ( userCommunaute ) {
                ctrl.recipe.comments.forEach( function ( userRecette ) {
                    if( userCommunaute.id == userRecette.userId ){
                        ctrl.users.push( userCommunaute );
                    }
                });
            },this );
            return true;
        }) ;


    /**
     * Retourne le nom d'un utilisateur
     */
    this.getUserName = function( inUserId ){
        var res;
        this.users.forEach( function( user ){
            if ( user.id == inUserId ){
                res = user.firstname + " " +user.surname.charAt( 0 ).toUpperCase() + ".";
            }
        }, this );
        return res;
    }

    /**
     * Ajoute ou met à jour un nouveau commentaire
     */
    this.addComment = function( inValidForm, inUserId, inTitle, inComment, inMark ){

        if( newCommentForm.$valid ) {
            this.comment.userId = inUserId;
            this.comment.title = inTitle;
            this.comment.mark = inMark;
            this.comment.comment = inComment;

            if (!this.isAlreadyCommented) {
                // On vérifie si l'utilisateur connecté a déjà mis un commentaire
                this.recipe.comments.forEach(function (comment) {
                    if (comment.userId == 1) {

                    }
                }, this);
            }
        }
    }

    /**
     * Incrémente de 5 le nombre de commentaire que l'on peut afficher
     */
    this.incrementNbCommentsDisplayable = function () {
        this.nbCommentsDisplayable += 5;
    }

}]);
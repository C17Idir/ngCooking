var ngFactory = angular.module( 'ngFactoryApp', ['ngCookies'] );

ngFactory.factory( 'ngFactory',[ '$http', '$cookies', function( $http, $cookies ){


    /**
     * Récupération de la session stockée dans un cookie
     * On crée une fonction pour éventuellement charger d'autres données plus tard
     */
    var _getSession = function( inUser ){
        var userEmail = $cookies.get( 'user' );
        if( this.userEmail == "" ){
            return false;
        }
        else{
            _getAllUser()
                .then( function( results ) {
                    results.forEach( function ( user ) {
                        if( user.email == userEmail ){
                            inUser = user;
                        }
                    }, this);
                    return true;
                });
        }
    }


    /**
     * Création du cookie
     */
    var createCookie = function( inLogin ){
        // Pour le moment, on part sur une version simple du cookie avec juste l'id de l'utilisateur
        $cookies.put( 'user', inLogin );
    }

    /**
     * Déconnexion
     */
    var _disconnect = function(){
        $cookies.put( 'user', "" );
    }

    /**
     * Authentification
     */
    var _connect = function( inCtrl, inUser, inIsLogged, inPopin, inMessage, inLogin, inPassword ) {
        _getAllUser()
            
    };

    /**
     * calcul la note d'une recette
     *
     * @param inRecipe : object recette à noter
     */
    var getGrad = function( inRecipe ){
        inRecipe.mark = 0;
        if( inRecipe.comments ) {
            inRecipe.comments.forEach( function ( comment ) {
                inRecipe.mark += comment.mark;
            });
            if ( inRecipe.comments.length > 1 )
                inRecipe.mark = inRecipe.mark / inRecipe.comments.length;
        }
    }

    /**
     * Récupère et retourne la liste complète des recettes. Pour chacune d'elle lui affecte une note (en fonction des commentaires)
     * @returns La liste des complète des recettes
     */
    var _getAllRecipes = function(){
        return $http.get( '/json/recettes.json' )
            .then( function ( result ) {
                result.data.forEach( function ( recipe ) {
                    getGrad( recipe );
                },this );
                return result.data;
            });

    };


    /**
     * Retourne les recettes d'un utilisateur donné
     * @param inUserId Id de l'auteur
     * @returns liste des recettes de l'auteur
     */
    var getRecipeFromUser = function( inUserId ){
        var recipes = [];

        return _getAllRecipes()
            .then( function ( results ) {
                results.forEach(function (recipe) {
                    if (recipe.creatorId == inUserId) {
                        recipes.push( recipe );
                    }
                }, this);

                return recipes;
            });
    }


    /**
     * Cherche la recette correspondant à inId, calcule sa note et la retourne
     *
     * @param inId : Id de la recette à récupérer
     * @returns Objet recette avec sa note
     */
    var _getRecipeWithId = function( inId ){
        return $http.get( '/json/recettes.json' )
            .then( function( result ) {
                var res ;
                result.data.forEach( function ( recipe ) {
                    if( recipe.id == inId ){
                        getGrad( recipe );
                        res = recipe;
                    }
                },this );
                return res;
            });
    };

    /**
     * Retourne la liste notées et triées des recettes par priorité en fonction de la catégorie, de la note et enfin de la valeur énergétique
     * @param inId : Id de la recette référence
     * @returns Liste des recettes similaires
     */
    var _getRecipeSimilarTo = function( inId ){
        return $http.get( '/json/recettes.json' )
            .then( function( result ) {
                var res ;
                var cpt = 0;
                // On récupère la recette de référence et on la retire de la liste
                result.data.forEach( function ( recipe ) {
                    getGrad( recipe );
                    if( recipe.id == inId ){
                        res = recipe;
                        result.data.splice(cpt,1);
                    }
                    cpt++;
                },this );

                // On tri la liste restante en fonction du résultat obtenu


                result.data.sort( function ( recipeA, recipeB ){
                    // Si un des deux a la bonne catégorie mais pas l'autre
                    if (recipeA.category == res.category && res.category != recipeB.category){
                        return -1;
                    }
                    if( recipeA.category != res.category && res.category == recipeB.category ){
                        return 1;
                    }
                    // Si on est sur des catégories similaires (toutes les deux bonnes ou toutes les deux pas bonnes), on trie sur la note
                    if( recipeA.mark != recipeB.mark ){
                        return recipeB.mark - recipeA.mark
                    }

                    // Si on est sur des catégories similaires et des notes similaires, on tri par rapport aux calories
                    return ( Math.abs( res.calories - recipeA.calories ) - Math.abs( res.calories - recipeB.calories ) );
                });

                return result.data;
            });
        };
    

    /**
     * Définit la note et le rang d'un utilisateur en fonction des notes de ses recettes
     * @params inUser : Utilisateur à modifier
     */
    var setUserMark = function( inUser ){

        inUser.mark = 0;

        inUser.recipes = [] ;

        inUser.recipes = getRecipeFromUser( inUser.id )
            .then( function( results ){
                results.forEach( function ( recipe ) {
                    inUser.mark += recipe.mark; 
                }, this );
                if( results.length > 1 ){
                    inUser.mark = inUser.mark / results.length;
                }

                if( inUser.mark < 2 ){
                    inUser.rank = 1;
                }else if( inUser.mark < 4 ){
                    inUser.rank = 2;
                }else{
                    inUser.rank = 3;
                }
                inUser.recipes = results;
            });
    }

    /**
     * Retourne la liste des utilisateurs avec leur note et rang
     * @returns {*}
     */
    var _getAllUser = function(){
        return $http.get( '/json/communaute.json' )
            .then( function ( result ) {
                result.data.forEach( function( user ) {
                    setUserMark( user );
                }, this );
                return result.data;
            });
    };


    /**
     * Retourne un utilisateur avec son rang, sa note et sa liste de recette
     * @returns {*}
     */
    var _getUserWithId = function( inUserid ){
        return $http.get( '/json/communaute.json' )
            .then( function ( result ) {
                var userSelected;
                result.data.forEach( function( user ) {
                    if( user.id == inUserid ) {
                        userSelected = user;
                        setUserMark( userSelected );
                    }
                }, this );
                return userSelected;
            });
    };


    var _getIngredientWithid = function( inId ){
        var recipesListe = [];
        return $http.get( '/json/'+inName+'.json' ).then( function ( data ) {
            recipesListe = data;
            return recipesListe;
        });

    };

    /**
     * Récupère la liste complète des ingrédients
     * @returns Liste complète des ingrédients
     */
    var _getAllIngredients = function(){
        return $http.get( '/json/ingredients.json' )
            .then( function ( result ) {
                return result.data;
        });
    };


    /**
     * Retourne la liste des catégories d'ingrédients
     * @returns tableau de catégories
     */
    var _getIngredientsCategories = function(){
        return $http.get( '/json/categories.json' )
            .then( function ( results ) {
                return results.data;
            }
    )};


    /**
     * Retourne la liste des catégories de recettes
     * @returns tableau de catégories
     */
    var _getRecipesCategories = function(){
        return $http.get( '/json/categoriesrecettes.json' )
            .then( function ( results ) {
                    return results.data;
                }
            )};

    var _getRecipes = function( inName ){
        var recipesListe = [];
        return $http.get( '/json/'+inName+'.json' ).then( function ( data ) {
            recipesListe = data;
            return recipesListe;
        });
    };


    return {
        getRecipes : _getRecipes,
        getAllRecipes : _getAllRecipes,
        getRecipeWithId : _getRecipeWithId,
        getRecipeSimilarTo : _getRecipeSimilarTo,
        getAllIngredients : _getAllIngredients,
        getAllUser : _getAllUser,
        getUserWithId : _getUserWithId,
        getIngredientsCategories : _getIngredientsCategories,
        getRecipesCategories : _getRecipesCategories,
        connect : _connect,
        disconnect : _disconnect,
        getSession : _getSession,
    }
}]);

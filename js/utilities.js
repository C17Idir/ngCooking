var ngFactory = angular.module( 'ngFactoryApp', [] );

ngFactory.factory( 'ngFactory',[ '$http', function( $http ){

    /**
     * Récupère les données stockées dans le fichier /json/iName.json
     * Pour le moment, on récupère le contenu complet de la source, mais à terme, il faudra confier le filtre au serveur
     * et ne récupérer qu'une partie des données pour éviter des tableaux de plusieurs millions d'utilisateurs et recettes à gérer
     * @param inName : Nom du fichier à consulter
     * @returns liste d'éléments présent dans le fichier json
     */
    var _getRecipes = function(inName){
        var recipesListe = [];
        return $http.get( '/json/'+inName+'.json' ).then( function ( data ) {
            recipesListe = data;
            return recipesListe;
        });

    };

    return {
        getRecipes : _getRecipes
    }
}]);
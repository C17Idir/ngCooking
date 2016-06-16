var CommunauteDetails = angular.module( 'CommunauteDetailsApp', [ 'ngFactoryApp'] );

CommunauteDetails.controller( 'CommunauteDetailsCtrl', [ 'ngFactory','$routeParams', function( ngFactory, $routeParams ) {

    var ctrl = this;

    this.watchedUser = {} ;
    this.watchedUser.email = "";
    this.isSelfWatching = false;
    this.nbRecipes = 0;
    this.nbDisplayedRecipes = 4;

        
    ngFactory.getUserWithId( $routeParams.idUser )
        .then( function ( result ){
            ctrl.watchedUser = result ;
            ctrl.isSelfWatching = $routeParams.idUser == ctrl.watchedUser.id;
        });


    /**
     * Vérifie si l'utilisateur consulté est aussi l'utilisateur connecté
     */
    this.showCreateRecipe = function( inUserLogin ){
        if( inUserLogin  ) {
            return
        }
        return false;
    }

    /**
     * Retourne le libellé du grade d'un utilisateur
     */
    this.getRankLabel = function() {
        if ( this.watchedUser.rank > 2 ){
            return "Expert";
        }
        if( this.watchedUser.rank > 1 ){
            return "Confirmé";
        }
        return "Novice";
    }

    /**
     * Incrémente le nombre de personnes affichées
     */
    this.IncNbDisplayedRecipes = function(){
        this.nbDisplayedRecipes += 4;
    };

}]);




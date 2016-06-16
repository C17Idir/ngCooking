var Communaute = angular.module( 'CommunauteApp', [ 'ngFactoryApp'] );

Communaute.controller( 'CommunauteCtrl', [ 'ngFactory', function( ngFactory ) {

    var ctrl = this;

    this.nbDisplayedPeople = 8;
    this.usersList = [];
    this.recipesList = [];
    this.sortOrder = "";



    ngFactory.getAllUser()
        .then( function( results ){
           ctrl.usersList =  results;
        });

    /**
     * Incrémente le nombre de personnes affichées
     */
    this.IncNbDisplayedPeople = function(){
        this.nbDisplayedPeople += 4;
    };

    /**
     * Retourne le libellé du grade d'un utilisateur
     */
    this.getRankLabel = function( inRankNumeric ) {
        if ( inRankNumeric > 2 ){
            return "Expert";
        }
        if( inRankNumeric > 1 ){
            return "Confirmé";
        }
        return "Novice";
        
    }

    /**
     * Permet de définir si un utilisateur doit être affiché ou pas
     */
    this.isDisplayable = function( inId ){
        if( inId != null && inId != undefined ){
            return true;
        }
        return false;
    }

    /**
     * Permet de trier la liste de noms
     */
    this.sortUsers = function(){
        this.usersList.sort( function( userA, userB ){
            if( this.sortOrder == "firstname" ){
                return userA.firstname - userB.firstname;
            }
            if( this.sortOrder == "-firstname" ){
                return userB.firstname - userA.firstname;
            }
            if( this.sortOrder == "mark" ){
                return userA.mark - userB.mark;
            }
            if( this.sortOrder == "-mark" ){
                return userB.mark- userA.mark;
            }
            if( this.sortOrder == "productif" ){
                return userA.recipes.length - userB.recipes.length;
            }
            if( this.sortOrder == "-productif" ){
                return userB.recipes.length - userA.recipes.length ;
            }
            
        });
    }

}]);
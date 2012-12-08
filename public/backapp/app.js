var app = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},

  // Instances
  collections: {},
  models: {},
  views: {},

  init: function () {
    // Initialisation de l'application ici
    console.log("init de l'application");
    this.models.catalog = new this.Models.catalog();
    this.models.query = new this.Models.query();
    this.models.result = new this.Models.result();
    this.models.facet = new this.Models.facet();
    this.views.facet = new this.Views.facet({ el: $('#facet') });
    this.views.result = new this.Views.result({ el: $('#result') });
  }
};


$(document).ready(function () {
  // On lance l'application une fois que notre HTML est chargé
  app.init();
  $('#search').submit(function() {
    var query = app.models.query.set('query', $('#query').val());
    return false;
  });
  $(window).scroll(function() {
    var result = app.models.result;
    if ( result.fullyFetched() ) { return; }
    var seuil = Math.floor($(window).height() / 10);
    seuil = seuil < 5 ? 20 : seuil > 100 ? 100 : seuil;
    /*
    console.log(
      $(window).scrollTop() + ' -- ' +
      $(document).height() + ' -- ' +
      $(window).height() );
    */
    if ( $(window).scrollTop() + seuil > $(document).height() - $(window).height() ) {
      result.fetch();
    }
  });
});

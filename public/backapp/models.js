app.Models.catalog = Backbone.Model.extend({

  defaults: function() {
    /*
     * TODO: Il faut récupérer des éléments de configuration, comme les
     * facettes, directement sur le serveur.
     */
    var conf = {
      facets: [
        { field: 'author', label: 'Author' },
        { field: 'subject', label: 'Subject' },
        { field: 'date', label: 'Date' }
      ],
      scrolling: 50
    };
    return conf;
  },

  initialize: function () {
    var catalog = this;
    $.getJSON('conf/catalog.json', function(data) {
      catalog.set(data);
    });
  }
});


app.Models.query = Backbone.Model.extend({

  defaults: function() {
    return {
      query: '',
    };
  },

  initialize: function () {
    // initialisation du modèle
    console.log('Init du modèle query');
    this.on('change:query', function(model){
      var query = model.get('query');
      console.log('Le modèle query change. On lance une nouvelle recherche: '
                  + query);
      var href = '/search/' + query;
      console.log('AJAX: ' + href);
      $.get(href, function(rs) {
        if (rs.total > 0 ) {
          app.models.facet.setFromQuery(rs);
          app.models.result.setFromQuery(rs);
        }
      }); 
      return false;
    });
  }
});


app.Models.result = Backbone.Model.extend({

  defaults: function() {
    return {
      query: '',
      total: 0,
      offset: 0,
      hits: [],
      _scroll_id: 0,
      fetching: 0
    };
  },

  initialize: function () {
    // initialisation du modèle
    console.log('Init du modèle result');
  },

  setFromQuery: function(rs) {
    console.log('result setFromQuery');
    app.views.result.loading();
    this.total = rs.total;
    var hits = rs.hits;
    this.hits = hits;
    this.offset = 0;
    this._scroll_id = rs._scroll_id;
    this.fetching = 0;
    app.views.result.render();
    this.offset = hits.length;
  },

  fetch: function() {
    if ( this.fetching ) { return; }
    console.log("fetch: " + this.total + " -- " + this.offset);
    if ( this.total == 0 || this.offset == 0 || this.total == this.offset ) { return; }
    app.views.result.loading();
    this.fetching = 1;
    var href = '/scroll/' + this._scroll_id;
    var hits = this.hits;
    var result = this;
    $.get(href, function(rs) {
      result.offset = result.hits.length;
      result.hits = result.hits.concat(rs.hits);
      console.log('Taille hits: ' + result.hits.length);
      result._scroll_id = rs._scroll_id;
      app.views.result.append();
      result.fetching = 0;
    }); 
  },

  fullyFetched: function() {
    return this.total == 0 || this.offset == this.total ? 1 : 0;
  }
    
});


app.Models.facet = Backbone.Model.extend({

  defaults: function() {
    return {
      facets: []
    };
  },

  setFromQuery: function(rs) {
    console.log('facet setFromQuery');
    this.facets = _.map(
      app.models.catalog.get('facets'),
      function(def) {
        return {
          field: def.field,
          label: def.label,
          terms: _.map(
            rs.facets[def.field].terms,
            function(term) { return [term.term, term.count]; }
          )
        };
      });
    app.views.facet.render();
  },

  initialize: function () {
    // initialisation du modèle
    console.log('Init du modèle facet');
  }
});


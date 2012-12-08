app.Views.main = Backbone.View.extend({
  initialize: function () {
    // initialisation de la vue
    console.log('Main view initialized !');
  }
});


app.Views.facet = Backbone.View.extend({
  initialize: function () {
    console.log('Init view facet.');

  },

  render: function() {
    console.log('view facet: render');
    var facets = app.models.facet.facets;
    var template = _.template($('#templateFacet').html(), { facets: facets });
    $('#facet').html(template);
  }
});



app.Views.result = Backbone.View.extend({
  initialize: function () {
    console.log('Init view result.');

  },

  loading: function() {
    $('#resultloading').show();
  },

  render: function() {
    console.log('view result: render');
    var result = app.models.result;
    var template = _.template($('#templateResultCount').html(), {
      total: result.total,
    });
    $('#result').html(template);
    template = _.template($('#templateResult').html(), {
      hits: result.hits,
      offset: result.offset,
    });
    $('#result').append(template);
    $('#resultloading').hide();
  },

  append: function() {
    var result = app.models.result;
    console.log('view result: append -- ' + result.offset);
    var template = _.template($('#templateResult').html(), {
      hits: result.hits,
      offset: result.offset,
    });
    $('#result').append(template);
    $('#resultloading').hide();
  }
});



var owf = {

  pactol: {

    resize_panels: function() {
      $(window).resize(function() {
        var height = $(document).height() - 170;
        $('#term-selected').height(height);
        $('#term-list').height(height);
      }); 
      $(window).resize();
    },
        
    linkto_listener: function() {
      $(function() {
        $('.pactol-linkto').off('click');
        $('.pactol-linkto').click(function(e) {
          e.preventDefault();
          $('#pactol-action-cd').html('<div style="text-align:left;"><img src="/images/Spinning_wheel_throbber.gif"/></div>');
          var target = $(e.target);
          var pactolname = target.attr('pactolname');
          var term = target.attr('term');
          var href = '/pactol/' + pactolname + '/linkto/' +
                     target.attr('href') + '/' + term;
          $.get(href, function(data) {
            var href = '/pactol/' + pactolname + '/cd/t/' + term;
            $.get(href, function(data) {
              $('#term-selected').replaceWith(data);
            });
          });
        });
      });
    },

    browse_listener: function() {
      $(function() {
        $('div#term-list td').click(function(e) {
          e.preventDefault();
          var target = $(e.target);
          var term = target.html();
          term = term.replace('/', '_');
          var name = $('#pactol-name').text();
          var where = $('#pactol-where').text();
          var href = '/pactol/' + name + '/' + where + '/t/' +
                     encodeURIComponent(term);
          $.get(href, function(data) {
            $('#term-selected').replaceWith(data);
          });
        });
        owf.pactol.resize_panels();
      });
    },

    term_listener: function() {
      $(function() {
        owf.pactol.resize_panels();
        $('.pactol-trans').click(function(e) {
          e.preventDefault();
          $('#pactol-trans-section').html('<img src="/images/Spinning_wheel_throbber.gif"/>');
          var target = $(e.target);
          var href = target.attr('href');
          var term = $('#pactol-term').text();
          var name = $('#pactol-name').text();
          var where = $('#pactol-where').text();
          term = term.replace('/', '_');
          href = '/pactol/' + name + '/trans/' + href + '/' + term;
          $.get(href, function(data) {
            var href = '/pactol/' + name + '/' + where + '/t/' + term;
            $.get(href, function(data) {
              $('#term-selected').replaceWith(data);
            });
          });
        });
        $('#pactol-suppr').click(function(e) {
          e.preventDefault();
          $('#pactol-action-cd').html('<div style="text-align:left;"><img src="/images/Spinning_wheel_throbber.gif"/></div>');
          var term = $('#pactol-term').text();
          var name = $('#pactol-name').text();
          var where = $('#pactol-where').text();
          term = term.replace('/', '_');
          var href = '/pactol/' + name + '/' + where + '/delete/' + term;
          $.get(href, function(data) {
            var href = '/pactol/' + name + '/' + where + '/t/' + term;
            $.get(href, function(data) {
              $('#term-selected').replaceWith(data);
            });
          });
        });
        $('.pactol-move').click(function(e) {
          e.preventDefault();
          $('#pactol-action-cd').html('<div style="text-align:left;"><img src="/images/Spinning_wheel_throbber.gif"/></div>');
          var term = $('#pactol-term').text();
          term = term.replace('/', '_');
          var name = $('#pactol-name').text();
          var where = $('#pactol-where').text();
          var target = $(e.target);
          var tag = target.text();
          var href = '/pactol/' + name + '/' + where + '/move/' + tag + '/' + term;
          $.get(href, function(data) {
            var href = '/pactol/' + name + '/' + where + '/t/' + term;
            $.get(href, function(data) {
              $('#term-selected').replaceWith(data);
            });
          });
        });
        $('#pactol-search').submit(function(e) {
          e.preventDefault();
          var id = $('#pactol-id').val();
          var term = $('#pactol-term').text();
          var name = $('#pactol-name').text();
          term = term.replace('/', '_');
          var href = '/pactol/' + name + '/match/' + id + '/' + term;
          $.get(href, function(data) {
            $('#pactol-matched').replaceWith(data);
          });
        });
        $('#pactol-propose').click(function(e) {
          //e.preventDefault();
          var term = $('#pactol-term').text();
          var name = $('#pactol-name').text();
          var href =
            '/pactol/' + name + '/' +
            (this.checked ? 'propose' : 'unpropose') +
            '/' + term;
          $.get(href);
        });
      });
    },
  },

  skos: {
    loader_listener: function() {
      $(function() {
        $('#start').click(function(e) {
          var href_start = "/skos/loadmem_start/" + $('#filename').text();
          var href_status = "/skos/loadmem_status/" + $('#filename').text();
          alert(href_start);
          var timeout = 200;
          var fnProgress = function() {
            var max = $('.progress').width();
            var width = $('.bar').width();
            width = width * 100 / max;
            width += 10;
            width = width * max / 100;
            if ( width > max ) {
                // Fin
                $('.bar').width(max);
                return;
            }
            $('.bar').width(width);
            window.setTimeout(fnProgress, timeout);
          };
          $('.progress').show();
          window.setTimeout(fnProgress, timeout);
          $.get(href_start, function(data) {
            $('#pactol-matched').replaceWith(data);
          });
        });
      });
    },
  },

};

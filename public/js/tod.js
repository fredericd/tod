var Tod = {

  total: 0,
  offset: 0,
  _scroll_id: 0,
  facets: [
    { field: 'subject', label: 'Subject' },
    { field: 'date', label: 'Date' }
  ],

  run: function() {
    var tod = this;
    $(function() {
      $('#search').submit(function() {
        var href = '/search/' + $('#query').val();
        $.get(href, function(rs) {
          var hits = rs.hits;
          tod.total = rs.total;

          var html = '';
          for (var i in tod.facets) {
            var facet = tod.facets[i];
            html += '<div id="facet_' + facet.field + '">' +
                    '<h4>' + facet.label + '</h4><ul>';
            var terms = rs.facets[facet.field].terms;
            for (var i in terms) {
              var term = terms[i];
              html += '<li><a>' + term.term + '</a> (' + term.count + ')' + '</li>';
            }
            html += '</ul></div>'
          }
          $('#facet').html(html);
          html =
            '<div class="hitscount">Count: ' +
            rs.total +
            '</div>';
          html += '<table>';
          tod.offset = 0;
          for (var i in hits) {
            var rec = hits[i];
            tod.offset += 1;
            html = html +
                '<tr id="' + rec.id + '">' +
                '<td class="count">' + tod.offset + '.</td>' +
                '<td>' + rec.title + '</td>' +
                '</tr>';
          }
          html += '</table>';
          $('#result').html(html);
          tod._scroll_id = rs._scroll_id;
        });
        return false;
      });
    });
    $(window).scroll(function() {
      if ( tod.total == tod.offset) { return; }
      if ( $(window).scrollTop() == $(document).height() - $(window).height() ) {
        var href = '/scroll/' + tod._scroll_id;
        $.get(href, function(rs) {
          var hits = rs.hits;
          html = '<table>';
          for (var i in hits) {
            var rec = hits[i];
            tod.offset += 1;
            html = html +
                '<tr id="' + rec.id + '">' +
                '<td class="count">' + tod.offset + '.</td>' +
                '<td>' + rec.title + '</td>' +
                '</tr>';
          }
          html += '</table>';
          $('#result').append(html);
          tod._scroll_id = rs._scroll_id;
        });
      }
    });
  }
};
Tod.run();

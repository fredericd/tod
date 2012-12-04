package Tod::Webapp;

use 5.010;
use utf8;
use Dancer ':syntax';
use Tod;
use YAML;
use JSON;
use ElasticSearch;
use MARC::Moose::Record;
use MARC::Moose::Reader::File::Iso2709;


my $tod = Tod->new();



sub hits {
    my $res = shift;

    my $total = $res->{hits}{total};
    my $rs = { total => $total };
    if ( $total ) {
        my @hits = map {
            {
                title => join(' ', @{$_->{_source}{245}}),
                id => $_->{_id},
            }
        } @{$res->{hits}{hits}};
        $rs->{hits} = \@hits;
        $rs->{_scroll_id} = $res->{_scroll_id};
        $rs->{facets} = $res->{facets} if $res->{facets};
    }
    return $rs;
}


sub search {
    my $query = shift;
    my $res = $tod->es->search(
        index => 'loc',
        type => 'biblio',
        query => {
            text => { _all => $query }
        },
        facets => $tod->c->{facets},
        scroll => '5m',
        size => 50,
    );
    my $rs = hits($res);
    $rs->{query} = $query;
    return $rs;
}


sub scroll {
    my $scroll_id = shift;
    my $res = $tod->es->scroll(
        scroll_id   => $scroll_id,
        scroll      => '5m',
    );
    my $rs = hits($res);
    return $rs;
}



get '/search/:q' => sub {
    content_type 'application/json';
    my $q = params->{q};
    my $rs = search($q);
    return to_json ($rs, {pretty => 1});
};


get '/scroll/:id' => sub {
    content_type 'application/json';
    my $rs = scroll( params->{id} );
    return to_json ($rs, {pretty => 1});
};


get '/' => sub {
    template 'index';
};


true;

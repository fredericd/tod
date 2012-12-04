package Tod::Biblio::Indexer::Formater;

use Moose;

extends 'MARC::Moose::Formater';

use Modern::Perl;
use YAML;
use XML::LibXML;
use XML::LibXSLT;


has tod => ( is => 'rw', isa => 'Tod', default => sub { Tod->new() } );

has record => ( is => 'rw' );

has h => ( is => 'rw', isa => 'HashRef');


sub add_letter {
    my ($self, $tag, $letter, $index) = @_;

    my @fields = $self->record->field($tag);
    return unless @fields;
    my @values;
    for my $field (@fields) {
        my $value = $field->subfield($letter);
        next unless defined($value);
        $value =~ s/,$//g;
        push @values, $value;
    }
    $self->h->{$index} = \@values if @values;
}


override 'format' => sub {
    my ($self, $record) = @_;

    my $h = {};
    $self->record($record);
    $self->h($h);

    for my $field ( @{$record->fields} ) {
        my $tag = $field->tag;
        $h->{$tag} ||= [];
        if ( ref($field) eq 'MARC::Moose::Field::Control' ) {
            push @{$h->{$tag}}, $field->value;
        }
        else {
            my @concat;
            for ( @{$field->subf} ) {
                my ($letter, $value) = @$_;
                my $tagletter = $tag . $letter;
                next unless $value;
                push @concat, $value if $letter !~ /0|3|9/;
                $h->{$tagletter} ||= [];
                push @{$h->{$tagletter}}, $value;
            }
            push @{$h->{$tag}}, join(' ', @concat)  if @concat;
        }
    }

    # Standards index
    $h->{title} = [ map {
        join(' ', map { $_->[1] } grep { $_->[0] !~ /c/ } @{$_->subf});
    } $record->field('245') ];


    my $field008;
    if ( my $field = $record->field('008') ) {
        $field008 = $field->value;
        my $date = substr($field008, 7, 4);
        $h->{date} = [ $date ];
    }

    $self->add_letter('100|110|111|700|710|711', 'a', 'author');
    $self->add_letter('100|700', 'a', 'personal_name');
    $self->add_letter('110|710', 'a', 'corporate_name');
    $self->add_letter('111|711', 'a', 'meeting_name');
    

    # All subjects fields
    if ( my @fields = $record->field(
          '600|610|611|630|648|650|651|653|654|655|656|657|658|662') )
    {
        $h->{subject} = [ map {
            join('--', map { $_->[1] } grep { $_->[0] !~ /9|3/ } @{$_->subf});
        } @fields ];
    }

    # Description
    if ( my @fields =  $record->field('500|505|518|520|522') ) {
        $h->{description} = [ map {
            join(' ', map { $_->[1] } grep { $_->[0] !~ /9|3/ } @{$_->subf});
        } @fields ];
    }
    
    # LCCN
    $self->add_letter('010', 'a', 'lccn');

    # ISBN
    if ( my @fields = $record->field('020') ) {
        my @isbns;
        for my $field (@fields) {
            if ( my $isbn = $field->subfield('a') ) {
                if ( $isbn =~ /\(/ ) {
                    ($isbn) = $isbn =~ /([0-9\-]*) \(/;
                }
                push @isbns, $isbn;
            }
        }
        $h->{isbn} = \@isbns if @isbns;
    }

    # ISSN
    $self->add_letter('022', 'a', 'issn');

    # physical description
    if ( my @fields = $record->field('300') ) {
        $h->{physical_description} = [ map {
            join(' ', map { $_->[1] } grep { $_->[0] !~ /3|6|8/ } @{$_->subf});
        } @fields ];
    }

    # Edition 250
    if ( my @fields = $record->field('250') ) {
        $h->{edition} = [ map {
            join(' ', map { $_->[1] } grep { $_->[0] !~ /6|8/ } @{$_->subf});
        } @fields ];
    }

    # language
    {
        my @language;
        push @language, substr($field008, 35, 3)
            if $field008 && length($field008) >= 38 ;
        if ( my $field = $record->field('041') ) {
            for ( @{$field->subf} ) {
                my (undef, $lang) = @$_;
                while ( length($lang) >= 3 ) {
                    push @language, substr($lang, 0, 3);
                    $lang = substr($lang, 3);
                }
            }
        }
        $h->{language} = \@language if @language;
    }
    $h->{iso} = $record->as('Iso2709');

    return $h;
};


1;

package Tod;
use Moose;

use FindBin qw( $Bin );
use lib "$Bin/../lib";
use YAML qw( LoadFile Dump );
use ElasticSearch;


# La racine de l'environnement d'exécution
has tod_root => ( is => 'rw', isa => 'Str' );


# Le contenu du fichier de config
has c => ( is => 'rw', );

has es => ( is => 'rw', );

sub BUILD {
    my $self = shift;

    my $tod_root = $Bin;
    $tod_root =~ s/\/bin$//;
    $self->tod_root( $tod_root );

    # Lecture du fichier de config et création du hash branchcode => RCR par ILN
    my $file = "$tod_root/etc/tod.conf";
    my $c = LoadFile($file);
    $self->c($c);


    $self->es( ElasticSearch->new( $c->{elasticsearch} ) );
}



1;

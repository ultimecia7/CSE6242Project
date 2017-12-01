<?php

$source = $_GET['source'];
$target = $_GET['target'];

$comment = "python python.py ".$source." ".$target;

system($comment);

?>
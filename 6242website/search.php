<?php

$name = $_GET['name'];

   class MyDB extends SQLite3
   {
      function __construct()
      {
         $this->open('song.db');
      }
   }
   $db = new MyDB();
   if(!$db){
      echo $db->lastErrorMsg();
   } else {
      //echo "Opened database successfully\n";
   }

   $sql =<<<EOF
      select * from songs where title like "$name";
EOF;

   $ret = $db->query($sql);
	echo "-Select-<SPE>null";
	while($row = $ret->fetchArray(SQLITE3_ASSOC) ){
		echo "^".$row['title'];
		echo "--".$row['album'];
		echo "<SPE>".$row['ID'];
	}
   
   $db->close();

?>
<?php
session_start();
define('WORK_MODE', 'production'); // production / developing

	if(WORK_MODE == "developing")
	{
		error_reporting(E_ALL);
		define('HOST', '10.100.9.106');
		define('USER', 'opensource');
		define('PASSWORD', 'kgisl123');
		define('DATABASE', 'alphacraft');
		define('PORT', "5432");
        define('BASE_URL', "http://localhost/sam_mis/");
        define('CRN_BASE_FOLDER', "sam_mis");
	}
	else if(WORK_MODE == "production")
	{
		error_reporting(E_ALL);
		define('HOST', '192.168.1.5');
		define('USER', 'openerp');
		define('PASSWORD', 'OpenErp~!32');
		define('DATABASE', 'sam_phaseI');
		define('PORT', "5432");
		define('BASE_URL', "http://localhost/sam_mis/");
		define('CRN_BASE_FOLDER', "sam_mis");
	}

define('BASE_PATH', str_replace("\\", "/", realpath("")));
?>
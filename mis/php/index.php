<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
date_default_timezone_set('Asia/Kolkata');

include("config.php");
include("global.php");

$f_split = explode("/", trim(str_replace("://", "", BASE_URL), "/"));

$url_str = explode("?", trim($_SERVER['REQUEST_URI'], "/"));

$url_segment = explode("/", $url_str[0]);



if (count($f_split) > 1)
    for ($d = 1; $d < count($f_split); $d++) {
        array_shift($url_segment);
    }

$controller = $url_segment[2];
$method = $url_segment[3];

// >>> first lever parameter
$parameter_1 = $url_segment;
unset($parameter_1[0]);
unset($parameter_1[1]);
$parameter_1 = array_values($parameter_1);
// <<< first lever parameter


//print_r($parameter_1);exit;
// >>> second lever parameter
$parameter_2 = array();

if (isset($url_str[1])) {
    $spl_1 = explode("&", $url_str[1]);
    foreach ($spl_1 as $key => $val) {
        $spl_2 = explode("=", $val);
        $parameter_2[$spl_2[0]] = trim(str_replace("%20", " ", $spl_2[1]));
    }
}

$browser_title = ucwords(str_replace("_", " ", $controller));

$isAjas = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest');
define("ISAJAX", $isAjas);

include("controller/MController.php");

include("controller/" . $controller . ".php");
$object = new $controller;

$object->$method($parameter_1, $parameter_2);

//if($file_name != $lg_page && $isAjas == false) include("assets/header.php");
//	include("controller/".$file_name.".php");
//if($file_name != $lg_page && $isAjas == false) include("assets/footer.php");
?>

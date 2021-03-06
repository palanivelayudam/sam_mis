<?php
trait Custom
{	
	function fetch_all($result,$opt = "id")
    {
		$result_type = MYSQL_ASSOC;
		
        if (!is_resource($result) || get_resource_type($result) != 'mysql result')
        {
            trigger_error(__FUNCTION__ . '(): supplied argument is not a valid MySQL result resource', E_USER_WARNING);
            return false;
        }
        if (!in_array($result_type, array(MYSQL_ASSOC, MYSQL_BOTH, MYSQL_NUM), true))
        {
            trigger_error(__FUNCTION__ . '(): result type should be MYSQL_NUM, MYSQL_ASSOC, or MYSQL_BOTH', E_USER_WARNING);
            return false;
        }
        $rows = array();
        while ($row = mysql_fetch_array($result, $result_type))
        {
            $rows[] = $row;
        }
		
		if($opt == "id")
		return idBasedArray($rows);
		else
        return $rows;
    }
	
	function idBasedArray($inp,$base = "id")
	{
		$opt = array();
		
		foreach($inp as $v)
		{
			$id = $v[$base];
			unset($v[$base]);
			
				if(count($v) == 1)
				{			
				reset($v);	$fk = key($v);
				$opt[$id] = $v[$fk];
				}
				else
				$opt[$id] = $v;	
		}	
		return $opt;
	}
	
	function findDim($array)
	{
		if (is_array(reset($array)))
		{
			$return = findDim(reset($array)) + 1;
		}

		else
		{
			$return = 1;
		}

		return $return;
	}
		
	function qur_values($inp_data,$other = array())
	{			
		$mand = isset($other['mandatory'])?$other['mandatory']:false;
		$add_col = isset($other['add_col'])?$other['add_col']:false;
		$sql_type = isset($other['sql_type'])?$other['sql_type']:"mysql";
		$table = isset($other['table'])?$other['table']:"";
		$for = isset($other['for'])?$other['for']:"insert";
		$where = isset($other['where'])?$other['where']:false;	
		
		$s = $sql_type == "mysql"?"`":"";
		
		$inValues = array();
		$cols = "";
		$keys = "";
		if($for == "insert")
		{
			if($this->findDim($inp_data) == 1)
			{ 
				$keys = array_keys($inp_data);				
				
				//array_walk($inp_data, function(&$a, $b) { $a = "'".trim($a)."'"; });	
				foreach($inp_data as $k=>$v)
				{
					$inp_fData[$k] = "'".trim($v)."'";
				}
				
			$inValues[] = implode(",",$inp_fData);	
			
			}
			else
			{		
			reset($inp_data);
			$first_key = key($inp_data);
			
			$keys = array_keys($inp_data[$first_key]);
			
			if(!empty($add_col)) $keys[] = $add_col[0];
			
				foreach($inp_data as $pk=>$pv)
				{			
					//array_walk($pv, function(&$a, $b) { $a = "'".trim($a)."'"; });		
					if(empty($mand) || !empty($pv[$mand]))
					{
						
						foreach($pv as $k=>$v)
						{
							$pFdata[$k] = "'".trim($v)."'";
						}
						
						if(!empty($add_col)) $pFdata[$k+1] = "'".$add_col[1]."'";
						
					$inValues[] = implode(",",$pFdata);			
					}
				}
			}
				
				//array_walk($inValues, function(&$a, $b) { $a = "($a)"; });	
				//array_walk($keys, function(&$a, $b) { $a = "`$a`"; });		
				foreach($inValues as $k=>$v)
				{
					$inValuesF[$k] = "($v)";
				}
				
				foreach($keys as $k=>$v)
				{
					$keysF[$k] = "{$s}$v{$s}";
				}
				
			$cols = "(".implode(",",$keysF).")";		
			
			$vals = implode(",",$inValuesF);				
		}
		else
		{
			foreach($inp_data as $ik=>$iv) { $res[] = "{$s}{$ik}{$s} = '".trim($iv)."'"; }
			
			$vals = implode(",",$res);
			$cols = "";
		}
		
		if(empty($table))
			return array("values"=>$vals,"columns"=>$cols);
		else
		{
			if($for == "insert")
			{
			$qry = "INSERT INTO {$table} {$cols} VALUES {$vals} RETURNING id";
			}
			elseif($for == "update")
			{
			$qry = "UPDATE {$table} SET {$vals} WHERE {$where} RETURNING id";				
			}		
			//echo $qry; exit;
			$ret = pg_query($qry);

			return (!empty($ret))? pg_fetch_all($ret):false;
		}
	}
	
	function uploadFile($FName,$TName,$path)
	{		
		$ext = pathinfo($FName, PATHINFO_EXTENSION);
		$eName = rtrim($FName,".".$ext);										
		
		$name = $path."/".$eName.".".$ext;
		$sName = $eName.".".$ext;
		if(file_exists($name)) 
		{ 										
			
			$fileExt = glob($path."/{$eName}_*.".$ext);										
			if(empty($fileExt))
			{ 
				$inNm = $eName."_1";
			}											
			else
			{
				$incAra = array();
				foreach($fileExt as $ek=>$ev)
				{
					$flNm = explode("_",ltrim($ev,$path));
					$inc = explode(".",$flNm[count($flNm) - 1]);									
					$incAra[] = $inc[0];
				}
				$incV = max($incAra) + 1;
				$inNm = $eName."_".$incV ;	
			}	
			
			$name = $path."/".$inNm.".".$ext; $sName = $inNm.".".$ext;													
		}		
		$uploaded = move_uploaded_file($TName, $name);	
				
		if(!empty($uploaded))
			return $sName;
		else
			return $uploaded;
	}
	
	function send_email($data)
	{											
		require_once("class.phpmailer.php");

		$to_data = array_unique(explode(",",$data['to']));
		
		foreach($to_data as $e)
		{
			$mail = new PHPMailer();
			$mail->IsSMTP(); 
			$mail->Host = "10.100.1.209"; // 123  
			$mail->IsHTML(true);   
			$mail->WordWrap = 50;	
			$mail->From = "internalapps@kggroup.com";		
			$mail->FromName = "KGISL reminder";			
			
			if(!empty($data["attach"]))
			$mail->AddAttachment($data["attach"]['path'], $data["attach"]['name']);
			
			if(isset($data['cc']))
			foreach(explode(",",$data['cc']) as $cc) { $mail->AddCC($cc); }
		
			if(isset($data['bcc']))
			foreach(explode(",",$data['bcc']) as $bcc) { $mail->AddBCC($bcc); }
			
			$mail->AddAddress($e);		
			
			$mail->Subject = $data['subject'];
			$mail->Body = $data['body'];
			
			if(!$mail->Send()){ echo 'Message was not sent.'; }
		}			
	}
	
	function enum_toara($ename)
	{
		$qry1 = "SELECT enum_range(NULL::{$ename})";
		$gnd = pg_query($qry1);
		$genderE = pg_fetch_array($gnd, null, PGSQL_ASSOC);
	
	$split = explode(",",trim(trim($genderE['enum_range'],"}"),"{"));
	return $split;
	}

	function get_master($table,$other=array())
	{
	$wr = isset($other['where'])?$other['where']:false;
	$order_by = isset($other['order_by'])?$other['order_by']:"name";
	
	$where = (!empty($wr))?" AND {$wr}":"";
	
		$qry1 = "SELECT id,name FROM {$table} WHERE status = 'active' {$where} ORDER BY {$order_by}";
		
		$gnd = pg_query($qry1);
		$res = pg_fetch_all($gnd);
		
	return empty($res)?"":idBasedArray($res);
	}
	
	function getFromNotepad($data_ara)
	{
		$opt_data = array();
		$imei = "";
		$folder = isset($data_ara['folder'])?trim($data_ara['folder'],"/"):"../".CRN_BASE_FOLDER."/webroot/vehile_data";
				
		$imei = $data_ara['imei'];

		if(empty($imei)) goto endNoAction;
		
		$file = $folder."/".$imei.".txt";
		
		$preCont = (!file_exists($file))?"":file_get_contents($file);
		
		if(empty($preCont)) goto endNoAction;
		
		$opt_data = json_decode($preCont,true);
			
	endNoAction:				
	
	return $opt_data;
	}
	
	function changeStatusInNotepad($data_ara,$is_crm = true)
	{	
		if(isset($data_ara['kep_pre_data']))
		{
			$kep_pre = $data_ara['kep_pre_data'];
			unset($data_ara['kep_pre_data']);
		}
		else
		$kep_pre = false;
			
		$imei = "";
		$folder = isset($data_ara['folder'])?trim($data_ara['folder'],"/"):"../".CRN_BASE_FOLDER."/webroot/vehile_data";
				
			$imei = $data_ara['imei'];

			if(empty($imei)) goto endNoAction;
			

		$file = $folder."/".$imei.".txt";
		$cur_km = 0;
		
		$preCont = (!file_exists($file))?"":file_get_contents($file);

		$pre_status = "";
		
		if($is_crm == true)
		{
			if(empty($preCont))
			{
				$new_contAra = array("imei"=>$imei,"status"=>$data_ara['vehicle_status'],"lat"=>"","long"=>"");
			}
			else
			{			
				$new_contAra = json_decode($preCont,true);
				$pre_status = $new_contAra["status"];  
				$new_contAra["status"] = $data_ara['vehicle_status'];
			}			
		}
		else
		{			
			if(empty($kep_pre))
			{
				$new_contAra = $data_ara;
			}
			else
			{			
				$new_contAra = json_decode($preCont,true);
				
				if(isset($data_ara['km_after_last']) && $data_ara['km_after_last'] > 0)
				{
					$new_contAra["current_km"] = $new_contAra["current_km"] + $data_ara['km_after_last'];
					$cur_km = $new_contAra["current_km"];
				}
								
				foreach($data_ara as $dk=>$dv)
				{
					$new_contAra[$dk] = $dv;
				}
			}			
		}
		
		$new_cont = json_encode($new_contAra);
		file_put_contents($file,$new_cont);

		return array("status"=>$pre_status,"current_km"=>$cur_km); 
		
		endNoAction:			
	}
	
	// >>> auto_increment
	function genIncNumber($type,$prev)
	{
	   $opt = 0;
	   $ts_fmt = date($type);
	   $get_fm = substr($prev,0,strlen($ts_fmt));
	   $sno = substr($prev,strlen($get_fm));

	   if($get_fm != $ts_fmt) $opt = $ts_fmt."1"; else $opt = $ts_fmt."".($sno + 1);

	   complete:

	   return $opt;
	}

	function getNextIncrement($type)
	{
	   /* $joins = array
	   (
		  'site_settings' => array
		  (
			 'table' => 'site_settings',
			 'type' => 'left',
			 'conditions' => 'site_settings.property = auto_increment.format'
		  )
	   ); */

	   /* $queryIn = $this->model['auto_increment']->find("all")
		  ->join($joins)->select(["previous_no","current_prefix","min_pad","format","site_settings.property_value"])
		  ->where(["auto_increment.type" => $type])
		  ->hydrate(false); */
		  
		$qry1 = "SELECT previous_no,current_prefix,min_pad,format,ss.property_value FROM auto_increment ai LEFT JOIN site_settings ss ON ss.property = ai.format WHERE ai.type = '{$type}'";
		
		$pnf = pg_query($qry1);
		$inc[0] = pg_fetch_array($pnf, null, PGSQL_ASSOC);

	   if(!empty($inc[0]['site_settings']['property_value']) && strtolower($inc[0]['site_settings']['property_value']) != "serial")
	   {
		  $now_no = $this->genIncNumber($inc[0]['site_settings']['property_value'],$inc[0]["previous_no"]);
	   }
	   else
	   {
		  $now_no = isset($inc[0]["previous_no"])?$inc[0]["previous_no"] + 1:1;
	   }

	   $pad =(!empty($inc[0]["min_pad"]))?$inc[0]["min_pad"]:10;

	   $num_pad = 0;
	   if(isset($inc[0]["current_prefix"]) && strlen($inc[0]["current_prefix"]) < $pad)
		  $num_pad = $pad - strlen($inc[0]["current_prefix"]);

	   $nxno = str_pad($now_no,$num_pad,0,STR_PAD_LEFT);

	   return isset($inc[0]["current_prefix"])?$inc[0]["current_prefix"].$nxno:$nxno;
	}

	function setThisIncrement($type,$val)
	{
	   $value = preg_replace("/[^0-9]/","",$val);

	   pg_query("UPDATE auto_increment SET previous_no = '{$value}' WHERE type = '{$type}'");
	}
	
	// <<< auto_increment
	
	function sentSMS($data)
	{
		$msg = str_replace(" ","+",$data['message']);
		$toAra = explode(",",$data['to']);
		
		foreach($toAra as $mob)
		{
			$url ="http://nettyhost.com/smsapi/TR/sendmsg.aspx?username=saravanacalltaxi&password=welcome12345&message={$msg}&mobile={$mob}&sendername=SATAXI";

			$content = "";
			$ch = curl_init($url);
			curl_setopt($ch, CURLOPT_POST, true);
			curl_setopt($ch, CURLOPT_POSTFIELDS, $content);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			$output[] = curl_exec ($ch);
			curl_close ($ch);		
		}	

		return ($output);
	}
	
	function get_address($lat,$long)
	{
		$geocodeFromLatLong = file_get_contents('http://maps.googleapis.com/maps/api/geocode/json?latlng='.trim($lat).','.trim($long).'&sensor=false'); 
		$output = json_decode($geocodeFromLatLong);
		$status = $output->status;
		$address = ($status=="OK")?$output->results[1]->formatted_address:'';
		
		return $address;
	}
}

function download() {
  var sketchname = $("input[name='stc1000p_version']:checked").val();
  if(sketchname != "picprog_ovbsc"){
	sketchname += $("input[name='stc1000p_subversion']:checked").val();
  }
  var eeprom1 = generate_hex();
  if($("#tempscale").val() == "C"){
	  $("#tempscale").val("F");
  } else {
	  $("#tempscale").val("C");
  }
  update_temperature_scale();
  var eeprom2 = generate_hex();
  if($("#tempscale").val() == "C"){
	  $("#tempscale").val("F");
  } else {
	  $("#tempscale").val("C");
  }
  update_temperature_scale();
  var pom = document.createElement('a');
  pom.setAttribute('href', 'data:text/x-arduino;charset=utf-8,' + encodeURIComponent(stc1000p["picprog"] + stc1000p["stc1000p"+sketchname] + eeprom1 + eeprom2));
  pom.setAttribute('download', 'picprog' + sketchname + '.ino');
  document.body.appendChild(pom);
  pom.click();
  document.body.removeChild(pom)
}

function ramp(prog, step, dur){
	var t = (dur << 6);
	var sp = 32;
	var i;
	var profile_step_dur = $('#dh' + prog + '_' + step).val();
	var profile_step_sp = Math.round($('#sp' + prog + '_'  + step).val() * 10.0);
	step++;
	var profile_next_step_sp = Math.round($('#sp' + prog + '_'  + step).val() * 10.0);

	// Linear interpolation calculation of new setpoint (64 substeps)
	for (i = 0; i < 64; i++) {
		if (t >= profile_step_dur) {
			t -= profile_step_dur;
			sp += profile_next_step_sp;
		} else {
			sp += profile_step_sp;
		}
	}
	sp >>= 6;

	return (sp / 10.0);
}

function calc(){
	var i,j,k;

	$('#hexdata').html('');

	for(k=0; k<6; k++) {
		var x = 0;
		var y = Math.round($('#sp' + k + '_' + 0).val() * 10) / 10.0;
		var plotdata = [];
		var xmax=0;

		for(i=0; i<9; i++){
			var dh = Math.round($('#dh' + k + '_' + i).val());
			if(dh===0){
				break;
			}
			xmax += dh;
		}

		if($("input[name='stc1000p_version']:checked").val() == ""){
			var unit = "Hours";
			var divisor = 1.0;
			if(xmax >= (24*7*2)){ // 2 weeks or more?
				unit = "Weeks";
				divisor = (7*24.0);
			} else if(xmax >= (24*2)){ // 2 Days or more?
				unit = "Days";
				divisor = 24.0;
			}
		} else {
			var unit = "Minutes";
			var divisor = 1.0;
			if(xmax >= (60*24*2)){ // 2 days or more?
				unit = "Days";
				divisor = (60*24.0);
			} else if(xmax >= (60*2)){ // 2 hours or more?
				unit = "Hours";
				divisor = 60.0;
			}
		}

		for(i=0; i<9; i++) {
			var d1 = [];
			var dh = $('#dh' + k + '_' + i).val();
			y = Math.round($('#sp' + k + '_' + i).val() * 10.0) / 10.0;
			d1.push([x/divisor, y]);
			if(dh==0){
				break;
			}
			for(j=0; j < dh; j++){
				if($('#menu_param_rP').val() != "0"){
					d1.push([x/divisor, y]);
					y = ramp(k, i, j);
					d1.push([x/divisor, y]);
				}
				x++;
			}
			d1.push([x/divisor, y]);
			y = Math.round($('#sp' + k + '_' + (i+1)).val() * 10.0) / 10.0;
			d1.push([x/divisor, y]);
			plotdata.push({label: "Profile step: "+i, data: d1});
		}

		var d2 = [];
		d2.push([x/divisor, y]);
		d2.push([(x + x/8)/divisor, y]);
		plotdata.push({label: "Thermostat", data: d2});

		var activeTab = $("#tabs").tabs("option", "active");
		$("#tabs").tabs("option", "active", k);

			$.plot(
						$("#placeholder" + k),
						plotdata,
						{
							series: {
								points: { show: false },
								lines: { show: true }
							},
							axisLabels: {
								show: true
							},
							xaxes: [{
								axisLabel: unit,
								tickFormatter: function(val, axis) { return val.toFixed(1);}
							}],
							yaxes: [{
								position: 'left',
								axisLabel: 'Temperature',
								axisLabelPadding: 8,
								tickFormatter: function(val, axis) { return val.toFixed(2);}
							}]

						}
					);

		$("#tabs").tabs("option", "active", activeTab);

	}
}

function update_temperature_scale(){
	if($("#tempscale").val() == "C"){
		$("span.tscale").html("[&deg;C]");
		$("span.tscalename").html("Celsius");
		$(".temperature").each(	function(){
			var t = $(this).val();
			$(this).val((Math.round(((t-32.0)*5.0)/0.9) / 10.0).toFixed(1));
		});
		$(".tempdiff").each(	function(){
			var t = $(this).val();
			$(this).val(Math.round(t*0.5).toFixed(1));
		});
	} else {
		$("span.tscale").html("[&deg;F]");
		$("span.tscalename").html("Fahrenheit");
		$(".temperature").each(	function(){
			var t = $(this).val();
			$(this).val((Math.round(((t*9.0)/0.5)+320.0) / 10.0).toFixed(1));
		});
		$(".tempdiff").each(	function(){
			var t = $(this).val();
			$(this).val(Math.round(t*2.0).toFixed(1));
		});
	}
	calc();
}

function update_duration_scale(){
	if($("input[name='stc1000p_version']:checked").val() == "" || $("input[name='stc1000p_version']:checked").val() == "_rh"){
		$("span.durscale").html("[h]");
	} else {
		$("span.durscale").html("[min]");
	}
	calc();
}

function dec2hex(decv){
	var hexstr="0x";
	if(decv<16){
		hexstr+="0";
	}
	return hexstr + Number(decv & 0xFF).toString(16).toUpperCase();
}

function generate_hex(){
	var m,n;
	var x=0;
	var adr = [128];

	for(m=0; m<128; m++){
		adr[m] = 65535;
	}

	var fw_version = $("input[name='stc1000p_version']:checked").val();

	if(fw_version == "" || fw_version == "_minute"){
		for(m=0; m<6; m++) {
			for(n=0; n<10; n++) {
				var sp = $('#sp' + m + '_' + n).val();
				adr[x] = Math.round(sp*10.0);
				x++;
				if(n==9){
					break;
				}
				var dh = $('#dh' + m + '_' + n).val();
				adr[x] = dh;
				x++;
			}
		}
	}

	$("input[name^='menu" + fw_version + "_param_']:enabled").each(function(){
		if($(this).hasClass('temperature') || $(this).hasClass('tempdiff') || $(this).hasClass('period')){
			adr[x] = Math.round($(this).val() * 10.0);
		} else {
			adr[x] = Math.round($(this).val());
		}
		x++;
	});

	var i=0;
	var output="";
	if($("#tempscale").val() == "C"){
		output+="const char hex_eeprom_celsius[] PROGMEM = {\n";
	} else {
		output+="const char hex_eeprom_fahrenheit[] PROGMEM = {\n";
	}
	output+="\t0x02,0x00,0x00,0x04,0x00,0x00,0xFA,\n";
	output+="\t0x02,0x00,0x00,0x04,0x00,0x01,0xF9,\n";

	for(i=0; i<128; i+=4){
		var checksum;
		if(i<64){
			output+="\t0x10,0xE0,";
			checksum = 0x10 + 0xE0;
		} else {
			output+="\t0x10,0xE1,";
			checksum = 0x10 + 0xE1;
		}
		var hexadr = (i%64)*4;
		checksum += hexadr;
		output+=dec2hex(hexadr);
		output+=",0x00,";

		var j=0;
		for(j=0; j<4; j++){
			var val=adr[i+j];
			var lval = (val & 0xFF);
			var hval = ((val>>8) & 0xFF);
			checksum += lval + 0x34 + hval + 0x34;
			output += dec2hex(lval) + ",0x34," + dec2hex(hval) + ",0x34,";
		}

		// Two's complement checksum
		checksum = (0x100 - (checksum & 0xFF)) & 0xFF;
		output+= dec2hex(checksum) + ",\n";
	}

	output+="\t0x00,0x00,0x00,0x01,0xFF\n";
	output+="};\n";

	return output;
}

function setCookie(cname, cvalue, exdays) {
	if (exdays === undefined) { exdays = 999; }
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function save_cookie(){
	var t="tempscale~" + $("#tempscale").val();
	$(":text").each(function(i, obj){
	  t+="^";
	  t+=obj.id;
	  t+="~";
	  t+=obj.value;
	});

	setCookie("stc1000p", t);
}

function restore_cookie(){
	var cdata = getCookie("stc1000p");
	if(cdata.length > 0){
		var darr = cdata.split('^');
		for(var i=0; i<darr.length; i++){
			var kv = darr[i].split('~');
			$("#"+kv[0]).val(kv[1]);
		}
		calc();
	}
}

$(document).ready(function () {
	$( "#tabs" ).tabs();

	$( ".recalc" ).change(function() {
		calc();
	});

	$("input[name='stc1000p_version']").change(
		function(){
			var fw_version = $(this).val();

			$('*[class*="show_version"]').hide();
			$(".show_version"+ fw_version).show();

			if(fw_version == "_rh" && $("#tempscale").val() == "F"){
				$("#tempscale").val("C");
				update_temperature_scale();
			}

			update_duration_scale();
		}
	);

	$("input[name='stc1000p_subversion']").change(
		function(){
			var fw_subversion = $(this).val();
			$('*[class*="en_"]').attr('disabled', 'disabled');
			$(".en"+ fw_subversion+"_subversion").removeAttr('disabled');
		}
	);

	$("#tempscale").change(
		function(){
			update_temperature_scale();
		}
	);




});

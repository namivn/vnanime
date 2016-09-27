// Akune Media
// Release date: 2011-02-21
// More info: http://support.eazy.vn/
// user defined variable
// --------------------------------------------------------------------------------------
// var fdsarc_timeSet=30;
// var cboxmain_height=270;
// var cboxform_height=90;
// var fdsarc_autoLoad=true;
// var fdsarc_infoText='Auto-refresh:';
// var fdsarc_cboxmainID='http://www2.cbox.ws/box/?boxid=2233716&amp;boxtag=w5t8js&amp;sec=main';
// var fdsarc_cboxformID='http://www2.cbox.ws/box/?boxid=2233716&amp;boxtag=w5t8js&amp;sec=form';
// var fdsarc_onOptionText='ON';
// var fdsarc_onOptionTitle='Click to check automatically for new messages';
// var fdsarc_offOptionText='OFF';
// var fdsarc_offOptionTitle='Stop automatic checking for new messages';
// the script
// --------------------------------------------------------------------------------------
var fdsarc_chatFrameName='cboxmain';
var fdsarc_showOption=true; // true or false (true:tampilkan tombol, false:sembunyikan)
var fdsarc_loopRefresh;
fdsarc_creditURL='http://c3thachthat.hnsv.com';
fdsarc_creditText='&copy;Akune Media';
fdsarc_creditTitle='Akune Media';
function fdsarc_refresh() {
fdsarc_messageBox=document.getElementsByName(fdsarc_chatFrameName)[0];
fdsarc_messageBox.src=fdsarc_messageBox.src;
fdsarc_realTimeSet=fdsarc_timeSet*1000;
fdsarc_loopRefresh=setTimeout('fdsarc_refresh()',fdsarc_realTimeSet);
}
function fdsarc_writeElement() {
document.write('<div id="fdsarc_elementDiv" style="overflow:hidden; margin-top:2px;">');
document.write('<div style="text-align:center; line-height:0;" id="cboxdiv">');
document.write('<div><iframe width="100%" scrolling="auto" height="'+cboxmain_height+'" frameborder="0" id="cboxmain" style="border: 0px solid;" name="cboxmain" allowtransparency="yes" marginwidth="2" marginheight="2" src="'+fdsarc_cboxmainID+'"></iframe></div>');
document.write('<div><iframe width="100%" scrolling="no" height="'+cboxform_height+'" frameborder="0" id="cboxform" style="border: 0px solid;border-top:0px" name="cboxform" allowtransparency="yes" marginwidth="2" marginheight="2" src="'+fdsarc_cboxformID+'"></iframe></div>');
document.write('</div>');
document.write('<table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:0; padding:0; color:#666; font-family:Tahoma,Arial,sans-serif; font-size:11px; line-height:13px;"><tbody><tr>');
document.write('<td align="right" width="100%"><div id="fdsarc_optionDiv" style="vertical-align:bottom;">'+fdsarc_infoText+' <span onclick="fdsarc_setOptionOn();" title="'+fdsarc_onOptionTitle+'" style="cursor:pointer;"><input type="radio" name="fdsarc_OnOptionRadio" value="on" onclick="fdsarc_setOptionOn()" onFocus="this.blur();" style="vertical-align:bottom; cursor:pointer; margin:0 1px 0 3px;" />'+fdsarc_onOptionText+'</span>&nbsp;<span onclick="fdsarc_setOptionOff();" title="'+fdsarc_offOptionTitle+'" style="cursor:pointer;"><input type="radio" name="fdsarc_OffOptionRadio" value="off" onclick="fdsarc_setOptionOff();" onFocus="this.blur();" style="vertical-align:bottom; cursor:pointer; margin:0 1px 0 3px;" />'+fdsarc_offOptionText+'</span></div></td>');
document.write('</tr></tbody></table>');
document.write('<table width="100%" ><tr>');
document.write('<th scope="col" width="50%"><div align="left" style="font-size:8px"><a href="http://support.eazy.vn/" align="left" title="Click here to get this Cbox" target="_blank">Get This</a></div></th>');
document.write('<th scope="col" width="50%"><div align="right" style="font-size:8px"><a href="'+fdsarc_creditURL+'" align="right" title="'+fdsarc_creditTitle+'" target="_blank">'+fdsarc_creditText+'</a></div></th>');
document.write('</tr></table>');
document.write('</div>');
document.write('<sty'+'le>'
+'#fdsarc_footer '+'{ display:none; } '
+'#fdsarc_footer,#fdsarc_footer td,#fdsarc_footer a '+'{  } '
+'#fdsarc_footer a,#fdsarc_footer a:visited '+'{  } '
+'#fdsarc_footer a:hover '+'{  } ');
document.write('</sty'+'le>');
document.write('<div id="fdsarc_footer">'
+'<a href="http://c3thachthat.hnsv.com/">Forum C3 Thach That</a>'
+'<br/>'
+'<a href="http://support.eazy.vn/">Forum Support Eazy.vn</a>'
+'</div>');
}
function fdsarc_setOptionOn() {
clearTimeout(fdsarc_loopRefresh);
if (fdsarc_timeSet>=5) {
fdsarc_refresh();
}
else {
fdsarc_timeSet=15;
fdsarc_refresh();
}
document.getElementsByName('fdsarc_OnOptionRadio')[0].checked=true;
document.getElementsByName('fdsarc_OffOptionRadio')[0].checked=false;
}
function fdsarc_setOptionOff() {
clearTimeout(fdsarc_loopRefresh);
document.getElementsByName('fdsarc_OnOptionRadio')[0].checked=false;
document.getElementsByName('fdsarc_OffOptionRadio')[0].checked=true;
}
function fdsarc_start() {
fdsarc_writeElement();
if (fdsarc_showOption) {
document.getElementById('fdsarc_optionDiv').style.display='block';
}
else {
document.getElementById('fdsarc_optionDiv').style.display='none';
}
if (fdsarc_autoLoad) {
fdsarc_setOptionOn();
}
else {
fdsarc_setOptionOff();
}
}
window.onload=fdsarc_start(); 
const $=id=>document.getElementById(id);
const money=n=>Math.round(n).toLocaleString("ko-KR")+"원";

function isHolidayOrWeekend(d){
  // 1차 버전: 토/일은 자동 할증.
  // 공휴일은 별도 달력 데이터 없이 자동 판정하지 않고 아래 수동 스위치로 적용.
  return d.getDay()===0 || d.getDay()===6;
}
function isNight(d){
  const h=d.getHours();
  return h>=18 || h<9;
}
function autoSurcharge(){
  const d=new Date();
  return isHolidayOrWeekend(d)||isNight(d);
}
function calculate(){
  const distance=Math.max(0,Number($("distance").value)||0);
  const wait=Math.max(0,Number($("wait").value)||0);

  const extraKm=Math.max(0,distance-10);
  const extraFee=extraKm*2300;

  const surcharge=$("manualSurcharge").checked||autoSurcharge();
  const surchargeFee=surcharge?(19100+extraKm*460):0;

  // 공식 표의 구간: ~30분=0, 30:01~40=1, 40:01~50=2...
  const waitUnits=wait<=30?0:Math.ceil((wait-30)/10);
  const waitFee=waitUnits*6000;

  const total=95500+extraFee+surchargeFee+waitFee;

  $("total").innerHTML=Math.round(total).toLocaleString("ko-KR")+"<span>원</span>";
  $("baseFee").textContent=money(95500);
  $("extraKm").textContent=extraKm.toFixed(2)+" km";
  $("extraFee").textContent=money(extraFee);
  $("surchargeFee").textContent=money(surchargeFee);
  $("waitFee").textContent=money(waitFee);

  const label=$("surchargeLabel");
  label.textContent=surcharge?"할증 적용":"정상요금";
  label.className=surcharge?"active":"normal";
}
$("calc").addEventListener("click",calculate);
["distance","wait","manualSurcharge"].forEach(id=>$(id).addEventListener("input",calculate));
$("reset").addEventListener("click",()=>{
  $("distance").value="";
  $("wait").value="";
  $("manualSurcharge").checked=false;
  calculate();
});
calculate();

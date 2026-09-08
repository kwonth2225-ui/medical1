const $ = id => document.getElementById(id);
const money = n => Math.round(n).toLocaleString("ko-KR") + "원";

function calculate() {
  const dayDist = Math.max(0, Number($("dayDistance").value) || 0);
  const nightDist = Math.max(0, Number($("nightDistance").value) || 0);
  const wait = Math.max(0, Number($("wait").value) || 0);

  const totalDist = dayDist + nightDist;

  // 10km 기본거리 공제 (주간 거리에서 먼저 차감 후 남으면 야간 거리에서 차감)
  let remainBase = 10;
  
  const dayExtraKm = Math.max(0, dayDist - remainBase);
  remainBase = Math.max(0, remainBase - dayDist);

  const nightExtraKm = Math.max(0, nightDist - remainBase);

  // 요금 계산
  const dayExtraFee = dayExtraKm * 2300;
  const nightExtraFee = nightExtraKm * 2760; // 기본 2,300원 + 거리 할증 460원

  // 할증 기본료 (19,100원) 스위치 여부
  const isBaseSurchargeOn = $("baseSurchargeToggle") ? $("baseSurchargeToggle").checked : false;
  const baseSurchargeFee = isBaseSurchargeOn ? 19100 : 0;

  // 대기요금 (30분 초과 시 10분당 6,000원)
  const waitUnits = wait <= 30 ? 0 : Math.ceil((wait - 30) / 10);
  const waitFee = waitUnits * 6000;

  // 총액 합산
  const total = 95500 + dayExtraFee + nightExtraFee + baseSurchargeFee + waitFee;

  // 화면 출력
  if ($("total")) $("total").innerHTML = Math.round(total).toLocaleString("ko-KR") + "<span>원</span>";
  if ($("baseFee")) $("baseFee").textContent = money(95500);
  if ($("totalKm")) $("totalKm").textContent = totalDist.toFixed(2) + " km";
  if ($("dayExtraFee")) $("dayExtraFee").textContent = money(dayExtraFee);
  if ($("nightExtraFee")) $("nightExtraFee").textContent = money(nightExtraFee);
  if ($("baseSurchargeFee")) $("baseSurchargeFee").textContent = money(baseSurchargeFee);
  if ($("waitFee")) $("waitFee").textContent = money(waitFee);

  const label = $("surchargeLabel");
  if (label) {
    const isSurchargeActive = isBaseSurchargeOn || nightDist > 0;
    label.textContent = isSurchargeActive ? "할증 요소 적용" : "정상요금";
    label.className = isSurchargeActive ? "active" : "normal";
  }
}

// 이벤트 리스너 연결
if ($("calc")) $("calc").addEventListener("click", calculate);

["dayDistance", "nightDistance", "wait", "baseSurchargeToggle"].forEach(id => {
  const el = $(id);
  if (el) {
    el.addEventListener("input", calculate);
    el.addEventListener("change", calculate);
  }
});

// 초기화 버튼
if ($("reset")) {
  $("reset").addEventListener("click", () => {
    if ($("dayDistance")) $("dayDistance").value = "";
    if ($("nightDistance")) $("nightDistance").value = "";
    if ($("wait")) $("wait").value = "";
    if ($("baseSurchargeToggle")) $("baseSurchargeToggle").checked = false;
    calculate();
  });
}

// 초기화 실행
if ($("baseSurchargeToggle")) $("baseSurchargeToggle").checked = false;
calculate();

const $ = id => document.getElementById(id);
const money = n => Math.round(n).toLocaleString("ko-KR") + "원";

function calculate() {
  const distance = Math.max(0, Number($("distance").value) || 0);
  const wait = Math.max(0, Number($("wait").value) || 0);

  // 추가거리 계산 (10km 초과분)
  const extraKm = Math.max(0, distance - 10);
  const extraFee = extraKm * 2300;

  // 스위치 체크 여부로만 판단 (시간 자동 체크 완전 제거)
  const isChecked = $("manualSurcharge") ? $("manualSurcharge").checked : false;
  const surchargeFee = isChecked ? (19100 + extraKm * 460) : 0;

  // 대기요금 계산 (30분 초과 시 10분당 6,000원 고정)
  const waitUnits = wait <= 30 ? 0 : Math.ceil((wait - 30) / 10);
  const waitFee = waitUnits * 6000;

  // 최종 총액 합산
  const total = 95500 + extraFee + surchargeFee + waitFee;

  // 화면 출력
  if ($("total")) $("total").innerHTML = Math.round(total).toLocaleString("ko-KR") + "<span>원</span>";
  if ($("baseFee")) $("baseFee").textContent = money(95500);
  if ($("extraKm")) $("extraKm").textContent = extraKm.toFixed(2) + " km";
  if ($("extraFee")) $("extraFee").textContent = money(extraFee);
  if ($("surchargeFee")) $("surchargeFee").textContent = money(surchargeFee);
  if ($("waitFee")) $("waitFee").textContent = money(waitFee);

  const label = $("surchargeLabel");
  if (label) {
    label.textContent = isChecked ? "할증 적용" : "정상요금";
    label.className = isChecked ? "active" : "normal";
  }
}

// 이벤트 연결
if ($("calc")) $("calc").addEventListener("click", calculate);

["distance", "wait", "manualSurcharge"].forEach(id => {
  const el = $(id);
  if (el) {
    el.addEventListener("input", calculate);
    el.addEventListener("change", calculate);
  }
});

// 초기화 버튼 클릭 시 스위치 OFF 및 초기화
if ($("reset")) {
  $("reset").addEventListener("click", () => {
    if ($("distance")) $("distance").value = "";
    if ($("wait")) $("wait").value = "";
    if ($("manualSurcharge")) $("manualSurcharge").checked = false;
    calculate();
  });
}

// 첫 진입 시 강제로 스위치 해제 상태로 세팅 후 계산
document.addEventListener("DOMContentLoaded", () => {
  if ($("manualSurcharge")) $("manualSurcharge").checked = false;
  calculate();
});

calculate();

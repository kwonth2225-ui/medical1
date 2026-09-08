// 안전한 요소 선택 함수
const $ = id => document.getElementById(id);
const money = n => Math.round(n).toLocaleString("ko-KR") + "원";

function calculate() {
  try {
    const dayEl = $("dayDistance");
    const nightEl = $("nightDistance");
    const waitEl = $("wait");
    const toggleEl = $("baseSurchargeToggle");

    const dayDist = Math.max(0, Number(dayEl ? dayEl.value : 0) || 0);
    const nightDist = Math.max(0, Number(nightEl ? nightEl.value : 0) || 0);
    const wait = Math.max(0, Number(waitEl ? waitEl.value : 0) || 0);

    const totalDist = dayDist + nightDist;

    // 10km 기본거리 차감 (주간 우선 차감)
    let remainBase = 10;
    const dayExtraKm = Math.max(0, dayDist - remainBase);
    remainBase = Math.max(0, remainBase - dayDist);
    const nightExtraKm = Math.max(0, nightDist - remainBase);

    // 요금 산정
    const dayExtraFee = dayExtraKm * 2300;
    const nightExtraFee = nightExtraKm * 2760; // 2,300원 + 거리할증 460원

    const isBaseSurchargeOn = toggleEl ? toggleEl.checked : false;
    const baseSurchargeFee = isBaseSurchargeOn ? 19100 : 0;

    const waitUnits = wait <= 30 ? 0 : Math.ceil((wait - 30) / 10);
    const waitFee = waitUnits * 6000;

    const total = 95500 + dayExtraFee + nightExtraFee + baseSurchargeFee + waitFee;

    // 화면 업데이트
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
  } catch (e) {
    console.error("계산 오류:", e);
  }
}

// 모바일 호환 이벤트 등록
function bindEvents() {
  const calcBtn = $("calc");
  const resetBtn = $("reset");

  if (calcBtn) {
    calcBtn.addEventListener("click", calculate);
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if ($("dayDistance")) $("dayDistance").value = "";
      if ($("nightDistance")) $("nightDistance").value = "";
      if ($("wait")) $("wait").value = "";
      if ($("baseSurchargeToggle")) $("baseSurchargeToggle").checked = false;
      calculate();
    });
  }

  ["dayDistance", "nightDistance", "wait", "baseSurchargeToggle"].forEach(id => {
    const el = $(id);
    if (el) {
      el.addEventListener("input", calculate);
      el.addEventListener("change", calculate);
      el.addEventListener("keyup", calculate);
    }
  });

  calculate();
}

// DOM 로드 완료 후 실행
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bindEvents);
} else {
  bindEvents();
}

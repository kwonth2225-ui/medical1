// [자동 강제 업데이트] 사용자의 기기가 구버전을 실행 중이면 자동으로 최신화
const CURRENT_VERSION = "20260908_4";
if (localStorage.getItem("app_version") !== CURRENT_VERSION) {
  localStorage.setItem("app_version", CURRENT_VERSION);
  window.location.reload(true);
}

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

    let remainBase = 10;
    const dayExtraKm = Math.max(0, dayDist - remainBase);
    remainBase = Math.max(0, remainBase - dayDist);
    const nightExtraKm = Math.max(0, nightDist - remainBase);

    const dayExtraFee = dayExtraKm * 2300;
    const nightExtraFee = nightExtraKm * 2760;

    const isBaseSurchargeOn = toggleEl ? toggleEl.checked : false;
    const baseSurchargeFee = isBaseSurchargeOn ? 19100 : 0;

    const waitUnits = wait <= 30 ? 0 : Math.ceil((wait - 30) / 10);
    const waitFee = waitUnits * 6000;

    const total = 95500 + dayExtraFee + nightExtraFee + baseSurchargeFee + waitFee;

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

function bindEvents() {
  const calcBtn = $("calc");
  const resetBtn = $("reset");

  if (calcBtn) calcBtn.addEventListener("click", calculate);

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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bindEvents);
} else {
  bindEvents();
}

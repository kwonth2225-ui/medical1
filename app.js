const CURRENT_VERSION = "20260908_11";
if (localStorage.getItem("app_version") !== CURRENT_VERSION) {
  localStorage.setItem("app_version", CURRENT_VERSION);
  window.location.reload(true);
}

const $ = id => document.getElementById(id);
const money = n => Math.round(n).toLocaleString("ko-KR") + "원";

function getCalculatedWaitMinutes() {
  const timeToggle = $("timeInputToggle");
  const isTimeMode = timeToggle ? timeToggle.checked : false;
  
  if (!isTimeMode) {
    const waitEl = $("wait");
    return Math.max(0, Number(waitEl ? waitEl.value : 0) || 0);
  }

  const arrivalEl = $("arrivalTime");
  const handoverEl = $("handoverTime");

  const arrivalVal = arrivalEl ? arrivalEl.value : "";
  const handoverVal = handoverEl ? handoverEl.value : "";

  if (!arrivalVal || !handoverVal) return 0;

  const [aH, aM] = arrivalVal.split(":").map(Number);
  const [hH, hM] = handoverVal.split(":").map(Number);

  let arrivalMinutes = aH * 60 + aM;
  let handoverMinutes = hH * 60 + hM;

  if (handoverMinutes < arrivalMinutes) {
    handoverMinutes += 24 * 60;
  }

  return handoverMinutes - arrivalMinutes;
}

function calculate() {
  try {
    const dayEl = $("dayDistance");
    const nightEl = $("nightDistance");
    const toggleEl = $("baseSurchargeToggle");
    const timeToggleEl = $("timeInputToggle");

    const dayDist = Math.max(0, Number(dayEl ? dayEl.value : 0) || 0);
    const nightDist = Math.max(0, Number(nightEl ? nightEl.value : 0) || 0);
    
    // 대기시간 분 계산
    const wait = getCalculatedWaitMinutes();

    // UI 박스 전환
    const isTimeMode = timeToggleEl ? timeToggleEl.checked : false;
    const directBox = $("directWaitBox");
    const timeBox = $("timeWaitBox");

    if (directBox) directBox.style.display = isTimeMode ? "none" : "flex";
    if (timeBox) timeBox.style.display = isTimeMode ? "flex" : "none";

    const displayEl = $("calcWaitDisplay");
    const arrivalEl = $("arrivalTime");
    const handoverEl = $("handoverTime");
    const hasTimeVal = (arrivalEl && arrivalEl.value) || (handoverEl && handoverEl.value);

    if (displayEl) {
      if (isTimeMode && hasTimeVal) {
        displayEl.textContent = `(총 대기시간 ${wait}분)`;
      } else {
        displayEl.textContent = "";
      }
    }

    const totalDist = dayDist + nightDist;

    let remainBase = 10;
    const dayExtraKm = Math.max(0, dayDist - remainBase);
    remainBase = Math.max(0, remainBase - dayDist);
    const nightExtraKm = Math.max(0, nightDist - remainBase);

    const dayExtraFee = dayExtraKm * 2300;
    const nightExtraFee = nightExtraKm * 2760;

    const isBaseSurchargeOn = toggleEl ? toggleEl.checked : false;
    const baseSurchargeFee = isBaseSurchargeOn ? 19100 : 0;

    // 대기요금 계산 (30분 초과 시 10분당 6,000원)
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
    console.error("계산 오류 발생:", e);
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
      if ($("arrivalTime")) $("arrivalTime").value = "";
      if ($("handoverTime")) $("handoverTime").value = "";
      if ($("baseSurchargeToggle")) $("baseSurchargeToggle").checked = false;
      if ($("timeInputToggle")) $("timeInputToggle").checked = false;
      calculate();
    });
  }

  const inputIds = ["dayDistance", "nightDistance", "wait", "arrivalTime", "handoverTime", "baseSurchargeToggle", "timeInputToggle"];
  
  inputIds.forEach(id => {
    const el = $(id);
    if (el) {
      el.addEventListener("input", calculate);
      el.addEventListener("change", calculate);
      el.addEventListener("click", calculate);
    }
  });

  calculate();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bindEvents);
} else {
  bindEvents();
}

const CURRENT_VERSION = "20260908_8";
if (localStorage.getItem("app_version") !== CURRENT_VERSION) {
  localStorage.setItem("app_version", CURRENT_VERSION);
  window.location.reload(true);
}

const $ = id => document.getElementById(id);
const money = n => Math.round(n).toLocaleString("ko-KR") + "원";

function getCalculatedWaitMinutes() {
  const isTimeMode = $("timeInputToggle") ? $("timeInputToggle").checked : false;
  if (!isTimeMode) {
    return Math.max(0, Number($("wait") ? $("wait").value : 0) || 0);
  }

  const arrivalVal = $("arrivalTime") ? $("arrivalTime").value : "";
  const handoverVal = $("handoverTime") ? $("handoverTime").value : "";

  if (!arrivalVal || !handoverVal) return 0;

  const [aH, aM] = arrivalVal.split(":").map(Number);
  const [hH, hM] = handoverVal.split(":").map(Number);

  let arrivalMinutes = aH * 60 + aM;
  let handoverMinutes = hH * 60 + hM;

  // 인계시간이 도착시간보다 빠른 경우 자정을 넘긴 것으로 계산 (익일 인계 완료)
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

    const dayDist = Math.max(0, Number(dayEl ? dayEl.value : 0) || 0);
    const nightDist = Math.max(0, Number(nightEl ? nightEl.value : 0) || 0);
    
    // 대기시간 계산 (도착시간 ~ 인계시간)
    const wait = getCalculatedWaitMinutes();

    // 시간 입력 모드일 경우 붉은색 글씨로 총 대기시간 표시
    const isTimeMode = $("timeInputToggle") ? $("timeInputToggle").checked : false;
    const displayEl = $("calcWaitDisplay");
    if (displayEl) {
      if (isTimeMode && ($("arrivalTime").value \vert{}\vert{} $("handoverTime").value)) {
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
    console.error("계산 오류:", e);
  }
}

function bindEvents() {
  const calcBtn = $("calc");
  const resetBtn = $("reset");
  const timeToggle = $("timeInputToggle");

  if (timeToggle) {
    timeToggle.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      if ($("directWaitBox")) $("directWaitBox").style.display = isChecked ? "none" : "flex";
      if ($("timeWaitBox")) $("timeWaitBox").style.display = isChecked ? "flex" : "none";
      calculate();
    });
  }

  if (calcBtn) calcBtn.addEventListener("click", calculate);

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if ($("dayDistance")) $("dayDistance").value = "";
      if ($("nightDistance")) $("nightDistance").value = "";
      if ($("wait")) $("wait").value = "";
      if ($("arrivalTime")) $("arrivalTime").value = "";
      if ($("handoverTime")) $("handoverTime").value = "";
      if ($("baseSurchargeToggle")) $("baseSurchargeToggle").checked = false;
      if ($("timeInputToggle")) {
        $("timeInputToggle").checked = false;
        if ($("directWaitBox")) $("directWaitBox").style.display = "flex";
        if ($("timeWaitBox")) $("timeWaitBox").style.display = "none";
      }
      calculate();
    });
  }

  ["dayDistance", "nightDistance", "wait", "arrivalTime", "handoverTime", "baseSurchargeToggle"].forEach(id => {
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

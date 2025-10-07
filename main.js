
  <script>
    let countdownInterval;
    let prayerTimesData = [];

    window.onload = function() {
      useGPS();
    };

    function setActiveButton(buttonId) {
      document.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
      if (buttonId) {
        document.getElementById(buttonId).classList.add('active');
      }
    }

    function convertTo12Hour(time) {
      let [hours, minutes] = time.split(':').map(Number);
      const period = hours < 12 ? 'ص' : 'م';
      
      if (hours === 0) {
        hours = 12;
      } else if (hours > 12) {
        hours = hours - 12;
      }
      
      return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
    }

    function calculateIqamaTime(prayerTime, minutesToAdd) {
      const [hours, minutes] = prayerTime.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes + minutesToAdd);
      const h = date.getHours().toString().padStart(2, '0');
      const m = date.getMinutes().toString().padStart(2, '0');
      return `${h}:${m}`;
    }

    function getNextPrayer() {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      for (let i = 0; i < prayerTimesData.length; i++) {
        const prayer = prayerTimesData[i];
        if (prayer.minutes > currentMinutes) {
          return { index: i, prayer: prayer };
        }
      }
      
      return { index: 0, prayer: prayerTimesData[0] };
    }

    function updateCountdown() {
      const next = getNextPrayer();
      if (!next) return;

      const now = new Date();
      const [hours, minutes] = next.prayer.time24.split(':').map(Number);
      const prayerTime = new Date();
      prayerTime.setHours(hours, minutes, 0, 0);

      if (next.index === 0 && prayerTime < now) {
        prayerTime.setDate(prayerTime.getDate() + 1);
      }

      const diff = prayerTime - now;
      
      if (diff < 0) {
        updateCountdown();
        return;
      }

      const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
      const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);

      document.getElementById('next-prayer-name').textContent = `الصلاة القادمة:  ${next.prayer.name}`;
      document.getElementById('countdown').textContent = 
        `${hoursLeft.toString().padStart(2, '0')}:${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
    }

    async function getPrayerTimes(lat, lon, city, country) {
      try {
        const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=5`);
        const data = await response.json();
        const times = data.data.timings;
        const date = data.data.date.readable;

        const iqamaTimes = {
          Fajr: calculateIqamaTime(times.Fajr, 15),
          Dhuhr: calculateIqamaTime(times.Dhuhr, 10),
          Asr: calculateIqamaTime(times.Asr, 10),
          Maghrib: calculateIqamaTime(times.Maghrib, 5),
          Isha: calculateIqamaTime(times.Isha, 10)
        };

        prayerTimesData = [
          { name: 'الفجر', time24: times.Fajr, minutes: parseInt(times.Fajr.split(':')[0]) * 60 + parseInt(times.Fajr.split(':')[1]) },
          { name: 'الظهر', time24: times.Dhuhr, minutes: parseInt(times.Dhuhr.split(':')[0]) * 60 + parseInt(times.Dhuhr.split(':')[1]) },
          { name: 'العصر', time24: times.Asr, minutes: parseInt(times.Asr.split(':')[0]) * 60 + parseInt(times.Asr.split(':')[1]) },
          { name: 'المغرب', time24: times.Maghrib, minutes: parseInt(times.Maghrib.split(':')[0]) * 60 + parseInt(times.Maghrib.split(':')[1]) },
          { name: 'العشاء', time24: times.Isha, minutes: parseInt(times.Isha.split(':')[0]) * 60 + parseInt(times.Isha.split(':')[1]) }
        ];

        const nextPrayer = getNextPrayer();

        document.getElementById("prayer-times").innerHTML = `document.getElementById("prayer-times").innerHTML = `
          <div class="city">${city}, ${country} - ${date}</div>
          <div class="header-row">
             <div class="header-item">الصلاة</div> 
            <div class="header-item">الأذان</div>
            <div class="header-item">الإقامة</div>
          </div>
          <div class="prayer-row ${nextPrayer.index === 0 ? 'next-prayer' : ''}">
             <div class="prayer-name">الفجر</div> 
            <div class="prayer-time">
              <span class="time-12">${convertTo12Hour(times.Fajr)}</span>
              <span class="time-24">${times.Fajr}</span>
            </div>
            <div class="iqama-time">
              <span class="time-12">${convertTo12Hour(iqamaTimes.Fajr)}</span>
              <span class="time-24">${iqamaTimes.Fajr}</span>
            </div>
          </div>
          <div class="prayer-row" style="background: rgba(255,193,7,0.1);">
             <div class="prayer-name" style="color: #f57c00;">الشروق</div> 
            <div class="prayer-time" style="color: #ef6c00;">
              <span class="time-12">${convertTo12Hour(times.Sunrise)}</span>
              <span class="time-24">${times.Sunrise}</span>
            </div>
             <div class="iqama-time" style="color: #e65100;">الضحى</div> 
          </div>
          <div class="prayer-row ${nextPrayer.index === 1 ? 'next-prayer' : ''}">
             <div class="prayer-name">الظهر</div> 
            <div class="prayer-time">
              <span class="time-12">${convertTo12Hour(times <span class="time-12">${convertTo12Hour (مرات. Dhuhr) } </span> Dhuhr)}</span>
              <span class="time-24">${times <Span Class="Time-24">${Times. Dhuhr}</span> Dhuhr}</span>
            </div>
            <div class="iqama-time">
              <span class="time-12">${convertTo12Hour(iqamaTimes <span class="time-12">${convertTo12Hour (iqamaTimes. Dhuhr) } </span> Dhuhr)}</span>
              <span class="time-24">${iqamaTimes <span class="time-24">${iqamaTimes. Dhuhr}</span> Dhuhr}</span>
            </div>
          </div>
          <div class="prayer-row ${nextPrayer.index === 2 ? 'next-prayer' : ''}">
              <div class="prayer-name">العصر</div>  
            <div class="prayer-time">
              <span class="time-12">${convertTo12Hour(times.Asr)}</span>
              <span class="time-24">${times.Asr}</span>
            </div>
            <div class="iqama-time">
              <span class="time-12">${convertTo12Hour(iqamaTimes.Asr)}</span>
              <span class="time-24">${iqamaTimes.Asr}</span>
            </div>
          </div>
          <div class="prayer-row ${nextPrayer.index === 3 ? 'next-prayer' : ''}">
              <div class="prayer-name">المغرب</div>  
            <div class="prayer-time">
              <span class="time-12">${convertTo12Hour(times.Maghrib)}</span>
              <span class="time-24">${times.Maghrib}</span>
            </div>
            <div class="iqama-time">
              <span class="time-12">${convertTo12Hour(iqamaTimes.Maghrib)}</span>
              <span class="time-24">${iqamaTimes.Maghrib}</span>
            </div>
          </div>
          <div class="prayer-row ${nextPrayer.index === 4 ? 'next-prayer' : ''}">
              <div class="prayer-name">العشاء</div>  
            <div class="prayer-time">
              <span class="time-12">${convertTo12Hour(times.Isha)}</span>
              <span class="time-24">${times.Isha}</span>
            </div>
            <div class="iqama-time">
              <span class="time-12">${convertTo12Hour(iqamaTimes.Isha)}</span>
              <span class="time-24">${iqamaTimes.Isha}</span>
            </div>
          </div>
          <div id="next-prayer-box">
              <div id="next-prayer-name">الصلاة القادمة:  ${nextPrayer                <div id="next-prayer-name">الصلاة القادمة:  ${nextPrayer             <div id="next-prayer-name">الصلاة القادمة:  ${nextPrayer.prayer.name}</div> prayer.name}</div>  .prayer.name}</div> prayer.name}</div>  div id="next-prayer-name">الصلاة القادمة:  ${nextPrayer             <div id="next-prayer-name">الصلاة القادمة:  ${nextPrayer.prayer.name}</div> prayer.name}</div>  .prayer.name}</div> prayer.name}</div>  
            <div id="countdown">00:00:00</div>
          </div>
        `;

        if (countdownInterval) clearInterval(countdownInterval);if (countdownInterval) clearInterval(countdownInterval);
        updateCountdown();updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);countdownInterval = setInterval(updateCountdown, 1000);
      } catch (error) {} catch (error) {
         document.getElementById("prayer-times").innerHTML = `<div style="color: #d32f2f; padding: 20px;">حدث خطأ في جلب مواقيت الصلاة. يرجى المحاولة مرة أخرى.</div>`; document.getElementById("prayer-times").innerHTML = `<div style="color: #d32f2f; padding: 20px;">حدث خطأ في جلب مواقيت الصلاة. يرجى المحاولة مرة أخرى.</div>`;  
      }}
    }}

    function useGPS() {function useGPS() {
      setActiveButton('btn-gps');setActiveButton('btn-gps');
      document.getElementById("manual-input").style.display = "none";document.getElementById("manual-input").style.display = "none";
      document.getElementById("prayer-times").innerHTML = `document.getElementById("prayer-times").innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; padding: 20px;">
            <span class="loading"></span> جاري تحديد موقعك عبر GPS للحصول على مواقيت دقيقة...  
        </div>
      `;
      if (navigator.geolocation) {if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async pos => {navigator.geolocation.getCurrentPosition(async pos => {
          const lat = pos.coords.latitude;const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;const lon = pos.coords.longitude;
          try {try {
            const locRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);const locRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
            const locData = await locRes.json();const locData = await locRes.json();
            const city = locData.address.city || locData.address.town || locData.address.village || "موقعك الحالي";const city = locData.address.city || locData.address.town || locData.address.village || "موقعك الحالي";
            const country = locData.address.country || "";const country = locData.address.country || "";
            getPrayerTimes(lat, lon, city, country);getPrayerTimes(lat, lon, city, country);
          } catch {} catch {
            document.getElementById("prayer-times").innerHTML = `document.getElementById("prayer-times").innerHTML = `
              <div style="color: #d32f2f; padding: 20px;">
                  تعذر تحديد اسم الموقع. جاري عرض مواقيت الصلاة لموقعك الحالي.  
              </div>
            `;
             getPrayerTimes(lat, lon, "موقعك الحالي", ""); getPrayerTimes(lat, lon, "موقعك الحالي", "");  
          }}
        }, () => {}, () => {
          document.getElementById("prayer-times").innerHTML = `document.getElementById("prayer-times").innerHTML = `
            <div style="color: #d32f2f; padding: 20px;">
                فشل تحديد الموقع الجغرافي. يرجى التأكد من منح الإذن للوصول إلى موقعك أو استخدام طريقة أخرى.  
            </div>
          `;
          document.getElementById("prayer-times").innerHTML += `document.getElementById("prayer-times").innerHTML += `
            <div style="margin-top: 15px;">
                <p>يمكنك استخدام:</p>  
                <button onclick="useIP()" style="margin: 5px;">التحديد التلقائي</button>  
                <button onclick="showManual()" style="margin: 5px;">الإدخال اليدوي</button>  
            </div>
          `;
        });});
      } else {} else {
        document.getElementById("prayer-times").innerHTML = `document.getElementById("prayer-times").innerHTML = `
          <div style="color: #d32f2f; padding: 20px;">
              المتصفح لا يدعم تحديد الموقع الجغرافي. يرجى استخدام طريقة أخرى.  
          </div>
        `;
      }}
    }}

    async function useIP() {async function useIP() {
      setActiveButton('btn-ip');setActiveButton('btn-ip');
      document.getElementById("manual-input").style.display = "none";document.getElementById("manual-input").style.display = "none";
      document.getElementById("prayer-times").innerHTML = `document.getElementById("prayer-times").innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; padding: 20px;">
            <span class="loading"></span> جاري تحديد موقعك تلقائيًا...  
        </div>
      `;
      try {try {
        const res = await fetch("https://ipapi.co/json/");const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();const data = await res.json();
        await getPrayerTimes(data.latitude, data.longitude, data.city, data.country_name);await getPrayerTimes(data.latitude, data.longitude, data.city, data.country_name);
      } catch {} catch {
        document.getElementById("prayer-times").innerHTML = `document.getElementById("prayer-times").innerHTML = `
          <div style="color: #d32f2f; padding: 20px;">
              تعذر تحديد الموقع عبر IP. يرجى المحاولة باستخدام طريقة أخرى.  
          </div>
        `;
      }}
    }}

    function showManual() {function showManual() {
      setActiveButton('btn-manual');setActiveButton('btn-manual');
      document.getElementById("manual-input").style.display = "block";document.getElementById("manual-input").style.display = "block";
       document.getElementById("prayer-times").innerHTML = "يرجى إدخال اسم الدولة والمدينة بشكل صحيح تماماً ثم النقر على 'عرض المواقيت'."; document.getElementById("prayer-times").innerHTML = "يرجى إدخال اسم الدولة والمدينة بشكل صحيح تماماً ثم النقر على 'عرض المواقيت'.";  
    }}

    async function useManual() {async function useManual() {
      const city = document.getElementById("city").value.trim();const city = document.getElementById("city").value.trim();
      const country = document.getElementById("country").value.trim();const country = document.getElementById("country").value.trim();
      if (!city || !country) {if (!city || !country) {
         alert("يرجى إدخال الدولة والمدينة بشكل صحيح تماماً."); alert("يرجى إدخال الدولة والمدينة بشكل صحيح تماماً.");  
        return;return;
      }}
      document.getElementById("prayer-times").innerHTML = `document.getElementById("prayer-times").innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; padding: 20px;">
           <span class="loading"></span> جاري جلب المواقيت... 
        </div>
      `;
      try {try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?city=${city}&country=${country}&format=json&limit=1`);const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?city=${city}&country=${country}&format=json&limit=1`);
        const geoData = await geoRes.json();const geoData = await geoRes.json();
        if (geoData.length === 0) {if (geoData.length === 0) {
          document.getElementById("prayer-times").innerHTML = `document.getElementById("prayer-times").innerHTML = `
            <div style="color: #d32f2f; padding: 20px;">
               لم يتم العثور على الموقع. يرجى التأكد من صحة اسم المدينة والدولة بشكل صحيح تماماً. 
            </div>
          `;
          return;return;
        }}
        const lat = geoData[0].lat;const lat = geoData[0].lat;
        const lon = geoData[0].lon;const lon = geoData[0].lon;
        getPrayerTimes(lat, lon, city, country);getPrayerTimes(lat, lon, city, country);
      } catch {} catch {
        document.getElementById("prayer-times").innerHTML = `document.getElementById("prayer-times").innerHTML = `
          <div style="color: #d32f2f; padding: 20px;">
             حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى. 
          </div>
        `;
      }}
    }}
  </script>

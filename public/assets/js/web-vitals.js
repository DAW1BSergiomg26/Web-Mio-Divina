// Core Web Vitals Monitoring
// Agregar antes del cierre </body> en todas las páginas

(function() {
  'use strict';
  
  // Configuración
  const CWV_CONFIG = {
    reportToGA: true,
    debug: false
  };

  // Función para enviar métricas a GA4
  function sendToGA(name, value, id) {
    if (typeof gtag !== 'undefined') {
      gtag('event', name, {
        metric_name: name,
        metric_value: Math.round(value),
        metric_id: id,
        debug_mode: CWV_CONFIG.debug ? '1' : '0'
      });
    }
  }

  // CLS - Cumulative Layout Shift
  function measureCLS() {
    let clsValue = 0;
    let clsEntries = [];
    let sessionValue = 0;
    let sessionEntries = [];

    const observer = new PerformanceObserver(function(list) {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          if (entry.entryType === 'layout-shift') {
            if (!entry.value) continue;
            
            clsEntries.push(entry);
            sessionEntries.push(entry);
            
            clsValue += entry.value;
            sessionValue += entry.value;
            
            if (sessionValue > 0.3) {
              sessionEntries = [];
              sessionValue = 0;
            }
          }
        }
      }
    });

    observer.observe({ type: 'layout-shift', buffered: true });

    document.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'hidden') {
        observer.disconnect();
        if (clsValue > 0) {
          sendToGA('web_vitals_cls', clsValue * 1000, 'CLS');
          if (CWV_CONFIG.debug) {
            console.log('CLS:', clsValue);
          }
        }
      }
    });
  }

  // LCP - Largest Contentful Paint
  function measureLCP() {
    let lcpValue = 0;
    let lcpEntry = null;

    const observer = new PerformanceObserver(function(list) {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry && lastEntry.renderTime > lcpValue) {
        lcpValue = lastEntry.renderTime;
        lcpEntry = lastEntry;
      }
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });

    document.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'hidden') {
        observer.disconnect();
        if (lcpValue > 0) {
          sendToGA('web_vitals_lcp', lcpValue, 'LCP');
          if (CWV_CONFIG.debug) {
            console.log('LCP:', lcpValue);
          }
        }
      }
    });

    // Fallback para páginas que no tienen LCP
    setTimeout(function() {
      if (lcpValue === 0) {
        const timing = performance.getEntriesByType('navigation')[0];
        if (timing) {
          lcpValue = timing.loadEventEnd;
          if (lcpValue > 0) {
            sendToGA('web_vitals_lcp', lcpValue, 'LCP');
          }
        }
      }
    }, 3000);
  }

  // FID - First Input Delay
  function measureFID() {
    const observer = new PerformanceObserver(function(list) {
      const entries = list.getEntries();
      const firstEntry = entries[0];
      if (firstEntry && firstEntry.processingStart - firstEntry.startTime > 0) {
        const fid = firstEntry.processingStart - firstEntry.startTime;
        sendToGA('web_vitals_fid', fid, 'FID');
        if (CWV_CONFIG.debug) {
          console.log('FID:', fid);
        }
      }
    });

    observer.observe({ type: 'first-input', buffered: true });
  }

  // INP - Interaction to Next Paint (nuevo)
  function measureINP() {
    let maxINP = 0;
    let lastEntry = null;

    const observer = new PerformanceObserver(function(list) {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'event') {
          const inp = entry.processingStart - entry.startTime;
          if (inp > maxINP) {
            maxINP = inp;
            lastEntry = entry;
          }
        }
      }
    });

    observer.observe({ type: 'event', buffered: true, durationThreshold: 16 });

    document.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'hidden' && maxINP > 0) {
        observer.disconnect();
        sendToGA('web_vitals_inp', maxINP, 'INP');
        if (CWV_CONFIG.debug) {
          console.log('INP:', maxINP);
        }
      }
    });
  }

  // Iniciar medición
  if (document.readyState === 'complete') {
    measureCLS();
    measureLCP();
    measureFID();
    measureINP();
  } else {
    window.addEventListener('load', function() {
      measureCLS();
      measureLCP();
      measureFID();
      measureINP();
    });
  }

  // Exponer función global
  window.CWVMonitor = {
    getCLS: function() { return 0; },
    getLCP: function() { return 0; },
    getFID: function() { return 0; },
    getINP: function() { return 0; }
  };

  console.log('📊 Core Web Vitals monitoring initialized');
})();
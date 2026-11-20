/* Minimal boot: the portfolio opens directly, with no blocking intro. */
(function () {
  var R = window.REA, html = document.documentElement;
  function boot() {
    html.classList.remove('intro-on','journeying');
    html.classList.add('no-intro');
    R.portfolio.init();
    R.portfolio.reveal({ instant: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

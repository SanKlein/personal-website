var adjectives = ['Hardworking', 'Optimistic', 'Positive', 'Ambitious', 'Growing', 'Passionate', 'Persistent', 'Patient', 'Creative'];
var nouns = ['Entrepreneur', 'Creator', 'Programmer', 'Engineer', 'Scholar', 'Artist', 'Software Developer', 'Music Lover'];

var navBarConst = 300;

var debounce = function(func, wait = 20, immediate = true) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

var getRandom = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

var init = function() {
  var navBar = document.querySelector('.navbar');
  var navButtons = document.querySelector('.navbar-buttons');
  var navBarButtons = document.querySelectorAll('.navbar-button');
  var title = document.querySelector('.title');
  var adjective = '';
  var noun = '';

  var changeNavBar = function(e) {
    var scroll = window.scrollY;

    if (scroll < 0) {
      navBar.style.backgroundColor = 'rgba(255, 255, 255, 0)';
      navBar.style.height = '80px';
      navButtons.style.height = '80px';
      navBarButtons.forEach(function(button) {
        button.style.height = '80px';
        button.style.lineHeight = '80px';
        button.style.color = '#FFF';
      })
    } else if (scroll > navBarConst) {
      navBar.style.backgroundColor = 'rgba(255, 255, 255, 1)';
      navBar.style.height = '60px';
      navButtons.style.height = '60px';
      navBarButtons.forEach(function(button) {
        button.style.height = '60px';
        button.style.lineHeight = '60px';
        button.style.color = '#424242';
      })
    } else {
      var opacity = parseFloat((scroll / navBarConst).toFixed(2));
      var height = 80 - Math.round(20 * parseFloat(scroll / navBarConst));
      navBar.style.backgroundColor = 'rgba(255, 255, 255, ' + opacity + ')';
      navBar.style.height = height + 'px';
      navButtons.style.height = height + 'px';
      navBarButtons.forEach(function(button) {
        button.style.height = height + 'px';
        button.style.lineHeight = height + 'px';
        button.style.color = opacity > .5 ? '#424242' : '#FFF';
      })
    }
  };

  var getNewWord = function(word, arr) {
    var newWord = getRandom(arr);
    return word !== newWord ? newWord : getNewWord(word, arr);
  };

  var changeTitle = function(interval = 1000) {
    title.classList.add('changing');
    setTimeout(function() {
      adjective = getNewWord(adjective, adjectives);
      noun = getNewWord(noun, nouns);
      title.innerHTML = adjective + ' ' + noun;
      title.classList.remove('changing');
    }, interval);
  };

  var scrollTo = function(element, to, duration) {
    if (duration <= 0) return;
    var difference = to - element.scrollTop;
    var perTick = difference / duration * 10;

    setTimeout(function() {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) return;
        scrollTo(element, to, duration - 10);
    }, 10);
  };

  var scrollToButton = function(e, button) {
    e.preventDefault();
    var section = document.querySelector('#' + button.dataset.link);
    scrollTo(document.body, section.offsetTop, 500);
  };

  var checkHighlight = function(e) {
    navBarButtons.forEach(function(button) {
      var section = document.querySelector('#' + button.dataset.link);
      var highlightAt = section.offsetTop;
      var unhighlightAt = section.offsetTop + section.offsetHeight;
      if (window.scrollY >= highlightAt && window.scrollY < unhighlightAt) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    })
  };

  window.addEventListener('scroll', changeNavBar);

  changeTitle(0);
  setInterval(changeTitle, 5000);

  navBarButtons.forEach(function(button) {
    button.addEventListener('click', (e) => scrollToButton(e, button));
  });

  checkHightLight();
  window.addEventListener('scroll', checkHighlight)
}

window.onload = init();

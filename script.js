/* ====== 1. LOADING SCREEN ====== */
window.addEventListener("load", function () {
  var loader = document.getElementById("loader");
  if (loader) {
    setTimeout(function () { loader.classList.add("hide"); }, 1200);
  }
});

/* ====== 2. CONFETTI ====== */
function launchConfetti(total) {
  var colors = ["#ff7aa2", "#ffd6a5", "#bde0fe", "#caffbf", "#fdffb6"];
  total = total || 60;
  for (var i = 0; i < total; i++) {
    var c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDuration = 2 + Math.random() * 2 + "s";
    document.body.appendChild(c);
    setTimeout(function (el) { el.remove(); }, 4500, c);
  }
}

/* ====== 3. EFEK BILA WEBSITE DIBUKA ====== */
document.addEventListener("DOMContentLoaded", function () {

  // (a) Bentuk di hero bergerak ikut mouse
  var hero = document.querySelector(".hero");
  if (hero) {
    var shapes = hero.querySelectorAll(".shape");
    hero.addEventListener("mousemove", function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 2;
      var y = (e.clientY / window.innerHeight - 0.5) * 2;
      shapes.forEach(function (s, i) {
        var speed = (i + 1) * 12;
        s.style.transform = "translate(" + (x * speed) + "px," + (y * speed) + "px)";
      });
    });
  }

  // (b) Kad, video dan soalan muncul perlahan bila scroll
  var items = document.querySelectorAll(".card, .video-box, .question, .minitask");
  items.forEach(function (el) { el.classList.add("reveal"); });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        el.classList.add("show");
        observer.unobserve(el);
        // lepas siap animasi, buang supaya hover effect berfungsi
        setTimeout(function () { el.classList.remove("reveal", "show"); }, 900);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(function (el) { observer.observe(el); });

  // (c) Klik kad = confetti kecil
  document.querySelectorAll(".card").forEach(function (card) {
    card.addEventListener("click", function () { launchConfetti(25); });
  });
});

/* ====== 4. MINI TASK (Learning pages) ====== */
function checkMiniTask(isCorrect) {
  var msg = document.getElementById("taskMsg");
  if (isCorrect) {
    msg.textContent = "Hooray! You got it!";
    msg.style.color = "#2e9d57";
    launchConfetti();
  } else {
    msg.textContent = "Oops! Try again, you can do it!";
    msg.style.color = "#e0702c";
  }
}

/* ====== 5. QUIZ LOGIC ====== */
var congratsMsgs = ["Great job!", "You are so smart!", "Well done!", "Super!"];
var motivateMsgs = ["Don't give up, try again!", "Nice try! You can do it!", "Keep going, you are learning!"];

function randomMsg(list) {
  return list[Math.floor(Math.random() * list.length)];
}

/* CheckAnswer(): semak jawapan, kira skor, mesej, disable radio */
function CheckAnswer() {
  var form = document.getElementById("quizForm");
  var first = parseInt(form.getAttribute("data-first"));
  var count = parseInt(form.getAttribute("data-count"));
  var score = 0;

  for (var i = first; i < first + count; i++) {
    var chosen = document.querySelector('input[name="Q' + i + '"]:checked');
    if (!chosen) {
      alert("Please answer Question " + i + " first!");
      return;
    }
  }

  for (var q = first; q < first + count; q++) {
    var picked = document.querySelector('input[name="Q' + q + '"]:checked');
    var fb = document.getElementById("fb" + q);

    if (picked.value === "true") {
      score++;
      fb.textContent = randomMsg(congratsMsgs);
      fb.className = "feedback correct";
    } else {
      fb.textContent = randomMsg(motivateMsgs);
      fb.className = "feedback wrong";
    }

    var radios = document.getElementsByName("Q" + q);
    for (var r = 0; r < radios.length; r++) {
      radios[r].disabled = true;
    }
  }

  var result = document.getElementById("result");
  result.style.display = "block";
  result.textContent = "Your score: " + score + " / " + count;
  document.getElementById("submitBtn").disabled = true;

  if (score === count) { launchConfetti(); }
  result.scrollIntoView({ behavior: "smooth" });
}

/* TakeQuizAgain(): reset form dan semua perubahan DOM */
function TakeQuizAgain() {
  var form = document.getElementById("quizForm");
  var first = parseInt(form.getAttribute("data-first"));
  var count = parseInt(form.getAttribute("data-count"));

  form.reset();

  for (var q = first; q < first + count; q++) {
    var fb = document.getElementById("fb" + q);
    fb.textContent = "";
    fb.className = "feedback";
    var radios = document.getElementsByName("Q" + q);
    for (var r = 0; r < radios.length; r++) {
      radios[r].disabled = false;
    }
  }

  var result = document.getElementById("result");
  result.style.display = "none";
  result.textContent = "";
  document.getElementById("submitBtn").disabled = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
// Kontexo one-pager: entrances, the first screen's animation, the case's three screenshots,
// links to one question and the mail. No tracking, no third parties. Without scripts the page
// still reads in full and the animation stands finished.
const phone = window.matchMedia("(max-width: 680px)").matches

// Entrances: each part rises once as its section arrives.
const arrive = (margin, threshold) => {
  const seen = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        e.target.classList.add("is-in")
        seen.unobserve(e.target)
      }
    },
    { rootMargin: `0px 0px ${margin} 0px`, threshold },
  )
  return seen
}
// A part rises as it comes into view. Deep in a long page it is shown ahead of the scroll instead:
// on a phone the whole page (many screens, scrolled fast), on a wide screen its last third, where
// a reader jumping to the contact, or a tool that only walks the first screens, must not meet
// parts still waiting to arrive.
const inView = arrive("-8%", 0.08)
const ahead = arrive(phone ? "600%" : "160%", 0)
const deep = document.documentElement.scrollHeight * 0.68
for (const el of document.querySelectorAll(".reveal")) {
  const far = phone || el.getBoundingClientRect().top + scrollY > deep
  ;(far ? ahead : inView).observe(el)
}
// The hero stage is on the first screen: its shutter opens right away.
const stage = document.querySelector(".stage")
if (stage) requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.add("is-in")))

// The animation is demo.js, built from demo/ on React Flow.

// A link to one question (kontexo.at/#kosten) opens that answer.
const openAsked = () => {
  const q = location.hash && document.querySelector(`details${CSS.escape(location.hash)}`)
  if (q) {
    q.open = true
    q.scrollIntoView()
  }
}
openAsked()
window.addEventListener("hashchange", openAsked)

// The first meeting: a written mail, opened in the visitor's own mail program.
const ask = document.querySelector(".ask")
if (ask) {
  ask.addEventListener("submit", (e) => {
    e.preventDefault()
    const who = ask.querySelector("#wer").value.trim()
    const what = ask.querySelector("#was").value.trim()
    const body =
      "Hallo,\n\nwir würden Kontexo gern kennenlernen.\n\n" +
      (who ? `${who}\n` : "") +
      (what ? `\n${what}\n` : "")
    window.location.href = `mailto:michael@kontexo.at?subject=${encodeURIComponent("Erstgespräch Kontexo")}&body=${encodeURIComponent(body)}`
  })
}

// Mail address and number: with a mouse, a press copies it. A number dials nothing on a desktop,
// and the mail program is the form above. A phone keeps what a tap does there: write, or call.
if (navigator.clipboard && window.matchMedia("(hover: hover)").matches) {
  document.documentElement.classList.add("can-copy")
  for (const a of document.querySelectorAll(".contact-rows a")) {
    const say = a.nextElementSibling
    const icon = a.previousElementSibling.querySelector("use")
    const own = icon.getAttribute("href")
    a.addEventListener("click", (e) => {
      e.preventDefault()
      navigator.clipboard.writeText(a.textContent).then(
        () => {
          say.textContent = "Kopiert"
          icon.setAttribute("href", "#i-check")
          setTimeout(() => {
            say.textContent = ""
            icon.setAttribute("href", own)
          }, 1800)
        },
        // The browser refused the clipboard: do what the link does.
        () => window.location.assign(a.href),
      )
    })
  }
}

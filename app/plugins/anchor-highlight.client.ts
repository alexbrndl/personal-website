export default defineNuxtPlugin(() => {
  function cleanup() {
    document.querySelectorAll('.anchor-highlight').forEach((span) => {
      const parent = span.parentElement
      if (!parent) return
      while (span.firstChild) {
        parent.insertBefore(span.firstChild, span)
      }
      span.remove()
    })
  }

  function highlight(hash: string) {
    const id = hash.replace('#', '')
    if (!id) return

    const el = document.getElementById(id)
    if (!el) return

    cleanup()

    // Wrap children in a span so the highlight fits the text only
    const span = document.createElement('span')
    span.className = 'anchor-highlight'
    while (el.firstChild) {
      span.appendChild(el.firstChild)
    }
    el.prepend(span)

    span.addEventListener('animationend', () => {
      while (span.firstChild) {
        el.insertBefore(span.firstChild, span)
      }
      span.remove()
    }, { once: true })
  }

  // Highlight on anchor click
  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest('a[href*="#"]')
    if (!link) return

    const href = link.getAttribute('href')
    if (!href) return

    const hashIndex = href.indexOf('#')
    if (hashIndex === -1) return

    const path = href.slice(0, hashIndex)
    if (path && path !== window.location.pathname) return

    if (!window.location.pathname.startsWith('/projects/')) return

    const hash = href.slice(hashIndex)
    setTimeout(() => highlight(hash), 100)
  })

  // Highlight on initial load with hash
  if (window.location.pathname.startsWith('/projects/') && window.location.hash) {
    setTimeout(() => highlight(window.location.hash), 300)
  }
})

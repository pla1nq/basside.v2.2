import videoData from '../videos.json'
import { initVideoModal } from './videoModal.js'

export default function tabsVideoModule() {
  const openModal = initVideoModal()
  const tabsContent = document.querySelectorAll('[data-js-tabs-content]')
  const tabsButtons = document.querySelectorAll('[data-js-tabs-button]')
  const keys = Object.keys(videoData)

  // Динамический импорт всех картинок из src/assets/images и всех подпапок
  const images = import.meta.glob('../../assets/images/**/*', {
    eager: true,
    import: 'default',
  })

  tabsContent.forEach((tab, index) => {
    const list = tab.querySelector('.tabs__content-list')
    const videos = videoData[keys[index]] || []

    const initialVideos = videos.slice(0, 4)
    const remainingVideos = videos.slice(4)

    list.innerHTML = ''

    // Первые 4 видимые
    initialVideos.forEach(v => {
      const li = document.createElement('li')
      li.className = 'tabs__content-item'
      li.innerHTML = `
        <article class="work-card" data-video-id="${v.videoId}">
          <figure class="work-card__figure">
            <img class="work-card__preview" src="${images[`../../assets/images/${v.src}`]}" alt="${v.alt}" loading="lazy" />
            <button type="button" class="work-card__play" aria-label="Watch video">
              <svg class="work-card__play-icon">
                <use xlink:href="icons/sprites.svg#play"></use>
              </svg>
            </button>
          </figure>
        </article>
      `
      list.appendChild(li)

      li.querySelector('.work-card').addEventListener('click', () =>
        openModal(v.videoId)
      )
    })

    // Кнопка More
    if (remainingVideos.length) {
      const moreBtn = document.createElement('button')
      moreBtn.className = 'tabs__more-btn btn'
      moreBtn.textContent = 'More'
      list.after(moreBtn)

      moreBtn.addEventListener('click', () => {
        remainingVideos.forEach((v, i) => {
          const li = document.createElement('li')
          li.className = 'tabs__content-item'
          li.innerHTML = `
            <article class="work-card is-hidden" data-video-id="${v.videoId}">
              <figure class="work-card__figure">
                <img class="work-card__preview" src="${images[`../../assets/images/${v.src}`]}" alt="${v.alt}" loading="lazy" />
                <button type="button" class="work-card__play" aria-label="Watch video">
                  <svg class="work-card__play-icon">
                    <use xlink:href="icons/sprites.svg#play"></use>
                  </svg>
                </button>
              </figure>
            </article>
          `
          list.appendChild(li)

          const card = li.querySelector('.work-card')
          card.addEventListener('click', () => openModal(v.videoId))

          // Плавное появление
          setTimeout(() => {
            card.classList.remove('is-hidden')
            card.classList.add('is-visible')
          }, i * 100)
        })

        moreBtn.remove()
      })
    }

    // скрываем все вкладки кроме активной
    if (!tabsButtons[index].classList.contains('is-active')) {
      tab.classList.add('is-hidden')
    }
  })

  // Переключение табов
  tabsButtons.forEach((btn, index) => {
    btn.setAttribute('type', 'button')
    btn.addEventListener('click', e => {
      e.preventDefault()
      tabsButtons.forEach(b => b.classList.remove('is-active'))
      btn.classList.add('is-active')
      tabsContent.forEach(tab => tab.classList.add('is-hidden'))
      tabsContent[index].classList.remove('is-hidden')
    })
  })
}

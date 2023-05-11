import createMD from 'markdown-it'
import hljs from 'highlight.js/lib/common'
// @ts-expect-error no type file
import mk from 'markdown-it-katex'

export const renderer = createMD({
  html: true,
  xhtmlOut: true,
  breaks: true,
  linkify: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      }
      catch (err) {
        console.error(err)
      }
    }
    return ''
  },
  typographer: true,
}).use(mk)


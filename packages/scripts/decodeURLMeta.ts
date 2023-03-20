export async function getMeta(url: string) {
  const respnse = await fetch(url)
  const text = await respnse.text()

  const div = document.createElement('div')
  div.innerHTML = text
  const entries = Array.from(div.querySelectorAll('meta'))
    .map(({ name: metaName, content, attributes }) => {
      const property = attributes.getNamedItem('property')
      const name = metaName || property?.value
      return [name, content]
    })

  return Object.fromEntries(entries) as Record<string, string>
}

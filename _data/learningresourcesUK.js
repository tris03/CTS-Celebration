const sanityClient = require('@sanity/client')
const projectId = "3vgpwmyb"
const apiToken = ''
const client = sanityClient({
  projectId,
  dataset: 'production',
  token: '',
  useCdn: false
})

module.exports = async function () {
  const query = `
    *[ _type == "learningresourcesUK" && !(_id in path("drafts.**")) ]{
      title, 
      mainContent,
      "documentUrl": document.asset->url
    } | order(publishedAt desc)
  `
  const params = {}
  
  return await client.fetch(query, params)
}
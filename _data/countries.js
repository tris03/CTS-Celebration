const sanityClient = require('@sanity/client')
const projectId = "3vgpwmyb"
const apiToken = ''
const client = sanityClient({
  projectId,
  dataset: 'production',
  token: '',
  useCdn: true
})

module.exports = async function () {
  const query = `
    *[ _type == "country" && !(_id in path("drafts.**")) ]{
      name,
      mainContent,
      "flagImageUrl": flag.asset->url
    } | order(name asc)
  `
  const params = {}
  
  return await client.fetch(query, params)
}
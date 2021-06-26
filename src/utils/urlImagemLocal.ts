interface Missa {
  local_url: string
}

const urlImagemLocal = (missas: Missa[]) => missas.map(missa => (
  { ...missa, local_url: `${process.env.URL_BANCO}/uploads/fotosLocais/${missa.local_url}` }
))

export { urlImagemLocal }
